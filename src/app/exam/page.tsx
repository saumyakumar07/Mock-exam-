"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { getExamSet } from "@/data/exams";
import { sessionStore, resultStore } from "@/lib/storage";
import { questionStatus, formatClock } from "@/lib/examEngine";
import { ExamSession, ExamResult, QuestionStatus } from "@/types/exam";
import QuestionPalette from "@/components/exam/QuestionPalette";
import SubmitModal from "@/components/exam/SubmitModal";

export default function ExamPage() {
  const router = useRouter();
  const [session, setSession] = useState<ExamSession | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  const sessionRef = useRef<ExamSession | null>(null);
  const currentQuestionStartRef = useRef<number>(0);
  const submitGuardRef = useRef(false);

  const examSet = session ? getExamSet(session.examId) : undefined;

  // Load session on mount. A one-time sync from sessionStorage (an external
  // system) into React state — intentionally not using an initializer
  // function, since sessionStorage is unavailable during server rendering.
  useEffect(() => {
    const s = sessionStore.get();
    if (!s) {
      router.replace("/");
      return;
    }
    const es = getExamSet(s.examId);
    if (!es) {
      router.replace("/");
      return;
    }
    sessionRef.current = s;
    /* eslint-disable react-hooks/set-state-in-effect */
    setSession(s);
    setRemainingSeconds(Math.max(0, Math.round((s.endsAt - Date.now()) / 1000)));
    currentQuestionStartRef.current = Date.now();
    setLoaded(true);
    /* eslint-enable react-hooks/set-state-in-effect */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const flushTime = (s: ExamSession): ExamSession => {
    if (!examSet) return s;
    const now = Date.now();
    const q = examSet.questions[s.currentIndex];
    const elapsed = now - currentQuestionStartRef.current;
    currentQuestionStartRef.current = now;
    if (!q || elapsed <= 0) return s;
    return {
      ...s,
      timeSpentMs: { ...s.timeSpentMs, [q.id]: (s.timeSpentMs[q.id] ?? 0) + elapsed },
    };
  };

  const updateSession = (next: ExamSession) => {
    sessionRef.current = next;
    setSession(next);
    sessionStore.set(next);
  };

  const handleSubmit = (auto: boolean) => {
    if (submitGuardRef.current) return;
    submitGuardRef.current = true;
    const cur = sessionRef.current;
    if (!cur || !examSet) {
      router.replace("/");
      return;
    }
    const flushed = flushTime(cur);
    const now = Date.now();
    const remaining = auto ? 0 : Math.max(0, Math.round((flushed.endsAt - now) / 1000));
    const result: ExamResult = {
      examId: flushed.examId,
      startedAt: flushed.startedAt,
      submittedAt: now,
      durationSeconds: flushed.durationSeconds,
      remainingSeconds: remaining,
      autoSubmitted: auto,
      answers: flushed.answers,
      marked: flushed.marked,
      timeSpentMs: flushed.timeSpentMs,
      answerChangeCount: flushed.answerChangeCount,
    };
    resultStore.set(result);
    sessionStore.clear();
    router.replace("/result");
  };

  // Countdown timer.
  useEffect(() => {
    if (!loaded) return;
    const id = setInterval(() => {
      const cur = sessionRef.current;
      if (!cur) return;
      const remaining = Math.max(0, Math.round((cur.endsAt - Date.now()) / 1000));
      setRemainingSeconds(remaining);
      if (remaining <= 0) {
        handleSubmit(true);
      }
    }, 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded]);

  // Warn before accidental tab close while exam is in progress.
  useEffect(() => {
    if (!loaded) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [loaded]);

  const goTo = (index: number) => {
    const cur = sessionRef.current;
    if (!cur || !examSet) return;
    if (index < 0 || index >= examSet.questions.length) return;
    let next = flushTime(cur);
    const targetId = examSet.questions[index].id;
    next = { ...next, currentIndex: index, visited: { ...next.visited, [targetId]: true } };
    updateSession(next);
  };

  const selectOption = (optionIndex: number) => {
    const cur = sessionRef.current;
    if (!cur || !examSet) return;
    const q = examSet.questions[cur.currentIndex];
    const prevAns = cur.answers[q.id] ?? null;
    const changed = prevAns != null && prevAns !== optionIndex;
    const next: ExamSession = {
      ...cur,
      answers: { ...cur.answers, [q.id]: optionIndex },
      visited: { ...cur.visited, [q.id]: true },
      answerChangeCount: changed
        ? { ...cur.answerChangeCount, [q.id]: (cur.answerChangeCount[q.id] ?? 0) + 1 }
        : cur.answerChangeCount,
    };
    updateSession(next);
  };

  const clearResponse = () => {
    const cur = sessionRef.current;
    if (!cur || !examSet) return;
    const q = examSet.questions[cur.currentIndex];
    updateSession({ ...cur, answers: { ...cur.answers, [q.id]: null } });
  };

  const toggleMark = () => {
    const cur = sessionRef.current;
    if (!cur || !examSet) return;
    const q = examSet.questions[cur.currentIndex];
    updateSession({
      ...cur,
      marked: { ...cur.marked, [q.id]: !cur.marked[q.id] },
      visited: { ...cur.visited, [q.id]: true },
    });
  };

  const subjects = useMemo(
    () => (examSet ? Array.from(new Set(examSet.questions.map((q) => q.subject))) : []),
    [examSet]
  );

  const statuses: QuestionStatus[] = useMemo(() => {
    if (!session || !examSet) return [];
    return examSet.questions.map((q) => questionStatus(session, q));
  }, [session, examSet]);

  const counts = useMemo(() => {
    const c = { answered: 0, notAnswered: 0, notVisited: 0, marked: 0, answeredMarked: 0 };
    for (const s of statuses) {
      if (s === "answered") c.answered++;
      else if (s === "not-answered") c.notAnswered++;
      else if (s === "not-visited") c.notVisited++;
      else if (s === "marked") c.marked++;
      else if (s === "answered-marked") c.answeredMarked++;
    }
    return c;
  }, [statuses]);

  if (!loaded || !session || !examSet) {
    return (
      <main className="flex-1 flex items-center justify-center">
        <p className="text-slate-500">Loading exam…</p>
      </main>
    );
  }

  const q = examSet.questions[session.currentIndex];
  const selectedOption = session.answers[q.id] ?? null;
  const isMarked = !!session.marked[q.id];
  const unansweredCount = examSet.questions.length - counts.answered - counts.answeredMarked;
  const isCritical = remainingSeconds <= 300;

  return (
    <main className="flex-1 flex flex-col bg-slate-100">
      <header className="bg-slate-900 text-white px-4 sm:px-6 py-3 flex items-center justify-between flex-wrap gap-3">
        <div>
          <p className="font-semibold text-sm sm:text-base">{examSet.title}</p>
          <p className="text-xs text-slate-300">
            Question {session.currentIndex + 1} of {examSet.questions.length}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div
            className={`font-mono text-lg sm:text-xl font-bold px-3 py-1.5 rounded-lg ${
              isCritical ? "bg-red-600 timer-critical" : "bg-slate-800"
            }`}
          >
            {formatClock(remainingSeconds)}
          </div>
          <button
            type="button"
            onClick={() => setShowSubmitModal(true)}
            className="bg-white text-slate-900 font-semibold text-sm px-4 py-2 rounded-lg hover:bg-slate-200 cursor-pointer"
          >
            Submit Exam
          </button>
        </div>
      </header>

      {subjects.length > 1 && (
        <div className="bg-slate-800 px-4 sm:px-6 flex gap-1 overflow-x-auto">
          {subjects.map((subj) => {
            const firstIdx = examSet.questions.findIndex((qq) => qq.subject === subj);
            const isActive = q.subject === subj;
            return (
              <button
                key={subj}
                type="button"
                onClick={() => goTo(firstIdx)}
                className={`px-3 py-2 text-xs sm:text-sm font-medium whitespace-nowrap border-b-2 cursor-pointer ${
                  isActive
                    ? "border-blue-500 text-white"
                    : "border-transparent text-slate-400 hover:text-slate-200"
                }`}
              >
                {subj}
              </button>
            );
          })}
        </div>
      )}

      <div className="flex-1 flex flex-col lg:flex-row gap-4 p-4 sm:p-6 max-w-7xl w-full mx-auto">
        {/* Main question area */}
        <section className="flex-1 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col">
          <div className="p-5 sm:p-6 flex-1">
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                {q.subject}
              </span>
              <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                {q.topic}
              </span>
              {isMarked && (
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                  Marked for Review
                </span>
              )}
            </div>

            <p className="text-base sm:text-lg text-slate-900 font-medium mb-6 leading-relaxed">
              <span className="text-slate-500">Q{session.currentIndex + 1}.</span> {q.text}
            </p>

            <div className="space-y-3">
              {q.options.map((opt, i) => {
                const selected = selectedOption === i;
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => selectOption(i)}
                    aria-pressed={selected}
                    className={`w-full text-left flex items-start gap-3 rounded-lg border-2 px-4 py-3 transition-colors cursor-pointer ${
                      selected
                        ? "border-blue-600 bg-blue-50"
                        : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    <span
                      className={`flex-shrink-0 h-6 w-6 rounded-full border-2 flex items-center justify-center text-xs font-semibold ${
                        selected
                          ? "border-blue-600 bg-blue-600 text-white"
                          : "border-slate-300 text-slate-500"
                      }`}
                    >
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span className="text-sm sm:text-base text-slate-800 pt-0.5">{opt}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bottom action bar */}
          <div className="border-t border-slate-200 p-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => {
                  toggleMark();
                  goTo(session.currentIndex + 1);
                }}
                className="px-3 sm:px-4 py-2 rounded-lg bg-purple-100 text-purple-700 font-medium text-sm hover:bg-purple-200 cursor-pointer"
              >
                Mark for Review & Next
              </button>
              <button
                type="button"
                onClick={clearResponse}
                disabled={selectedOption == null}
                className="px-3 sm:px-4 py-2 rounded-lg bg-slate-100 text-slate-700 font-medium text-sm hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                Clear Response
              </button>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => goTo(session.currentIndex - 1)}
                disabled={session.currentIndex === 0}
                className="px-3 sm:px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-medium text-sm hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={() => goTo(session.currentIndex + 1)}
                disabled={session.currentIndex === examSet.questions.length - 1}
                className="px-3 sm:px-4 py-2 rounded-lg bg-blue-700 text-white font-medium text-sm hover:bg-blue-800 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                Save & Next
              </button>
            </div>
          </div>
        </section>

        {/* Sidebar: palette */}
        <aside className="w-full lg:w-80 flex-shrink-0 bg-white rounded-xl border border-slate-200 shadow-sm p-4 sm:p-5 flex flex-col gap-4 h-fit">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <LegendItem colorClass="bg-green-600" label={`Answered (${counts.answered + counts.answeredMarked})`} />
            <LegendItem colorClass="bg-red-500" label={`Not Answered (${counts.notAnswered})`} />
            <LegendItem colorClass="bg-white border border-slate-300" label={`Not Visited (${counts.notVisited})`} />
            <LegendItem colorClass="bg-purple-600" label={`Marked (${counts.marked + counts.answeredMarked})`} />
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-800 mb-2">Question Palette</p>
            <QuestionPalette
              questions={examSet.questions}
              statuses={statuses}
              currentIndex={session.currentIndex}
              onJump={goTo}
            />
          </div>
        </aside>
      </div>

      <SubmitModal
        open={showSubmitModal}
        unansweredCount={unansweredCount}
        markedCount={counts.marked + counts.answeredMarked}
        onCancel={() => setShowSubmitModal(false)}
        onConfirm={() => handleSubmit(false)}
      />
    </main>
  );
}

function LegendItem({ colorClass, label }: { colorClass: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className={`h-3 w-3 rounded ${colorClass}`} />
      <span className="text-slate-600">{label}</span>
    </div>
  );
}
