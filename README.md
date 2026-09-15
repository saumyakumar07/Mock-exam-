# Exam Prep — Mock Test Platform

A realistic, timed mock-exam platform for practicing government competitive exams. Built with Next.js, TypeScript, and Tailwind CSS. No backend or database — questions live in code and results are computed entirely in the browser.

## Features

- Home screen with a duration picker (1 / 2 / 3 hours) and a quote of the day
- Full exam interface: question palette, subject tabs, mark-for-review, clear response, previous/next navigation, and a live countdown timer that auto-submits at zero
- Submit confirmation that warns about unanswered questions
- Results page with score, accuracy, percentage, subject-wise breakdown, time-per-question analysis, weak/strong areas, and a full answer review
- Fully responsive (desktop-first, works on tablet/mobile)

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Adding a new mock test

Questions are plain TypeScript, so a new mock test is just a new file:

1. Copy [`src/data/exams/set1.ts`](src/data/exams/set1.ts) to e.g. `src/data/exams/set2.ts` and fill in your questions. Each question needs a unique `id`, a `subject`/`topic`, a `difficulty`, `options`, and a `correctAnswerIndex`.
2. Register it in [`src/data/exams/index.ts`](src/data/exams/index.ts) by importing it and adding it to the `examSets` array.
3. It will automatically appear in the "Select Mock Test" dropdown on the home page (the dropdown only shows once there is more than one test).

The `markingScheme` on each `ExamSet` controls positive/negative marking (defaults to +1 / −0.25, a common SSC/banking pattern) — adjust per test as needed.

## Deploying to Vercel

This is a standard Next.js app, so it deploys to Vercel with zero configuration:

```bash
npx vercel
```

or connect the git repository in the Vercel dashboard and it will build automatically on every push. No environment variables or database setup are required.
