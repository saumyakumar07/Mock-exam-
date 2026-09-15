export type Difficulty = "Easy" | "Medium" | "Hard";

/** A data table (e.g. for Data Interpretation questions), rendered as an actual <table>. */
export interface QuestionTable {
  caption?: string;
  headers: string[];
  rows: string[][];
}

export interface Question {
  id: string;
  subject: string;
  topic: string;
  difficulty: Difficulty;
  text: string;
  table?: QuestionTable;
  options: string[];
  correctAnswerIndex: number;
  explanation?: string;
}

export interface MarkingScheme {
  correct: number;
  incorrect: number;
}

export interface ExamSet {
  id: string;
  title: string;
  description: string;
  markingScheme: MarkingScheme;
  questions: Question[];
}

/** Per-question answer state, keyed by question id. */
export type AnswerMap = Record<string, number | null>;
export type BooleanMap = Record<string, boolean>;
export type NumberMap = Record<string, number>;

export interface ExamSession {
  examId: string;
  durationSeconds: number;
  startedAt: number;
  endsAt: number;
  currentIndex: number;
  answers: AnswerMap;
  marked: BooleanMap;
  visited: BooleanMap;
  timeSpentMs: NumberMap;
  answerChangeCount: NumberMap;
}

export interface ExamResult {
  examId: string;
  startedAt: number;
  submittedAt: number;
  durationSeconds: number;
  remainingSeconds: number;
  autoSubmitted: boolean;
  answers: AnswerMap;
  marked: BooleanMap;
  timeSpentMs: NumberMap;
  answerChangeCount: NumberMap;
}

export type QuestionStatus =
  | "not-visited"
  | "not-answered"
  | "answered"
  | "marked"
  | "answered-marked";
