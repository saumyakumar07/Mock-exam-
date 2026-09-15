export const motivationalQuotes: string[] = [
  "Success is the sum of small efforts, repeated day in and day out.",
  "The expert in anything was once a beginner.",
  "Discipline is choosing between what you want now and what you want most.",
  "Every mock test you take is a step closer to your rank.",
  "Hard work beats talent when talent doesn't work hard.",
  "Consistency is what transforms average into excellence.",
  "Your only limit is the one you set yourself.",
  "The pain of discipline is far less than the pain of regret.",
  "Believe you can, and you're halfway there.",
  "Small daily improvements lead to staggering long-term results.",
  "Practice like you've never won, perform like you've never lost.",
  "The exam hall rewards preparation, not luck.",
  "Focus on your goal. Don't look in any direction but ahead.",
  "Push yourself, because no one else is going to do it for you.",
  "Dreams don't work unless you do.",
];

/** Deterministic pick so server and client render the same quote (no hydration mismatch). */
export function quoteOfTheDay(): string {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  );
  return motivationalQuotes[dayOfYear % motivationalQuotes.length];
}
