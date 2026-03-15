# QuizForge (Supabase + Vercel)

QuizForge is a React quiz app with gamification, admin tooling, and persistent cloud storage via **Supabase Postgres**.

---

## Tech stack

- React (Create React App)
- Supabase (Postgres + REST API)
- Vercel (frontend hosting)

---

## 1) Run locally

### Prerequisites

- Node.js 18+
- npm
- A Supabase project

### Install

```bash
npm install
```

### Configure env

1. Copy `.env.example` to `.env`.
2. Fill in your Supabase values:

```bash
REACT_APP_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
REACT_APP_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

### Start app

```bash
npm start
```

---

## 2) Create SQL backend in Supabase (step-by-step)

1. Open your Supabase project dashboard.
2. Go to **SQL Editor**.
3. Open `supabase/schema.sql` from this repo.
4. Paste and run it.

This creates a singleton `app_state` table (`id = 1`) that stores app data in `jsonb` and enables RLS policies for demo usage.

> ✅ Auth now uses Supabase Auth (email/password behind the scenes). Legacy in-state demo credentials are auto-migrated on first successful sign-in.

---

## 3) Deploy to Vercel (step-by-step)

1. Push this repository to GitHub/GitLab/Bitbucket.
2. In Vercel, click **Add New Project** and import the repo.
3. Framework preset: **Create React App** (auto-detected).
4. Add Environment Variables in Vercel project settings:
   - `REACT_APP_SUPABASE_URL`
   - `REACT_APP_SUPABASE_ANON_KEY`
5. Click **Deploy**.
6. After deploy, open the app URL and test login/register + quiz save flow.

### Recommended production checks

- Make sure Supabase RLS policies are restricted (avoid open anon write in production).
- Rotate keys if exposed.
- Confirm email/OTP policy and password reset flows in Supabase Auth settings.

---

## 4) Optional: add your own admin seed data

The default store includes:

- `admin / admin123` demo account
- Empty challenges/questions stats

You can edit `DEFAULT_STORE` in `src/utils/storage.js` to seed additional data.

---

## Available Scripts

```bash
npm start
npm run build
```
