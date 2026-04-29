# Meridian — Personal Life OS

A full-stack learning and habit tracking system built with Next.js 16, Prisma, and Tailwind CSS v4.

## Features

- **Learning Domains** — Full Stack, DevOps, AI, Web3 with topic curriculum and project tracking
- **Habit Tracker** — Boxing & Guitar with 16-week heatmap calendar, streak tracking, and day-of-week pattern analysis
- **Trend Feed** — Live RSS feeds pulling domain-specific articles and arXiv research papers, refreshed every 30 min
- **Dashboard** — Stats overview, 4-column domain cards, recent completions

## Tech Stack

- [Next.js 16](https://nextjs.org/) — App Router, Turbopack, Server Actions
- [Prisma](https://www.prisma.io/) — SQLite locally, swap to Postgres for production
- [Tailwind CSS v4](https://tailwindcss.com/) via `@tailwindcss/postcss`
- [Lucide React](https://lucide.dev/) icons
- [fast-xml-parser](https://github.com/NaturalIntelligence/fast-xml-parser) for RSS

## Getting Started

**Requirements:** Node.js >= 20.9.0, pnpm

```bash
pnpm install
pnpm prisma db push
pnpm tsx prisma/seed.ts
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy on Vercel

Configured via `vercel.json`. For production, swap SQLite for a Postgres provider (Neon, Supabase) and set `DATABASE_URL` in Vercel environment variables.

```bash
vercel --prod
```

## Project Structure

```
app/
  page.tsx           # Dashboard
  habits/            # Habit heatmap + streaks
  domain/[id]/       # Domain detail — curriculum + projects
  feed/              # Live trend feed (RSS)
components/
  Sidebar.tsx
  DomainCard.tsx
  HabitCalendar.tsx
  HabitButton.tsx
  TopicList.tsx
  ProjectList.tsx
  ProgressBar.tsx
actions/             # Server Actions
lib/
  prisma.ts
  rss.ts             # RSS fetching + parsing
prisma/
  schema.prisma
  seed.ts            # Seeds 4 domains with full topic + project data
```

## Seed the database

```bash
pnpm tsx prisma/seed.ts
```

Creates Full Stack, DevOps, AI, and Web3 domains with complete topic lists and sample projects.
