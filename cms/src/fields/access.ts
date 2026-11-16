import type { Access } from 'payload'

/**
 * Who may read content.
 *
 * Everything in this CMS is the public website's own copy — it is published
 * at www.movement-studio.pl the moment it is saved, so reading it through the
 * API reveals nothing that visiting the site would not. Making it public
 * removes a failure mode from the build: the GitHub Actions run that fetches
 * the snapshot cannot fail on an expired token.
 *
 * The fetch script still sends `Authorization: users API-Key …` when
 * PAYLOAD_API_KEY is set, so locking this down later is a change here and a
 * repository secret, not a change to the site.
 */
export const publicRead: Access = () => true

/** Writing is for signed-in editors. */
export const editorsOnly: Access = ({ req }) => Boolean(req.user)
