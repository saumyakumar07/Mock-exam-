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
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
        <h2 className="text-lg font-bold text-slate-900 mb-3">Submit Exam?</h2>

        {unansweredCount > 0 ? (
          <p className="text-sm text-slate-700 mb-2">
            You have{" "}
            <span className="font-semibold text-red-600">
              {unansweredCount} unanswered question{unansweredCount > 1 ? "s" : ""}
            </span>
            . Are you sure you want to submit the exam?
          </p>
        ) : (
          <p className="text-sm text-slate-700 mb-2">
            You have answered all questions. Are you sure you want to submit the exam?
          </p>
        )}

        {markedCount > 0 && (
          <p className="text-sm text-slate-500 mb-4">
            {markedCount} question{markedCount > 1 ? "s are" : " is"} marked for review.
          </p>
        )}

        <p className="text-xs text-slate-500 mb-6">
          Once submitted, you will not be able to change your answers.
        </p>

        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 cursor-pointer"
          >
            Go Back
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-medium cursor-pointer"
          >
            Submit Exam
          </button>
        </div>
      </div>
    </div>
  );
}
