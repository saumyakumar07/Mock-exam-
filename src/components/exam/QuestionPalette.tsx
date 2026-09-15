"use client";

import { Question, QuestionStatus } from "@/types/exam";

interface Props {
  questions: Question[];
  statuses: QuestionStatus[];
  currentIndex: number;
  onJump: (index: number) => void;
}

const STATUS_STYLES: Record<QuestionStatus, string> = {
  "not-visited": "bg-white border-slate-300 text-slate-700",
  "not-answered": "bg-red-500 border-red-500 text-white",
  answered: "bg-green-600 border-green-600 text-white",
  marked: "bg-purple-600 border-purple-600 text-white",
  "answered-marked": "bg-purple-600 border-purple-600 text-white",
};

export default function QuestionPalette({ questions, statuses, currentIndex, onJump }: Props) {
  return (
    <div className="grid grid-cols-5 gap-2">
      {questions.map((q, i) => {
        const status = statuses[i];
        const isCurrent = i === currentIndex;
        return (
          <button
            key={q.id}
            type="button"
            onClick={() => onJump(i)}
            title={`Q${i + 1} · ${status.replace("-", " ")}`}
            className={`relative h-9 w-9 rounded-md border-2 text-xs font-semibold flex items-center justify-center cursor-pointer transition-transform hover:scale-105 ${STATUS_STYLES[status]} ${
              isCurrent ? "ring-2 ring-offset-1 ring-blue-600" : ""
            }`}
          >
            {i + 1}
            {status === "answered-marked" && (
              <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-green-500 border border-white" />
            )}
          </button>
        );
      })}
    </div>
  );
}
