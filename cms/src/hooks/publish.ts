import type { CollectionConfig, GlobalConfig } from 'payload'

/**
 * Publishing.
 *
 * The site is a static export on GitHub Pages: it holds a snapshot of this
 * database taken at build time and never talks to the CMS at run time. So a
 * save here changes nothing visitors can see until the site is rebuilt, and
 * something has to ask for that rebuild.
 *
 * That something is a repository_dispatch to GitHub, which reruns the Pages
 * workflow — fetch the snapshot, build, deploy. Saves are coalesced over a
 * few seconds so editing six fields in a row is one deploy, not six.
 *
 * With GITHUB_DISPATCH_TOKEN unset this does nothing at all, which is what
 * you want locally: a developer's saves must not deploy the live site.
 */

const DEBOUNCE_MS = 10_000

let pending: NodeJS.Timeout | null = null

type Logger = { info: (msg: string) => void; error: (msg: string) => void }

async function dispatch(logger: Logger): Promise<void> {
  const token = process.env.GITHUB_DISPATCH_TOKEN
  const repo = process.env.GITHUB_DISPATCH_REPO
  if (!token || !repo) return

  try {
    const response = await fetch(`https://api.github.com/repos/${repo}/dispatches`, {
      method: 'POST',
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${token}`,
        'X-GitHub-Api-Version': '2022-11-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ event_type: 'content-publish' }),
    })
    if (response.ok) {
      logger.info(`publish: asked ${repo} to rebuild the site`)
    } else {
      logger.error(`publish: ${repo} refused the rebuild — ${response.status} ${response.statusText}`)
    }
  } catch (error) {
    logger.error(`publish: could not reach GitHub — ${(error as Error).message}`)
  }
}

function schedule(logger: Logger): void {
  if (!process.env.GITHUB_DISPATCH_TOKEN || !process.env.GITHUB_DISPATCH_REPO) return
  if (pending) clearTimeout(pending)
  pending = setTimeout(() => {
    pending = null
    void dispatch(logger)
  }, DEBOUNCE_MS)
  // A pending rebuild must not hold the process open.
  pending.unref?.()
}

/** Attach the publish trigger to a collection, keeping its own hooks. */
export const publishOnChange = (collection: CollectionConfig): CollectionConfig => ({
  ...collection,
  hooks: {
    ...collection.hooks,
    afterChange: [
      ...(collection.hooks?.afterChange ?? []),
      ({ req, doc }) => {
        schedule(req.payload.logger)
        return doc
      },
    ],
    afterDelete: [
      ...(collection.hooks?.afterDelete ?? []),
      ({ req, doc }) => {
        schedule(req.payload.logger)
        return doc
      },
    ],
  },
})

/** The same, for a global. */
export const publishOnGlobalChange = (global: GlobalConfig): GlobalConfig => ({
  ...global,
  hooks: {
    ...global.hooks,
    afterChange: [
      ...(global.hooks?.afterChange ?? []),
      ({ req, doc }) => {
        schedule(req.payload.logger)
        return doc
      },
    ],
  },
})
