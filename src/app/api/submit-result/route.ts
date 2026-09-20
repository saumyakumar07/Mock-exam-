import { NextRequest, NextResponse } from "next/server";
import { saveResultRecord, hasRedisEnvVars } from "@/lib/redis";
import { ResultRecord } from "@/types/exam";

export async function POST(req: NextRequest) {
  if (!hasRedisEnvVars()) {
    // Result storage isn't set up — fail quietly so the exam flow never breaks for the test-taker.
    return NextResponse.json({ stored: false }, { status: 200 });
  }

  let body: Partial<ResultRecord>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (
    !body.candidateName ||
    typeof body.candidateName !== "string" ||
    !body.examId ||
    typeof body.totalQuestions !== "number"
  ) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const record: ResultRecord = {
    id: crypto.randomUUID(),
    candidateName: body.candidateName.slice(0, 80),
    examId: String(body.examId),
    examTitle: String(body.examTitle ?? body.examId),
    submittedAt: Date.now(),
    totalQuestions: body.totalQuestions,
    attempted: Number(body.attempted ?? 0),
    correct: Number(body.correct ?? 0),
    incorrect: Number(body.incorrect ?? 0),
    unanswered: Number(body.unanswered ?? 0),
    score: Number(body.score ?? 0),
    maxScore: Number(body.maxScore ?? 0),
    percentage: Number(body.percentage ?? 0),
    timeTakenMs: Number(body.timeTakenMs ?? 0),
    autoSubmitted: Boolean(body.autoSubmitted),
  };

  try {
    await saveResultRecord(record);
    return NextResponse.json({ stored: true });
  } catch (err) {
    console.error("Failed to save result record", err);
    return NextResponse.json({ stored: false, error: "Storage failed" }, { status: 500 });
  }
}
