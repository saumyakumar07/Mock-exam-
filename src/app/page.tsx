"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { examSets } from "@/data/exams";
import { quoteOfTheDay } from "@/lib/quotes";
import { createSession } from "@/lib/examEngine";
import { sessionStore, resultStore } from "@/lib/storage";
import BrandLogo, { COMPANY_NAME, PLATFORM_NAME } from "@/components/brand/BrandLogo";

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
    <main className="flex-1 flex flex-col items-center px-4 py-10 sm:py-14">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          {/* Logo placement — see src/components/brand/BrandLogo.tsx to replace the artwork. */}
          <div className="flex justify-center mb-6">
            <BrandLogo height={64} priority />
          </div>
          <p className="text-sm font-semibold tracking-widest text-orange-400 uppercase mb-2">
            {PLATFORM_NAME}
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-zinc-50 mb-4">
            Test Your Offensive Security Skills
          </h1>
          <blockquote className="text-zinc-300 italic text-base sm:text-lg border-l-4 border-orange-500 pl-4 text-left max-w-xl mx-auto">
            &ldquo;{quote}&rdquo;
          </blockquote>
        </div>

        <div className="bg-zinc-900/90 backdrop-blur rounded-xl shadow-lg shadow-black/40 border border-zinc-800 p-6 sm:p-8">
          <div className="mb-6">
            <label className="block text-sm font-semibold text-zinc-100 mb-2">Your Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              maxLength={80}
              className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2.5 text-zinc-50 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <p className="text-xs text-zinc-400 mt-1.5">
              Your name is submitted with your result so it can be reviewed later.
            </p>
          </div>

          {examSets.length > 1 && (
            <div className="mb-6">
              <label className="block text-sm font-semibold text-zinc-100 mb-2">
                Select Quiz
              </label>
              <select
                value={examId}
                onChange={(e) => setExamId(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2.5 text-zinc-50 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                {examSets.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.title}
                  </option>
                ))}
              </select>
              {selectedExam && (
                <p className="text-xs text-zinc-400 mt-1.5">{selectedExam.description}</p>
              )}
            </div>
          )}

          {examSets.length === 1 && selectedExam && (
            <div className="mb-6">
              <p className="block text-sm font-semibold text-zinc-100 mb-1">{selectedExam.title}</p>
              <p className="text-xs text-zinc-400 leading-relaxed">{selectedExam.description}</p>
            </div>
          )}

          <div className="mb-6">
            <label className="block text-sm font-semibold text-zinc-100 mb-2">
              Select Quiz Duration
            </label>
            <div className="grid grid-cols-3 gap-3">
              {DURATIONS.map((d) => (
                <button
                  key={d.minutes}
                  type="button"
                  onClick={() => setMinutes(d.minutes)}
                  className={`rounded-lg border-2 py-3 text-sm font-semibold transition-colors cursor-pointer ${
                    minutes === d.minutes
                      ? "border-orange-500 bg-orange-500/10 text-orange-400"
                      : "border-zinc-800 text-zinc-300 hover:border-zinc-600"
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {selectedExam && (
            <div className="mb-6 rounded-lg bg-zinc-800/60 border border-zinc-800 p-4 text-sm text-zinc-300">
              <p className="font-semibold text-zinc-100 mb-2">Before you begin:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>{selectedExam.questions.length} questions, {formatMinutes(minutes)} duration.</li>
                <li>
                  Marking scheme: +{selectedExam.markingScheme.correct} for each correct answer,
                  &minus;{selectedExam.markingScheme.incorrect} for each incorrect answer.
                </li>
                <li>The timer starts immediately and the quiz auto-submits when time runs out.</li>
                <li>You can mark questions for review and revisit them anytime before submitting.</li>
              </ul>
            </div>
          )}

          <button
            type="button"
            onClick={handleStart}
            disabled={!selectedExam || !trimmedName || starting}
            className="w-full bg-orange-500 hover:bg-orange-400 disabled:opacity-50 disabled:cursor-not-allowed text-zinc-950 font-semibold rounded-lg py-3.5 text-base transition-colors cursor-pointer"
          >
            {starting ? "Starting…" : !trimmedName ? "Enter your name to continue" : "Start Quiz"}
          </button>
        </div>

        <p className="text-center text-xs text-zinc-500 mt-6">
          Organised and conducted by {COMPANY_NAME}
        </p>
      </div>
    </main>
  );
}
