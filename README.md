# Exam Prep — Mock Test Platform

A realistic, timed mock-exam platform for practicing government competitive exams. Built with Next.js, TypeScript, and Tailwind CSS. Questions live in code; every submitted result is saved to a small Redis database so an admin can review everyone's scores.

## Features

- Home screen with a name field, a duration picker (30 min – 3 hours), and a quote of the day
- Full exam interface: question palette, subject tabs, mark-for-review, clear response, previous/next navigation, and a live countdown timer that auto-submits at zero
- Data Interpretation questions render as real tables, matching the source material
- Submit confirmation that warns about unanswered questions
- Results page with score, accuracy, percentage, subject-wise breakdown, time-per-question analysis, weak/strong areas, and a full answer review
- Every submission is saved server-side (name + score summary), viewable on a password-protected `/admin` page
- Fully responsive (desktop-first, works on tablet/mobile)

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Setting up result tracking (`/admin`)

Results are saved to a free [Upstash Redis](https://console.upstash.com) database, and the `/admin` page is protected by a password you choose. Both are optional — without them, the exam still works end-to-end, it just won't save anyone's results anywhere.

1. Copy `.env.local.example` to `.env.local`.
2. Set `ADMIN_PASSWORD` to whatever password you want to use to log into `/admin`.
3. Create a free database at [console.upstash.com](https://console.upstash.com) (Redis → Create Database), open its **REST API** tab, and copy the URL and token into `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`.
4. Restart `npm run dev`.

Once a candidate submits an exam, their name and score summary are saved automatically. Visit `/admin`, log in with your password, and you'll see every submission — name, test, score, percentage, correct/incorrect/unanswered counts, time taken, and submission time — most recent first.

For production on Vercel, add the same three variables in **Project Settings → Environment Variables**.

## Adding a new mock test

Questions are plain TypeScript, so a new mock test is just a new file:

1. Copy [`src/data/exams/sbiClerkPrelimsSet2.ts`](src/data/exams/sbiClerkPrelimsSet2.ts) to a new file and fill in your questions. Each question needs a unique `id`, a `subject`/`topic`, a `difficulty`, `options`, and a `correctAnswerIndex`. Use the `table` field for Data Interpretation questions so they render as real tables instead of run-on text.
2. Register it in [`src/data/exams/index.ts`](src/data/exams/index.ts) by importing it and adding it to the `examSets` array.
3. It will automatically appear in the "Select Mock Test" dropdown on the home page (the dropdown only shows once there is more than one test).

The `markingScheme` on each `ExamSet` controls positive/negative marking (defaults to +1 / −0.25, a common SSC/banking pattern) — adjust per test as needed.

**Important:** the app shows one question at a time with no shared "passage" or "puzzle setup" panel. Any question that depends on shared context (a reading passage, a DI table's numbers, a puzzle's clues, a coding rule) must repeat that context inline in its own `text`, usually via a shared constant — see how `HIRING_ALGO_PASSAGE`, `CIRCULAR_COLOUR_SETUP`, etc. are reused across questions in `sbiClerkPrelimsSet2.ts`.

## Deploying to Vercel

This is a standard Next.js app, so it deploys to Vercel with zero configuration:

```bash
npx vercel
```

or connect the git repository in the Vercel dashboard and it will build automatically on every push. Add the three environment variables from the section above if you want result tracking in production.
