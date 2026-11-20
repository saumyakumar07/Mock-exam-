export const motivationalQuotes: string[] = [
  "Security is a process, not a product.",
  "Think like an attacker to defend like a professional.",
  "Every system has a weakness — your job is to find it first.",
  "Enumeration is the key: the more you look, the more you find.",
  "A finding without evidence is just an opinion.",
  "The best defenders understand how attacks really work.",
  "Recon done well makes exploitation easy.",
  "Stay curious, stay ethical, stay in scope.",
  "Small misconfigurations open big doors.",
  "Practice in the lab so you are ready in the field.",
  "Trust, but verify — then verify again.",
  "Every report you write should make someone more secure.",
  "Vigilance is a habit built one challenge at a time.",
  "Learn the fundamentals deeply; the tools will follow.",
  "Attackers only need to be right once. Defenders need to be ready always.",
];

/** Deterministic pick so server and client render the same quote (no hydration mismatch). */
export function quoteOfTheDay(): string {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  );
  return motivationalQuotes[dayOfYear % motivationalQuotes.length];
}
