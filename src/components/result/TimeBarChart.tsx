"use client";

import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { QuestionAnalysis } from "@/lib/examEngine";
import { AXIS_TICK, TOOLTIP_PROPS } from "./chartTheme";

interface Props {
  questions: QuestionAnalysis[];
  averageTimeMs: number;
}

export default function TimeBarChart({ questions, averageTimeMs }: Props) {
  const data = questions.map((q) => ({
    name: `Q${q.index + 1}`,
    seconds: Math.round(q.timeSpentMs / 1000),
    isCorrect: q.isCorrect,
    isAnswered: q.isAnswered,
  }));

  const avgSeconds = Math.round(averageTimeMs / 1000);

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
        <XAxis dataKey="name" tick={{ ...AXIS_TICK, fontSize: 10 }} interval={Math.max(0, Math.floor(data.length / 15))} />
        <YAxis tick={AXIS_TICK} label={{ value: "seconds", angle: -90, position: "insideLeft", fontSize: 11, fill: "#a1a1aa" }} />
        <Tooltip {...TOOLTIP_PROPS} formatter={(value) => [`${value}s`, "Time spent"]} />
        <Bar dataKey="seconds" radius={[3, 3, 0, 0]}>
          {data.map((d, i) => (
            <Cell
              key={i}
              fill={d.seconds > avgSeconds * 1.5 ? "#f59e0b" : !d.isAnswered ? "#94a3b8" : d.isCorrect ? "#16a34a" : "#dc2626"}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
