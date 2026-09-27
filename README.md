# Welth — Intelligent Personal Finance

Welth is a Next.js personal-finance workspace for tracking accounts, transactions and budgets, with Clerk authentication, Prisma/PostgreSQL persistence and optional AI-assisted receipt scanning.

## Included

- Secure sign-in and sign-up with Clerk
- Dashboard with balance, income, expense and cashflow summaries
- Current and savings account management
- Transaction creation and history
- Monthly budget tracking
- Receipt scanning with Gemini
- Recurring transaction infrastructure with Inngest
- Rate limiting with Arcjet
- Responsive marketing website and application shell

## Stack

Next.js 15 · React 19 · Tailwind CSS · Clerk · Prisma · PostgreSQL/Supabase · Gemini · Inngest · Arcjet

## Environment

Use the .env.example file as the configuration checklist. Never commit production secrets. Vercel environment variables should contain the real production values.

Clerk's current Next.js guidance supports dedicated /sign-in and /sign-up routes and recommends configuring the matching redirect environment variables.

## Deployment

The repository is connected to Vercel. Pushing to main triggers a new deployment. After changing Vercel environment variables, redeploy the project so the new values are included in the build.

## Security

Never commit .env, .env.local, API keys, database URLs, or Clerk secret keys. Variables prefixed with NEXT_PUBLIC_ are bundled into client JavaScript, so they must never contain private secrets.
