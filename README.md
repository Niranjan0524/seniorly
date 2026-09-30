# Seniorly

Seniorly is a place for students to share what actually happened in their interviews, and for juniors to find that before placements.

Someone who has been through a process writes it up in a structured way: company, role, internship or full-time, college, branch, year, the rounds they faced, the questions they remember, and how they prepared. Other students search by company and role, filter the list, and read the experience instead of hunting through WhatsApp chats and scattered notes.

The first campus is IIIT Kottayam. Colleges are stored as data, so later campuses can be added without rewriting the app.

The app is Next.js (App Router), TypeScript, and Tailwind CSS. Interview data will live in MongoDB Atlas. Sign-in will be Google through Supabase Auth. Those pieces are not wired up yet.

## Scripts

```bash
npm run dev
npm run lint
npm run build
```

## Environment

```bash
MONGODB_URI=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```

`NEXT_PUBLIC_SUPABASE_URL` is the project URL (`https://YOUR_PROJECT.supabase.co`). `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` is the `sb_publishable_...` key. `MONGODB_URI` stays server-side. Do not put the `sb_secret_...` key in this file.
