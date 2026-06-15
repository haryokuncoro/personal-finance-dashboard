# Personal Finance Dashboard

A Next.js personal finance dashboard for tracking income, expenses, and transaction history with secure email/password authentication.

## Features

- User registration and login using `next-auth` credentials provider
- PostgreSQL database with Prisma ORM
- Transaction CRUD via authenticated API routes
- Dashboard stats with income, expense, and balance calculations
- Responsive UI powered by Tailwind CSS and React

## Tech stack

- Next.js 16.2
- React 19
- TypeScript
- Tailwind CSS 4
- Prisma 7
- PostgreSQL
- NextAuth.js
- React Hook Form
- Recharts
- Zod

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a `.env` file at the project root with the following variables:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/your_database
AUTH_SECRET=your-auth-secret
```

### 3. Generate Prisma client and run migrations

```bash
npx prisma generate
npx prisma migrate dev --name init
```

### 4. Run the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Available scripts

- `npm run dev` - start development server
- `npm run build` - generate Prisma client and build the app
- `npm run start` - run the production server
- `npm run lint` - run ESLint

## Project structure

- `src/app` - Next.js app routes and pages
- `src/app/api` - server-side API routes for auth, transactions, and dashboard stats
- `src/components` - UI components like navbar, transaction form, and table
- `src/services` - client-side services for auth and transaction API calls
- `src/lib/prisma.ts` - Prisma client configuration
- `prisma/schema.prisma` - database schema and models

## Database schema

Models included:

- `User` with `id`, `name`, `email`, `passwordHash`, and transaction relation
- `Transaction` with `amount`, `description`, `type`, `category`, `date`, and `userId`

Transaction types:

- `INCOME`
- `EXPENSE`

## Authentication

This app uses credential-based authentication via `next-auth`.

- Users register through `/register`
- Users login through `/login`
- Session state is managed with JSON Web Tokens

## API routes

- `POST /api/auth/register` - create a new user
- `POST /api/auth/[...nextauth]` - login with credentials
- `GET /api/transactions` - fetch authenticated user's transactions
- `POST /api/transactions` - create a new transaction
- `DELETE /api/transactions/[id]` - delete a transaction
- `GET /api/dashboard/stats` - fetch income, expense, and balance stats

## Notes

- Ensure `DATABASE_URL` points to a running PostgreSQL instance.
- `AUTH_SECRET` should be a strong secret in production.
- The app is private by default and optimized for local development.

## License

This project is private.
