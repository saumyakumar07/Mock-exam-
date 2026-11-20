import { QuestionTable } from "@/types/exam";

export default function QuestionDataTable({ table }: { table: QuestionTable }) {
  return (
    <div className="mb-5 overflow-x-auto rounded-lg border border-zinc-800">
      <table className="w-full text-sm border-collapse">
        {table.caption && (
          <caption className="text-left text-xs text-zinc-400 px-3 pt-2 pb-1 caption-top">
            {table.caption}
          </caption>
        )}
        <thead>
          <tr className="bg-zinc-900 text-white">
            {table.headers.map((h, i) => (
              <th key={i} className="px-3 py-2 text-left font-semibold whitespace-nowrap">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row, ri) => (
            <tr key={ri} className={ri % 2 === 0 ? "bg-zinc-900" : "bg-zinc-800/60"}>
              {row.map((cell, ci) => (
                <td key={ci} className="px-3 py-2 border-t border-zinc-800 whitespace-nowrap">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
