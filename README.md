# Sri Manikanta Korivi - Portfolio

Personal portfolio built with React, TypeScript, Vite and Supabase.

**Website:** https://sri-manikanta-korivi-portfolio.vercel.app

## Features

- Responsive portfolio and individual project pages
- Published content loaded from Supabase, with loading and failure states
- Authenticated admin dashboard backed by database authorization and row-level security
- Draft revisions, previews and content publishing
- Optional image/PDF uploads, image galleries, captions and media management
- Resume publishing controls and visitor contact inquiries

Supporting PDFs remain private with admin previews. Images use public media storage. Unlinking an attachment does not delete its stored file.

## Local development

Use Node.js 24.

```powershell
npm ci
Copy-Item .env.example .env.local
```

Set the public Supabase project URL and publishable key in `.env.local`:

```dotenv
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

Then run:

```powershell
npm run dev
```

This source currently uses an existing, provisioned Supabase backend. The SQL files under `supabase/migrations` are its historical baseline; they are not a complete automated bootstrap for a new backend. Admin access must be explicitly provisioned in the database. No admin password or server-side credential is included.

## Validation

```powershell
npm test
npm run lint
npm run build
```

The automated tests cover upload type/size limits, private document handling, cloud rejection, nested media listing, uploader controls and public project attachments.

## Deployment

On Vercel, use the repository root, `npm ci` as the install command, `npm run build` as the build command and `dist` as the output directory. Configure the two public Supabase environment variables in Vercel for production and preview builds. The included `vercel.json` provides SPA routing and response headers.

Passwords, `.env` files, `node_modules` and build output are excluded from Git. Never place a service-role key or password in a `VITE_` variable: those variables are exposed to the browser.

## Dependency maintenance

The TypeScript ESLint parser has a scoped override to `minimatch` 11.0.8 to address [GHSA-g3hv-75wg-m249](https://github.com/advisories/GHSA-g3hv-75wg-m249). It replaces the vulnerable nested 10.2.6 copy without changing application runtime dependencies. A regression test checks the resolved version and the filename matching API used by the parser.

## Content and scope

The portfolio describes actual projects and their current stages. Experimental hackathon work remains labelled as a prototype. Git history tracks source changes; published CMS content and uploaded media are stored separately in Supabase.
