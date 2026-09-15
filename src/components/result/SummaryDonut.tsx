"use client";

import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

interface Props {
  correct: number;
  incorrect: number;
  unanswered: number;
}

const COLORS = { correct: "#16a34a", incorrect: "#dc2626", unanswered: "#94a3b8" };

export default function SummaryDonut({ correct, incorrect, unanswered }: Props) {
  const data = [
    { name: "Correct", value: correct, color: COLORS.correct },
    { name: "Incorrect", value: incorrect, color: COLORS.incorrect },
    { name: "Unanswered", value: unanswered, color: COLORS.unanswered },
  ].filter((d) => d.value > 0);

  if (data.length === 0) {
    return <p className="text-sm text-slate-500">No data to display.</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" innerRadius={60} outerRadius={95} paddingAngle={2}>
          {data.map((d) => (
            <Cell key={d.name} fill={d.color} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
