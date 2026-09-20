"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { examSets } from "@/data/exams";
import { quoteOfTheDay } from "@/lib/quotes";
import { createSession } from "@/lib/examEngine";
import { sessionStore, resultStore } from "@/lib/storage";

const DURATIONS = [
  { label: "30 Min", minutes: 30 },
  { label: "1 Hour", minutes: 60 },
  { label: "1.5 Hours", minutes: 90 },
  { label: "2 Hours", minutes: 120 },
  { label: "2.5 Hours", minutes: 150 },
  { label: "3 Hours", minutes: 180 },
];

function formatMinutes(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m} minutes`;
  if (m === 0) return `${h} hour${h > 1 ? "s" : ""}`;
  return `${h} hour${h > 1 ? "s" : ""} ${m} minutes`;
}

export default function HomePage() {
  const router = useRouter();
  const [examId, setExamId] = useState(examSets[0]?.id ?? "");
  const [minutes, setMinutes] = useState<number>(60);
  const [name, setName] = useState("");
  const [starting, setStarting] = useState(false);

  const selectedExam = examSets.find((e) => e.id === examId);
  const quote = quoteOfTheDay();
  const trimmedName = name.trim();

  function handleStart() {
    if (!selectedExam || !trimmedName) return;
    setStarting(true);
    resultStore.clear();
    const session = createSession(selectedExam.id, minutes * 60, trimmedName);
    sessionStore.set(session);
    router.push("/exam");
  }

  return (
    <main className="flex-1 flex flex-col items-center px-4 py-10 sm:py-16">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <p className="text-sm font-semibold tracking-widest text-blue-700 uppercase mb-2">
            Mock Test Platform
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            Practice Like It&rsquo;s the Real Exam
          </h1>
          <blockquote className="text-slate-600 italic text-base sm:text-lg border-l-4 border-blue-600 pl-4 text-left max-w-xl mx-auto">
            &ldquo;{quote}&rdquo;
          </blockquote>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sm:p-8">
          <div className="mb-6">
            <label className="block text-sm font-semibold text-slate-800 mb-2">Your Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              maxLength={80}
              className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <p className="text-xs text-slate-500 mt-1.5">
              Your name is submitted with your result so it can be reviewed later.
            </p>
          </div>

          {examSets.length > 1 && (
            <div className="mb-6">
              <label className="block text-sm font-semibold text-slate-800 mb-2">
                Select Mock Test
              </label>
              <select
                value={examId}
                onChange={(e) => setExamId(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                {examSets.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.title}
                  </option>
                ))}
              </select>
              {selectedExam && (
                <p className="text-xs text-slate-500 mt-1.5">{selectedExam.description}</p>
              )}
            </div>
          )}

          <div className="mb-6">
            <label className="block text-sm font-semibold text-slate-800 mb-2">
              Select Exam Duration
            </label>
            <div className="grid grid-cols-3 gap-3">
              {DURATIONS.map((d) => (
                <button
                  key={d.minutes}
                  type="button"
                  onClick={() => setMinutes(d.minutes)}
                  className={`rounded-lg border-2 py-3 text-sm font-semibold transition-colors cursor-pointer ${
                    minutes === d.minutes
                      ? "border-blue-600 bg-blue-50 text-blue-700"
                      : "border-slate-200 text-slate-600 hover:border-slate-300"
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {selectedExam && (
            <div className="mb-6 rounded-lg bg-slate-50 border border-slate-200 p-4 text-sm text-slate-600">
              <p className="font-semibold text-slate-800 mb-2">Before you begin:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>{selectedExam.questions.length} questions, {formatMinutes(minutes)} duration.</li>
                <li>
                  Marking scheme: +{selectedExam.markingScheme.correct} for each correct answer,
                  &minus;{selectedExam.markingScheme.incorrect} for each incorrect answer.
                </li>
                <li>The timer starts immediately and the exam auto-submits when time runs out.</li>
                <li>You can mark questions for review and revisit them anytime before submitting.</li>
              </ul>
            </div>
          )}

          <button
            type="button"
            onClick={handleStart}
            disabled={!selectedExam || !trimmedName || starting}
            className="w-full bg-blue-700 hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg py-3.5 text-base transition-colors cursor-pointer"
          >
            {starting ? "Starting…" : !trimmedName ? "Enter your name to continue" : "Start Exam"}
          </button>
        </div>
      </div>
    </main>
  );
}
