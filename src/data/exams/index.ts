import { ExamSet } from "@/types/exam";
import certifencePtmpV2Quiz from "./certifencePtmpV2Quiz";

/**
 * Registry of all available quizzes. To add a new quiz:
 *   1. Create a new file (see certifencePtmpV2Quiz.ts for the format).
 *   2. Import it here and add it to this array.
 * It will then automatically appear in the "Select Quiz" dropdown.
 */
export const examSets: ExamSet[] = [certifencePtmpV2Quiz];

export function getExamSet(id: string): ExamSet | undefined {
  return examSets.find((e) => e.id === id);
}
