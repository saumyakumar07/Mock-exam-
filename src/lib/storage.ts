const SESSION_KEY = "examprep.session";
const RESULT_KEY = "examprep.result";

function readJson<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function writeJson<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(key, JSON.stringify(value));
  } catch {
    // sessionStorage unavailable (e.g. private browsing) — fail silently.
  }
}

function remove(key: string): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.removeItem(key);
  } catch {
    // ignore
  }
}

import type { ExamSession, ExamResult } from "@/types/exam";

export const sessionStore = {
  get: () => readJson<ExamSession>(SESSION_KEY),
  set: (session: ExamSession) => writeJson(SESSION_KEY, session),
  clear: () => remove(SESSION_KEY),
};

export const resultStore = {
  get: () => readJson<ExamResult>(RESULT_KEY),
  set: (result: ExamResult) => writeJson(RESULT_KEY, result),
  clear: () => remove(RESULT_KEY),
};
