import {
  ExamSet,
  ExamSession,
  ExamResult,
  Question,
  QuestionStatus,
} from "@/types/exam";

export function createSession(examId: string, durationSeconds: number): ExamSession {
  const now = Date.now();
  return {
    examId,
    durationSeconds,
    startedAt: now,
    endsAt: now + durationSeconds * 1000,
    currentIndex: 0,
    answers: {},
    marked: {},
    visited: {},
    timeSpentMs: {},
    answerChangeCount: {},
  };
}

export function questionStatus(session: ExamSession, q: Question): QuestionStatus {
  const answered = session.answers[q.id] != null;
  const marked = !!session.marked[q.id];
  const visited = !!session.visited[q.id];

  if (marked && answered) return "answered-marked";
  if (marked) return "marked";
  if (answered) return "answered";
  if (visited) return "not-answered";
  return "not-visited";
}

export interface SubjectStat {
  subject: string;
  total: number;
  attempted: number;
  correct: number;
  incorrect: number;
  unanswered: number;
  accuracy: number; // % of attempted that were correct
  avgTimeMs: number;
}

export interface QuestionAnalysis {
  id: string;
  index: number;
  subject: string;
  topic: string;
  difficulty: string;
  text: string;
  options: string[];
  correctAnswerIndex: number;
  userAnswerIndex: number | null;
  isAnswered: boolean;
  isCorrect: boolean;
  timeSpentMs: number;
  changed: boolean;
  marked: boolean;
  explanation?: string;
}

export interface ResultAnalytics {
  totalQuestions: number;
  attempted: number;
  unanswered: number;
  correct: number;
  incorrect: number;
  score: number;
  maxScore: number;
  percentage: number;
  accuracyPercentage: number;
  timeTakenMs: number;
  remainingSeconds: number;
  autoSubmitted: boolean;
  averageTimePerQuestionMs: number;
  mostTimeConsuming: QuestionAnalysis[];
  quickestAnswered: QuestionAnalysis[];
  changedAnswers: QuestionAnalysis[];
  subjectStats: SubjectStat[];
  weakAreas: SubjectStat[];
  strongAreas: SubjectStat[];
  questions: QuestionAnalysis[];
}

export function computeAnalytics(exam: ExamSet, result: ExamResult): ResultAnalytics {
  const questions: QuestionAnalysis[] = exam.questions.map((q, index) => {
    const userAnswerIndex = result.answers[q.id] ?? null;
    const isAnswered = userAnswerIndex != null;
    const isCorrect = isAnswered && userAnswerIndex === q.correctAnswerIndex;
    return {
      id: q.id,
      index,
      subject: q.subject,
      topic: q.topic,
      difficulty: q.difficulty,
      text: q.text,
      options: q.options,
      correctAnswerIndex: q.correctAnswerIndex,
      userAnswerIndex,
      isAnswered,
      isCorrect,
      timeSpentMs: result.timeSpentMs[q.id] ?? 0,
      changed: (result.answerChangeCount[q.id] ?? 0) > 0,
      marked: !!result.marked[q.id],
      explanation: q.explanation,
    };
  });

  const totalQuestions = questions.length;
  const attempted = questions.filter((q) => q.isAnswered).length;
  const unanswered = totalQuestions - attempted;
  const correct = questions.filter((q) => q.isCorrect).length;
  const incorrect = attempted - correct;

  const score = correct * exam.markingScheme.correct - incorrect * exam.markingScheme.incorrect;
  const maxScore = totalQuestions * exam.markingScheme.correct;
  const percentage = maxScore > 0 ? (score / maxScore) * 100 : 0;
  const accuracyPercentage = attempted > 0 ? (correct / attempted) * 100 : 0;

  const timeTakenMs = Math.max(0, result.submittedAt - result.startedAt);
  const totalTimeSpent = questions.reduce((sum, q) => sum + q.timeSpentMs, 0);
  const averageTimePerQuestionMs = totalQuestions > 0 ? totalTimeSpent / totalQuestions : 0;

  const answeredSorted = questions.filter((q) => q.isAnswered);
  const mostTimeConsuming = [...questions]
    .sort((a, b) => b.timeSpentMs - a.timeSpentMs)
    .slice(0, 5);
  const quickestAnswered = [...answeredSorted]
    .sort((a, b) => a.timeSpentMs - b.timeSpentMs)
    .slice(0, 5);
  const changedAnswers = questions.filter((q) => q.changed);

  const subjectMap = new Map<string, QuestionAnalysis[]>();
  for (const q of questions) {
    const list = subjectMap.get(q.subject) ?? [];
    list.push(q);
    subjectMap.set(q.subject, list);
  }
  const subjectStats: SubjectStat[] = Array.from(subjectMap.entries()).map(
    ([subject, qs]) => {
      const subjAttempted = qs.filter((q) => q.isAnswered).length;
      const subjCorrect = qs.filter((q) => q.isCorrect).length;
      const subjIncorrect = subjAttempted - subjCorrect;
      const subjTime = qs.reduce((sum, q) => sum + q.timeSpentMs, 0);
      return {
        subject,
        total: qs.length,
        attempted: subjAttempted,
        correct: subjCorrect,
        incorrect: subjIncorrect,
        unanswered: qs.length - subjAttempted,
        accuracy: subjAttempted > 0 ? (subjCorrect / subjAttempted) * 100 : 0,
        avgTimeMs: qs.length > 0 ? subjTime / qs.length : 0,
      };
    }
  );

  const attemptedSubjects = subjectStats.filter((s) => s.attempted > 0);
  const weakAreas = attemptedSubjects
    .filter((s) => s.accuracy < 50)
    .sort((a, b) => a.accuracy - b.accuracy);
  const strongAreas = attemptedSubjects
    .filter((s) => s.accuracy >= 75)
    .sort((a, b) => b.accuracy - a.accuracy);

  return {
    totalQuestions,
    attempted,
    unanswered,
    correct,
    incorrect,
    score,
    maxScore,
    percentage,
    accuracyPercentage,
    timeTakenMs,
    remainingSeconds: result.remainingSeconds,
    autoSubmitted: result.autoSubmitted,
    averageTimePerQuestionMs,
    mostTimeConsuming,
    quickestAnswered,
    changedAnswers,
    subjectStats,
    weakAreas,
    strongAreas,
    questions,
  };
}

export function formatDuration(ms: number): string {
  const totalSeconds = Math.max(0, Math.round(ms / 1000));
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  if (h > 0) {
    return `${h}h ${m}m ${s}s`;
  }
  if (m > 0) {
    return `${m}m ${s}s`;
  }
  return `${s}s`;
}

export function formatClock(totalSeconds: number): string {
  const clamped = Math.max(0, Math.round(totalSeconds));
  const h = Math.floor(clamped / 3600);
  const m = Math.floor((clamped % 3600) / 60);
  const s = clamped % 60;
  const pad = (n: number) => n.toString().padStart(2, "0");
  if (h > 0) {
    return `${pad(h)}:${pad(m)}:${pad(s)}`;
  }
  return `${pad(m)}:${pad(s)}`;
}
