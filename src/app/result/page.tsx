"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getExamSet } from "@/data/exams";
import { resultStore } from "@/lib/storage";
import { computeAnalytics, formatDuration, formatClock, ResultAnalytics } from "@/lib/examEngine";
import { ExamResult, ExamSet } from "@/types/exam";
import StatCard from "@/components/result/StatCard";
import SummaryDonut from "@/components/result/SummaryDonut";
import SubjectBarChart from "@/components/result/SubjectBarChart";
import TimeBarChart from "@/components/result/TimeBarChart";
import QuestionDataTable from "@/components/exam/QuestionDataTable";

export default function ResultPage() {
  const router = useRouter();
  const [examSet, setExamSet] = useState<ExamSet | null>(null);
  const [analytics, setAnalytics] = useState<ResultAnalytics | null>(null);
  const [result, setResult] = useState<ExamResult | null>(null);
  const [showReview, setShowReview] = useState(false);

  // One-time sync from sessionStorage (an external system) into React state
  // on mount — sessionStorage is unavailable during server rendering.
  useEffect(() => {
    const r = resultStore.get();
    if (!r) {
      router.replace("/");
      return;
    }
    const es = getExamSet(r.examId);
    if (!es) {
      router.replace("/");
      return;
    }
    /* eslint-disable react-hooks/set-state-in-effect */
    setResult(r);
    setExamSet(es);
    setAnalytics(computeAnalytics(es, r));
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [router]);

  function startNew() {
    resultStore.clear();
    router.push("/");
  }

  if (!examSet || !analytics || !result) {
    return (
      <main className="flex-1 flex items-center justify-center">
        <p className="text-slate-500">Loading result…</p>
      </main>
    );
  }

  return (
    <main className="flex-1 bg-slate-100 px-4 sm:px-6 py-8">
      <div className="max-w-6xl mx-auto flex flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-blue-700 uppercase tracking-wide">Result</p>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">{examSet.title}</h1>
            <p className="text-sm text-slate-500 mt-1">
              {result.candidateName} ·{" "}
              {result.autoSubmitted
                ? "Time expired — the exam was submitted automatically."
                : "Submitted successfully."}
            </p>
          </div>
          <button
            type="button"
            onClick={startNew}
            className="bg-blue-700 hover:bg-blue-800 text-white font-semibold px-5 py-2.5 rounded-lg cursor-pointer"
          >
            Start New Exam
          </button>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <StatCard label="Total Questions" value={String(analytics.totalQuestions)} />
          <StatCard label="Attempted" value={String(analytics.attempted)} accent="blue" />
          <StatCard label="Unanswered" value={String(analytics.unanswered)} />
          <StatCard label="Correct Answers" value={String(analytics.correct)} accent="green" />
          <StatCard label="Incorrect Answers" value={String(analytics.incorrect)} accent="red" />
          <StatCard label="Total Score" value={`${analytics.score.toFixed(2)} / ${analytics.maxScore}`} accent="blue" />
          <StatCard label="Percentage" value={`${analytics.percentage.toFixed(1)}%`} accent="blue" />
          <StatCard label="Accuracy" value={`${analytics.accuracyPercentage.toFixed(1)}%`} accent="green" />
          <StatCard label="Time Taken" value={formatDuration(analytics.timeTakenMs)} />
          <StatCard
            label="Remaining Time"
            value={analytics.autoSubmitted ? "0s (time up)" : formatClock(analytics.remainingSeconds)}
            accent="amber"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 sm:p-5">
            <h2 className="text-sm font-semibold text-slate-800 mb-2">Answer Breakdown</h2>
            <SummaryDonut
              correct={analytics.correct}
              incorrect={analytics.incorrect}
              unanswered={analytics.unanswered}
            />
          </div>
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-4 sm:p-5">
            <h2 className="text-sm font-semibold text-slate-800 mb-2">Subject-wise Performance</h2>
            <SubjectBarChart data={analytics.subjectStats} />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 sm:p-5">
          <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
            <h2 className="text-sm font-semibold text-slate-800">Time Spent per Question</h2>
            <p className="text-xs text-slate-500">
              Average: {formatDuration(analytics.averageTimePerQuestionMs)} / question · orange bars = unusually slow
            </p>
          </div>
          <TimeBarChart questions={analytics.questions} averageTimeMs={analytics.averageTimePerQuestionMs} />
        </div>

        {/* Subject table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 sm:p-5 overflow-x-auto">
          <h2 className="text-sm font-semibold text-slate-800 mb-3">Subject-wise Breakdown</h2>
          <table className="w-full text-sm min-w-[560px]">
            <thead>
              <tr className="text-left text-slate-500 border-b border-slate-200">
                <th className="py-2 pr-4 font-medium">Subject</th>
                <th className="py-2 pr-4 font-medium">Attempted</th>
                <th className="py-2 pr-4 font-medium">Correct</th>
                <th className="py-2 pr-4 font-medium">Incorrect</th>
                <th className="py-2 pr-4 font-medium">Accuracy</th>
                <th className="py-2 pr-4 font-medium">Avg. Time</th>
              </tr>
            </thead>
            <tbody>
              {analytics.subjectStats.map((s) => (
                <tr key={s.subject} className="border-b border-slate-100 last:border-0">
                  <td className="py-2 pr-4 font-medium text-slate-800">{s.subject}</td>
                  <td className="py-2 pr-4 text-slate-600">
                    {s.attempted} / {s.total}
                  </td>
                  <td className="py-2 pr-4 text-green-700">{s.correct}</td>
                  <td className="py-2 pr-4 text-red-600">{s.incorrect}</td>
                  <td className="py-2 pr-4 text-slate-600">
                    {s.attempted > 0 ? `${s.accuracy.toFixed(0)}%` : "—"}
                  </td>
                  <td className="py-2 pr-4 text-slate-600">{formatDuration(s.avgTimeMs)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Weak / strong areas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 sm:p-5">
            <h2 className="text-sm font-semibold text-slate-800 mb-3">Strong Areas</h2>
            {analytics.strongAreas.length === 0 ? (
              <p className="text-sm text-slate-500">No subject reached 75% accuracy yet.</p>
            ) : (
              <ul className="space-y-2">
                {analytics.strongAreas.map((s) => (
                  <li key={s.subject} className="flex items-center justify-between text-sm">
                    <span className="text-slate-700">{s.subject}</span>
                    <span className="font-semibold text-green-700">{s.accuracy.toFixed(0)}%</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 sm:p-5">
            <h2 className="text-sm font-semibold text-slate-800 mb-3">Weak Areas</h2>
            {analytics.weakAreas.length === 0 ? (
              <p className="text-sm text-slate-500">No subject fell below 50% accuracy.</p>
            ) : (
              <ul className="space-y-2">
                {analytics.weakAreas.map((s) => (
                  <li key={s.subject} className="flex items-center justify-between text-sm">
                    <span className="text-slate-700">{s.subject}</span>
                    <span className="font-semibold text-red-600">{s.accuracy.toFixed(0)}%</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Time insights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 sm:p-5">
            <h2 className="text-sm font-semibold text-slate-800 mb-3">Most Time-Consuming Questions</h2>
            <ol className="space-y-2 text-sm">
              {analytics.mostTimeConsuming.map((q) => (
                <li key={q.id} className="flex items-center justify-between">
                  <span className="text-slate-700">
                    Q{q.index + 1} · {q.subject}
                  </span>
                  <span className="font-semibold text-amber-600">{formatDuration(q.timeSpentMs)}</span>
                </li>
              ))}
            </ol>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 sm:p-5">
            <h2 className="text-sm font-semibold text-slate-800 mb-3">Quickest Answered Questions</h2>
            {analytics.quickestAnswered.length === 0 ? (
              <p className="text-sm text-slate-500">No questions were answered.</p>
            ) : (
              <ol className="space-y-2 text-sm">
                {analytics.quickestAnswered.map((q) => (
                  <li key={q.id} className="flex items-center justify-between">
                    <span className="text-slate-700">
                      Q{q.index + 1} · {q.subject}
                    </span>
                    <span className="font-semibold text-blue-700">{formatDuration(q.timeSpentMs)}</span>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </div>

        {analytics.changedAnswers.length > 0 && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 sm:p-5">
            <h2 className="text-sm font-semibold text-slate-800 mb-3">
              Questions Where You Changed Your Answer ({analytics.changedAnswers.length})
            </h2>
            <div className="flex flex-wrap gap-2">
              {analytics.changedAnswers.map((q) => (
                <span
                  key={q.id}
                  className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
                    q.isCorrect
                      ? "bg-green-50 text-green-700 border-green-200"
                      : "bg-red-50 text-red-700 border-red-200"
                  }`}
                >
                  Q{q.index + 1}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Answer review */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 sm:p-5">
          <button
            type="button"
            onClick={() => setShowReview((v) => !v)}
            className="flex items-center justify-between w-full text-left cursor-pointer"
          >
            <h2 className="text-sm font-semibold text-slate-800">Answer Review</h2>
            <span className="text-xs text-blue-700 font-medium">{showReview ? "Hide" : "Show"}</span>
          </button>

          {showReview && (
            <div className="mt-4 flex flex-col gap-4">
              {analytics.questions.map((q) => (
                <div key={q.id} className="border border-slate-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="text-xs font-semibold text-slate-500">Q{q.index + 1}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      {q.subject}
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                        !q.isAnswered
                          ? "bg-slate-100 text-slate-500"
                          : q.isCorrect
                          ? "bg-green-50 text-green-700"
                          : "bg-red-50 text-red-700"
                      }`}
                    >
                      {!q.isAnswered ? "Unanswered" : q.isCorrect ? "Correct" : "Incorrect"}
                    </span>
                  </div>
                  <p className="text-sm text-slate-800 font-medium mb-3 whitespace-pre-line">{q.text}</p>
                  {q.table && <QuestionDataTable table={q.table} />}
                  <div className="space-y-1.5">
                    {q.options.map((opt, i) => {
                      const isCorrectOpt = i === q.correctAnswerIndex;
                      const isUserOpt = i === q.userAnswerIndex;
                      return (
                        <div
                          key={i}
                          className={`text-sm px-3 py-1.5 rounded-md border ${
                            isCorrectOpt
                              ? "border-green-300 bg-green-50 text-green-800"
                              : isUserOpt
                              ? "border-red-300 bg-red-50 text-red-800"
                              : "border-slate-200 text-slate-600"
                          }`}
                        >
                          {String.fromCharCode(65 + i)}. {opt}
                          {isCorrectOpt && <span className="ml-2 text-xs font-semibold">(Correct)</span>}
                          {isUserOpt && !isCorrectOpt && (
                            <span className="ml-2 text-xs font-semibold">(Your answer)</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  {q.explanation && (
                    <p className="text-xs text-slate-500 mt-2">Explanation: {q.explanation}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
