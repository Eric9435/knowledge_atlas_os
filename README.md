# Knowledge Atlas OS

A Next.js reading workspace for discovering books, generating excerpt-based AI insights, and saving learning records.

## Implemented workflows

- Public-domain book discovery through Gutendex/Project Gutenberg.
- Google Books and Open Library discovery service modules.
- Daily reading interface with category selection and session timer.
- AI-generated summaries, ideas, takeaways, and action points.
- Browser-local records and Supabase book persistence.
- Saved-book views, PDF export, and light/dark controls.

## Stack

Next.js, React, TypeScript, Supabase, browser storage, and OpenRouter for the current text-analysis endpoint.

## Local development

Use Node.js 22 and npm:

```bash
git clone https://github.com/Eric9435/knowledge_atlas_os.git
cd knowledge_atlas_os
npm install
npm run dev
```

Open http://localhost:3000. Run `npm run lint` and `npm run build` to check the application, then `npm run start` to serve a successful build.

## Configuration

Create `.env.local` with your own values:

```env
OPENROUTER_API_KEY=your_server_side_key
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_public_anon_key
```

The cloud client expects a `books` table with the fields written by `lib/cloudStorage.ts`, including book identity, title, author, subjects, text URL, analysis, flags, status, and update timestamp. Configure the table and access policies in your own Supabase project; there is no complete database setup workflow documented in this repository.

## How analysis works

`app/api/analyze-fulltext/route.ts` fetches book text, cleans it, and sends **the first 1,200 characters** to OpenRouter. Despite the route name, the current implementation does not analyze an entire book. Generated conclusions need checking against the source.

## Repository map

- `app/` — pages and API routes.
- `lib/storage.ts` — browser records.
- `lib/cloudStorage.ts` — Supabase book access.
- `lib/session.ts` — reading-session tracking.
- `services/discovery/` — discovery adapters.
- `components/` — theme and presentation components.

## Current boundaries

Several graph, analytics, reminder, and search pages remain small scaffolds. Autonomous discovery, semantic retrieval, and a complete knowledge graph are development goals, not established features. Book discovery, AI requests, and cloud saving require internet. Confirm source licensing for your jurisdiction and use case.

No automated test script is defined; lint/build checks are available.

## Maintainer

[Aung Phone Myat (Eric)](https://github.com/Eric9435)
