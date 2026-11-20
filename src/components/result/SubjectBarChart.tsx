"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { SubjectStat } from "@/lib/examEngine";
import { AXIS_TICK, TOOLTIP_PROPS } from "./chartTheme";

const shorten = (s: string) => (s.length > 22 ? `${s.slice(0, 21)}…` : s);

export default function SubjectBarChart({ data }: { data: SubjectStat[] }) {
  if (data.length === 0) return <p className="text-sm text-zinc-400">No data to display.</p>;

  return (
    <ResponsiveContainer width="100%" height={330}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
        <XAxis dataKey="subject" tick={{ ...AXIS_TICK, fontSize: 10 }} tickFormatter={shorten} interval={0} angle={-35} textAnchor="end" height={110} />
        <YAxis tick={AXIS_TICK} allowDecimals={false} />
        <Tooltip {...TOOLTIP_PROPS} />
        <Legend />
        <Bar dataKey="correct" stackId="a" name="Correct" fill="#16a34a" radius={[0, 0, 0, 0]} />
        <Bar dataKey="incorrect" stackId="a" name="Incorrect" fill="#dc2626" />
        <Bar dataKey="unanswered" stackId="a" name="Unanswered" fill="#94a3b8" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
