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

Create `.env.local` when later milestones connect MongoDB Atlas and Supabase. These names are placeholders only; the app does not read them yet.

```bash
MONGODB_URI=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

`MONGODB_URI` stays server-side. Do not prefix it with `NEXT_PUBLIC_`.
