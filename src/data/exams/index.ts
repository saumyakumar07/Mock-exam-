import { ExamSet } from "@/types/exam";
import set1 from "./set1";
import sbiClerkPrelims from "./sbiClerkPrelims";

/**
 * Registry of all available mock tests. To add a new mock test:
 *   1. Copy set1.ts to e.g. set2.ts and fill in your questions.
 *   2. Import it here and add it to this array.
 * It will then automatically appear in the "Select Mock Test" dropdown.
 */
export const examSets: ExamSet[] = [sbiClerkPrelims, set1];

export function getExamSet(id: string): ExamSet | undefined {
  return examSets.find((e) => e.id === id);
}
