interface Props {
  label: string;
  value: string;
  accent?: "default" | "green" | "red" | "blue" | "amber";
}

const ACCENTS: Record<NonNullable<Props["accent"]>, string> = {
  default: "text-slate-900",
  green: "text-green-700",
  red: "text-red-600",
  blue: "text-blue-700",
  amber: "text-amber-600",
};

export default function StatCard({ label, value, accent = "default" }: Props) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
      <p className="text-xs font-medium text-slate-500 mb-1">{label}</p>
      <p className={`text-xl sm:text-2xl font-bold ${ACCENTS[accent]}`}>{value}</p>
    </div>
  );
}
