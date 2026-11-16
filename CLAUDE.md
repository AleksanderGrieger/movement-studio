- Stack target: Next.js App Router + Tailwind v4, static export to GitHub Pages
- Payload runs OUT OF PROCESS in cms/ — its own package.json, lockfile and node_modules.
  The site never fetches at runtime: `npm run content:fetch` pulls a snapshot at build time.
  Root `npm ci` must never install the CMS tree; movement-studio ships next/react/react-dom only.
- Design tokens live in @theme; names are fixed — see docs/design-decisions.md
- No .json imported outside lib/content/
- Server Components by default; justify every 'use client'
- One logical change per commit
- Polish content; no hardcoded strings in JSX
