# Welth - Personal Finance Tracker

Welth is a modern, full-stack personal finance tracking application that helps users monitor transactions, manage budgets, analyze spending habits, and plan their financial future.

## Tech Stack & Architecture

- **Frontend Framework:** Next.js 15 (React 19, App Router)
- **Database & ORM:** PostgreSQL hosted on Supabase, accessed via Prisma ORM
- **Authentication:** Clerk Middleware
- **Security Shield:** Arcjet (Rate limiting, Bot protection, SQL Injection protection)
- **Background Processes:** Inngest (Serverless event-driven queues)
- **Object Storage:** Firebase
- **Styling:** Tailwind CSS + Shadcn UI components

---

## Getting Started

### 1. Prerequisites
Ensure you have **Node.js v18.0.0+** and `npm` installed.

### 2. Installation
Clone the repository and install the dependencies:
```bash
npm install
```

### 3. Environment Variables
Create a file named `.env` in the root directory and define the following variables:
```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Supabase & Prisma database connection
DATABASE_URL="postgresql://postgres:password@host:port/database?sslmode=require&pgbouncer=true"

# Arcjet API Key
ARCJET_KEY=ajkey_...

# Supabase configuration
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=sb_...
```

### 4. Database Setup & Sync
Generate the Prisma client and sync the schema with your Supabase database:
```bash
npx prisma generate
npx prisma db push
```

### 5. Running the Application
To run the development server locally:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

---

## Deployment to Vercel

When deploying to Vercel, the application automatically builds and provisions serverless functions. 
To ensure a successful build:
1. Ensure the `postinstall` script runs `prisma generate` to compile the Prisma client.
2. Configure all environment variables in Vercel.
