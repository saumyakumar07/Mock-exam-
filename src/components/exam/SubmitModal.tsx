"use client";

interface Props {
  open: boolean;
  unansweredCount: number;
  markedCount: number;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function SubmitModal({ open, unansweredCount, markedCount, onCancel, onConfirm }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl shadow-xl max-w-md w-full p-6">
        <h2 className="text-lg font-bold text-zinc-50 mb-3">Submit Quiz?</h2>

        {unansweredCount > 0 ? (
          <p className="text-sm text-zinc-200 mb-2">
            You have{" "}
            <span className="font-semibold text-red-400">
              {unansweredCount} unanswered question{unansweredCount > 1 ? "s" : ""}
            </span>
            . Are you sure you want to submit the quiz?
          </p>
        ) : (
          <p className="text-sm text-zinc-200 mb-2">
            You have answered all questions. Are you sure you want to submit the quiz?
          </p>
        )}

        {markedCount > 0 && (
          <p className="text-sm text-zinc-400 mb-4">
            {markedCount} question{markedCount > 1 ? "s are" : " is"} marked for review.
          </p>
        )}

        <p className="text-xs text-zinc-400 mb-6">
          Once submitted, you will not be able to change your answers.
        </p>

        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-lg border border-zinc-700 text-zinc-200 font-medium hover:bg-zinc-800 cursor-pointer"
          >
            Go Back
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-400 text-zinc-950 font-medium cursor-pointer"
          >
            Submit Quiz
          </button>
        </div>
      </div>
    </div>
  );
}
