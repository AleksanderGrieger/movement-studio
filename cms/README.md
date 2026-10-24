# movement-studio-cms

Payload CMS behind [movement-studio](../). Runs out of process: the site is a
static export on GitHub Pages and reads a snapshot of this database taken at
build time, so nothing on www.movement-studio.pl ever calls this API.

```bash
npm install
cp .env.example .env     # fill in PAYLOAD_SECRET
npm run db:up            # Postgres 16 in Docker, on port 5433
npm run dev              # http://localhost:3100/admin
```

Full documentation — publishing, the snapshot, and what breaks the site's
build — is in [`docs/cms.md`](../docs/cms.md).
