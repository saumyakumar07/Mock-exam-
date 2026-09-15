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

export default function SubjectBarChart({ data }: { data: SubjectStat[] }) {
  if (data.length === 0) return <p className="text-sm text-slate-500">No data to display.</p>;

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="subject" tick={{ fontSize: 11 }} interval={0} angle={-15} textAnchor="end" height={60} />
        <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
        <Tooltip />
        <Legend />
        <Bar dataKey="correct" stackId="a" name="Correct" fill="#16a34a" radius={[0, 0, 0, 0]} />
        <Bar dataKey="incorrect" stackId="a" name="Incorrect" fill="#dc2626" />
        <Bar dataKey="unanswered" stackId="a" name="Unanswered" fill="#94a3b8" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
