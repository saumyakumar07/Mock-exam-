interface Props {
  label: string;
  value: string;
  accent?: "default" | "green" | "red" | "blue" | "amber";
}

const ACCENTS: Record<NonNullable<Props["accent"]>, string> = {
  default: "text-zinc-50",
  green: "text-green-400",
  red: "text-red-400",
  blue: "text-orange-400",
  amber: "text-amber-400",
};

export default function StatCard({ label, value, accent = "default" }: Props) {
  return (
    <div className="bg-zinc-900 rounded-xl border border-zinc-800 shadow-sm p-4">
      <p className="text-xs font-medium text-zinc-400 mb-1">{label}</p>
      <p className={`text-xl sm:text-2xl font-bold ${ACCENTS[accent]}`}>{value}</p>
    </div>
  );
}
