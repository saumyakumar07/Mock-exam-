import { isAdminAuthed, isAdminConfigured } from "@/lib/adminAuth";
import { listResultRecords, isResultsStoreConfigured } from "@/lib/redis";
import { ResultRecord } from "@/types/exam";
import { formatDuration } from "@/lib/examEngine";

export const dynamic = "force-dynamic";

function formatDate(ms: number): string {
  return new Date(ms).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  if (!isAdminConfigured()) {
    return (
      <main className="flex-1 flex items-center justify-center px-4 py-16 bg-slate-100">
        <div className="max-w-md bg-white border border-slate-200 rounded-xl shadow-sm p-6 text-sm text-slate-700">
          <h1 className="text-lg font-bold text-slate-900 mb-2">Admin panel not configured</h1>
          <p>
            Set an <code className="bg-slate-100 px-1 rounded">ADMIN_PASSWORD</code> environment
            variable (locally in <code className="bg-slate-100 px-1 rounded">.env.local</code>,
            and in your Vercel project&rsquo;s settings for production) to enable this page.
          </p>
        </div>
      </main>
    );
  }

  const authed = await isAdminAuthed();

  if (!authed) {
    return (
      <main className="flex-1 flex items-center justify-center px-4 py-16 bg-slate-100">
        <form
          action="/api/admin/login"
          method="POST"
          className="w-full max-w-sm bg-white border border-slate-200 rounded-xl shadow-sm p-6"
        >
          <h1 className="text-lg font-bold text-slate-900 mb-1">Admin Login</h1>
          <p className="text-sm text-slate-500 mb-4">Enter the admin password to view results.</p>
          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-4">
              Incorrect password.
            </p>
          )}
          <input
            type="password"
            name="password"
            placeholder="Password"
            autoFocus
            className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-slate-900 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <button
            type="submit"
            className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-lg py-2.5 cursor-pointer"
          >
            Log In
          </button>
        </form>
      </main>
    );
  }

  if (!isResultsStoreConfigured()) {
    return (
      <main className="flex-1 flex items-center justify-center px-4 py-16 bg-slate-100">
        <div className="max-w-md bg-white border border-slate-200 rounded-xl shadow-sm p-6 text-sm text-slate-700">
          <h1 className="text-lg font-bold text-slate-900 mb-2">Result storage not configured</h1>
          <p>
            Set <code className="bg-slate-100 px-1 rounded">UPSTASH_REDIS_REST_URL</code> and{" "}
            <code className="bg-slate-100 px-1 rounded">UPSTASH_REDIS_REST_TOKEN</code> (from a
            free Upstash Redis database) so submitted results have somewhere to be saved.
          </p>
        </div>
      </main>
    );
  }

  const records = await listResultRecords<ResultRecord>();
  records.sort((a, b) => b.submittedAt - a.submittedAt);

  return (
    <main className="flex-1 bg-slate-100 px-4 sm:px-6 py-8">
      <div className="max-w-6xl mx-auto flex flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-blue-700 uppercase tracking-wide">Admin</p>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Submitted Results</h1>
            <p className="text-sm text-slate-500 mt-1">
              {records.length} submission{records.length === 1 ? "" : "s"} recorded.
            </p>
          </div>
          <form action="/api/admin/logout" method="POST">
            <button
              type="submit"
              className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 cursor-pointer"
            >
              Log Out
            </button>
          </form>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-x-auto">
          {records.length === 0 ? (
            <p className="p-6 text-sm text-slate-500">No submissions yet.</p>
          ) : (
            <table className="w-full text-sm min-w-[900px]">
              <thead>
                <tr className="text-left text-slate-500 border-b border-slate-200 bg-slate-50">
                  <th className="py-3 px-4 font-medium">Name</th>
                  <th className="py-3 px-4 font-medium">Test</th>
                  <th className="py-3 px-4 font-medium">Score</th>
                  <th className="py-3 px-4 font-medium">%</th>
                  <th className="py-3 px-4 font-medium">Correct</th>
                  <th className="py-3 px-4 font-medium">Incorrect</th>
                  <th className="py-3 px-4 font-medium">Unanswered</th>
                  <th className="py-3 px-4 font-medium">Time Taken</th>
                  <th className="py-3 px-4 font-medium">Submitted</th>
                </tr>
              </thead>
              <tbody>
                {records.map((r) => (
                  <tr key={r.id} className="border-b border-slate-100 last:border-0">
                    <td className="py-3 px-4 font-medium text-slate-800">{r.candidateName}</td>
                    <td className="py-3 px-4 text-slate-600">{r.examTitle}</td>
                    <td className="py-3 px-4 text-slate-600">
                      {r.score.toFixed(2)} / {r.maxScore}
                    </td>
                    <td className="py-3 px-4 text-blue-700 font-semibold">
                      {r.percentage.toFixed(1)}%
                    </td>
                    <td className="py-3 px-4 text-green-700">{r.correct}</td>
                    <td className="py-3 px-4 text-red-600">{r.incorrect}</td>
                    <td className="py-3 px-4 text-slate-600">{r.unanswered}</td>
                    <td className="py-3 px-4 text-slate-600">
                      {formatDuration(r.timeTakenMs)}
                      {r.autoSubmitted && (
                        <span className="ml-1.5 text-xs text-amber-600">(auto)</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                      {formatDate(r.submittedAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </main>
  );
}
