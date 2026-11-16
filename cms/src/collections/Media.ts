import type { CollectionConfig } from 'payload'
import { editorsOnly, publicRead } from '../fields/access'

/**
 * Images and video.
 *
 * `alt` is required because it is content, not metadata: ImageRef carries it
 * to every <img> on the site, and the accessibility gate is at zero issues.
 * Decorative art is the only case for an empty one, and there is none here —
 * every image on the site is a person, a poster or a frame of the hero clip.
 *
 * Payload records width and height for images on upload, which is what lets
 * the site build an ImageRef without a second request. Video carries no
 * intrinsic size through sharp, so the hero clip's dimensions are authored on
 * the HeroCopy global instead.
 */
export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Plik', plural: 'Pliki' },
  access: { read: publicRead, create: editorsOnly, update: editorsOnly, delete: editorsOnly },
  admin: {
    useAsTitle: 'filename',
    description: 'Zdjęcia i wideo używane na stronie.',
    group: 'Media',
  },
  upload: {
    staticDir: 'media',
    mimeTypes: ['image/*', 'video/*'],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      label: 'Opis alternatywny',
      admin: {
        description:
          'Co widać na zdjęciu, po polsku, jednym zdaniem. Czyta to osoba korzystająca z czytnika ekranu — opisz treść, nie plik. Nie zaczynaj od „Zdjęcie…”.',
      },
    },
  ],
}
