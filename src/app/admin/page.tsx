import { isAdminAuthed, isAdminConfigured } from "@/lib/adminAuth";
import { listResultRecords, hasRedisEnvVars } from "@/lib/redis";
import { ResultRecord } from "@/types/exam";
import { formatDuration } from "@/lib/examEngine";
import BrandLogo, { COMPANY_NAME } from "@/components/brand/BrandLogo";

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
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-md bg-zinc-900 border border-zinc-800 rounded-xl shadow-sm p-6 text-sm text-zinc-200">
          <h1 className="text-lg font-bold text-zinc-50 mb-2">Admin panel not configured</h1>
          <p>
            Set an <code className="bg-zinc-800 px-1 rounded">ADMIN_PASSWORD</code> environment
            variable (locally in <code className="bg-zinc-800 px-1 rounded">.env.local</code>,
            and in your Vercel project&rsquo;s settings for production) to enable this page.
          </p>
        </div>
      </main>
    );
  }

  const authed = await isAdminAuthed();

  if (!authed) {
    return (
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <form
          action="/api/admin/login"
          method="POST"
          className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-xl shadow-sm p-6"
        >
          <div className="mb-5">
            <BrandLogo height={36} />
          </div>
          <h1 className="text-lg font-bold text-zinc-50 mb-1">Admin Login</h1>
          <p className="text-sm text-zinc-400 mb-4">Enter the admin password to view results.</p>
          {error && (
            <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2 mb-4">
              Incorrect password.
            </p>
          )}
          <input
            type="password"
            name="password"
            placeholder="Password"
            autoFocus
            className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2.5 text-zinc-50 placeholder:text-zinc-500 mb-4 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-400 text-zinc-950 font-semibold rounded-lg py-2.5 cursor-pointer"
          >
            Log In
          </button>
        </form>
      </main>
    );
  }

  if (!hasRedisEnvVars()) {
    return (
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-md bg-zinc-900 border border-zinc-800 rounded-xl shadow-sm p-6 text-sm text-zinc-200">
          <h1 className="text-lg font-bold text-zinc-50 mb-2">Result storage not configured</h1>
          <p>
            Set <code className="bg-zinc-800 px-1 rounded">UPSTASH_REDIS_REST_URL</code> and{" "}
            <code className="bg-zinc-800 px-1 rounded">UPSTASH_REDIS_REST_TOKEN</code> (from a
            free Upstash Redis database) so submitted results have somewhere to be saved.
          </p>
        </div>
      </main>
    );
  }

  let records: ResultRecord[] = [];
  let loadError: string | null = null;
  try {
    records = await listResultRecords<ResultRecord>();
    records.sort((a, b) => b.submittedAt - a.submittedAt);
  } catch (err) {
    loadError = err instanceof Error ? err.message : "Unknown error while contacting Redis.";
  }

  if (loadError) {
    return (
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-lg bg-zinc-900 border border-zinc-800 rounded-xl shadow-sm p-6 text-sm text-zinc-200">
          <h1 className="text-lg font-bold text-zinc-50 mb-2">Couldn&rsquo;t load results</h1>
          <p className="mb-3">
            The admin login worked, but fetching results from Redis failed. This usually means{" "}
            <code className="bg-zinc-800 px-1 rounded">UPSTASH_REDIS_REST_URL</code> or{" "}
            <code className="bg-zinc-800 px-1 rounded">UPSTASH_REDIS_REST_TOKEN</code> is missing
            a character, has extra whitespace, or was copied from the wrong field in the Upstash
            console.
          </p>
          <p className="font-mono text-xs bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg px-3 py-2 break-all">
            {loadError}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 px-4 sm:px-6 py-8">
      <div className="max-w-6xl mx-auto flex flex-col gap-6">
        <BrandLogo height={40} />
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-orange-400 uppercase tracking-wide">{COMPANY_NAME} · Admin</p>
            <h1 className="text-2xl sm:text-3xl font-bold text-zinc-50">Submitted Results</h1>
            <p className="text-sm text-zinc-400 mt-1">
              {records.length} submission{records.length === 1 ? "" : "s"} recorded.
            </p>
          </div>
          <form action="/api/admin/logout" method="POST">
            <button
              type="submit"
              className="px-4 py-2 rounded-lg border border-zinc-700 text-zinc-200 font-medium hover:bg-zinc-800 cursor-pointer"
            >
              Log Out
            </button>
          </form>
        </div>

        <div className="bg-zinc-900 rounded-xl border border-zinc-800 shadow-sm overflow-x-auto">
          {records.length === 0 ? (
            <p className="p-6 text-sm text-zinc-400">No submissions yet.</p>
          ) : (
            <table className="w-full text-sm min-w-[900px]">
              <thead>
                <tr className="text-left text-zinc-400 border-b border-zinc-800 bg-zinc-800/60">
                  <th className="py-3 px-4 font-medium">Name</th>
                  <th className="py-3 px-4 font-medium">Quiz</th>
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
                  <tr key={r.id} className="border-b border-zinc-800 last:border-0">
                    <td className="py-3 px-4 font-medium text-zinc-100">{r.candidateName}</td>
                    <td className="py-3 px-4 text-zinc-300">{r.examTitle}</td>
                    <td className="py-3 px-4 text-zinc-300">
                      {r.score.toFixed(2)} / {r.maxScore}
                    </td>
                    <td className="py-3 px-4 text-orange-400 font-semibold">
                      {r.percentage.toFixed(1)}%
                    </td>
                    <td className="py-3 px-4 text-green-400">{r.correct}</td>
                    <td className="py-3 px-4 text-red-400">{r.incorrect}</td>
                    <td className="py-3 px-4 text-zinc-300">{r.unanswered}</td>
                    <td className="py-3 px-4 text-zinc-300">
                      {formatDuration(r.timeTakenMs)}
                      {r.autoSubmitted && (
                        <span className="ml-1.5 text-xs text-amber-400">(auto)</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-zinc-400 whitespace-nowrap">
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
