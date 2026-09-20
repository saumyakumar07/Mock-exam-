import { ExamSet } from "@/types/exam";
import sbiClerkPrelimsSet2 from "./sbiClerkPrelimsSet2";

/**
 * Registry of all available mock tests. To add a new mock test:
 *   1. Create a new file (see sbiClerkPrelimsSet2.ts for the format).
 *   2. Import it here and add it to this array.
 * It will then automatically appear in the "Select Mock Test" dropdown.
 */
export const examSets: ExamSet[] = [sbiClerkPrelimsSet2];

export function getExamSet(id: string): ExamSet | undefined {
  return examSets.find((e) => e.id === id);
}
