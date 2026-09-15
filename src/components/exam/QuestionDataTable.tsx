import { QuestionTable } from "@/types/exam";

export default function QuestionDataTable({ table }: { table: QuestionTable }) {
  return (
    <div className="mb-5 overflow-x-auto rounded-lg border border-slate-200">
      <table className="w-full text-sm border-collapse">
        {table.caption && (
          <caption className="text-left text-xs text-slate-500 px-3 pt-2 pb-1 caption-top">
            {table.caption}
          </caption>
        )}
        <thead>
          <tr className="bg-slate-800 text-white">
            {table.headers.map((h, i) => (
              <th key={i} className="px-3 py-2 text-left font-semibold whitespace-nowrap">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row, ri) => (
            <tr key={ri} className={ri % 2 === 0 ? "bg-white" : "bg-slate-50"}>
              {row.map((cell, ci) => (
                <td key={ci} className="px-3 py-2 border-t border-slate-200 whitespace-nowrap">
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
