import type { GlobalConfig } from 'payload'
import { editorsOnly, publicRead } from '../fields/access'
import { linkField } from '../fields/common'

const access = { read: publicRead, update: editorsOnly }

/** The home-page band linking to /programs. */
export const ProgramsTeaser: GlobalConfig = {
  slug: 'programs-teaser',
  label: 'Zapowiedź projektów',
  access,
  admin: { description: 'Pasek na stronie głównej prowadzący na /programs.', group: 'Projekty' },
  fields: [
    { name: 'eyebrow', type: 'text', required: true, label: 'Nadtytuł' },
    { name: 'title', type: 'text', required: true, label: 'Nagłówek' },
    { name: 'body', type: 'textarea', required: true, label: 'Tekst' },
    linkField('cta', 'Przycisk'),
    {
      name: 'posters',
      type: 'array',
      required: true,
      minRows: 1,
      label: 'Plakaty',
      labels: { singular: 'Plakat', plural: 'Plakaty' },
      admin: {
        description:
          'Każdy plakat jest linkiem bez własnego tekstu, więc musi mieć opis dla czytników ekranu — to jedyne miejsce na stronie, gdzie taki opis ZASTĘPUJE tekst, bo nie ma tu żadnego tekstu do zastąpienia.',
      },
      fields: [
        { name: 'image', type: 'upload', relationTo: 'media', required: true, label: 'Obrazek' },
        { name: 'href', type: 'text', required: true, label: 'Adres', admin: { description: 'Zwykle /programs/.' } },
        { name: 'ariaLabel', type: 'text', required: true, label: 'Opis linku dla czytników ekranu' },
      ],
    },
  ],
}

/**
 * Page-level copy for /programs.
 *
 * The route carries its own meta title and description, written differently
 * from the visible heading: a heading can lean on the page around it, a
 * search result cannot.
 */
export const ProgramsPageCopy: GlobalConfig = {
  slug: 'programs-page-copy',
  label: 'Strona /programs',
  access,
  admin: { description: 'Teksty samej strony projektów — nagłówek, wprowadzenie i nagłówki tabel.', group: 'Projekty' },
  fields: [
    {
      name: 'meta',
      type: 'group',
      label: 'Tytuł i opis w wyszukiwarce',
      admin: { description: 'Osobne od nagłówka niżej — to widać w wynikach wyszukiwania i w podglądzie linku.' },
      fields: [
        { name: 'title', type: 'text', required: true, label: 'Tytuł' },
        { name: 'description', type: 'textarea', required: true, label: 'Opis' },
      ],
    },
    { name: 'eyebrow', type: 'text', required: true, label: 'Nadtytuł' },
    { name: 'title', type: 'text', required: true, label: 'Nagłówek strony' },
    { name: 'intro', type: 'textarea', required: true, label: 'Wprowadzenie' },
    linkField('backLink', 'Odnośnik powrotny', {
      description: 'Prowadzi z powrotem do oferty, żeby strona nie była ślepym zaułkiem.',
    }),
    { name: 'sessionsHeading', type: 'text', required: true, label: 'Nagłówek nad terminami' },
    { name: 'venueHeading', type: 'text', required: true, label: 'Nagłówek nad miejscem' },
  ],
}
