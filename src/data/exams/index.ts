import { ExamSet } from "@/types/exam";
import pfrdaGradeAPhase1Set1Paper1 from "./pfrdaGradeAPhase1Set1Paper1";
import pfrdaGradeAPhase1Set1Paper2 from "./pfrdaGradeAPhase1Set1Paper2";

/**
 * Registry of all available mock tests. To add a new mock test:
 *   1. Create a new file (see pfrdaGradeAPhase1Set1Paper1.ts for the format).
 *   2. Import it here and add it to this array.
 * It will then automatically appear in the "Select Mock Test" dropdown.
 */
export const examSets: ExamSet[] = [pfrdaGradeAPhase1Set1Paper1, pfrdaGradeAPhase1Set1Paper2];

export function getExamSet(id: string): ExamSet | undefined {
  return examSets.find((e) => e.id === id);
}
