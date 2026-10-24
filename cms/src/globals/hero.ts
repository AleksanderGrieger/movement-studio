import type { GlobalConfig } from 'payload'
import { editorsOnly, publicRead } from '../fields/access'
import { linkFields } from '../fields/common'

/**
 * The hero.
 *
 * The headline is three masked lines, each revealed on its own step, so the
 * line breaks are content rather than whatever the width happens to produce.
 * Within a line, emphasis is a separate run — the one word set in italic —
 * which keeps HTML out of the data.
 *
 * The clip's width and height are authored rather than read off the file:
 * Payload measures images on upload, but not video, and the site needs the
 * ratio to reserve the frame before the file loads. The poster may be empty;
 * the hero then renders without one rather than pointing at a missing file.
 */
export const HeroCopy: GlobalConfig = {
  slug: 'hero-copy',
  label: 'Sekcja powitalna',
  access: { read: publicRead, update: editorsOnly },
  admin: { description: 'Pierwszy ekran strony głównej.', group: 'Strona' },
  fields: [
    { name: 'eyebrow', type: 'text', required: true, label: 'Nadtytuł', admin: { description: 'Mały napis nad nagłówkiem.' } },
    {
      name: 'headline',
      type: 'array',
      required: true,
      minRows: 1,
      label: 'Nagłówek',
      labels: { singular: 'Linia', plural: 'Linie' },
      admin: {
        description:
          'Każda linia pojawia się osobno w animacji, więc podział na linie jest treścią, a nie przypadkiem szerokości ekranu.',
      },
      fields: [
        {
          name: 'runs',
          type: 'array',
          required: true,
          minRows: 1,
          label: 'Fragmenty linii',
          labels: { singular: 'Fragment', plural: 'Fragmenty' },
          admin: { description: 'Jeden fragment, chyba że część linii ma być kursywą — wtedy rozbij ją na dwa lub trzy.' },
          fields: [
            { name: 'text', type: 'text', required: true, label: 'Tekst' },
            { name: 'emphasis', type: 'checkbox', label: 'Kursywa' },
          ],
        },
      ],
    },
    { name: 'lead', type: 'textarea', required: true, label: 'Wprowadzenie' },
    {
      name: 'actions',
      type: 'array',
      required: true,
      minRows: 1,
      label: 'Przyciski',
      labels: { singular: 'Przycisk', plural: 'Przyciski' },
      admin: { description: 'Pierwszy jest główny, pozostałe poboczne.' },
      fields: linkFields(),
    },
    {
      name: 'meta',
      type: 'array',
      required: true,
      minRows: 1,
      label: 'Krótkie fakty pod przyciskami',
      labels: { singular: 'Fakt', plural: 'Fakty' },
      fields: [{ name: 'text', type: 'text', required: true, label: 'Tekst' }],
    },
    {
      name: 'video',
      type: 'group',
      label: 'Materiał wideo',
      admin: { description: 'Ozdobny, wyciszony, nie niesie żadnej informacji. Nigdy nie blokuje pierwszego wyświetlenia strony.' },
      fields: [
        { name: 'file', type: 'upload', relationTo: 'media', label: 'Plik wideo' },
        {
          name: 'poster',
          type: 'upload',
          relationTo: 'media',
          label: 'Klatka zastępcza',
          admin: { description: 'Może być pusta — wtedy ramka wyświetli się bez klatki, zamiast wskazywać na brakujący plik.' },
        },
        { name: 'width', type: 'number', required: true, label: 'Szerokość w pikselach', admin: { step: 1 } },
        { name: 'height', type: 'number', required: true, label: 'Wysokość w pikselach', admin: { step: 1 } },
        {
          name: 'ariaLabel',
          type: 'text',
          required: true,
          label: 'Opis nagrania dla czytników ekranu',
        },
      ],
    },
    { name: 'badge', type: 'text', required: true, label: 'Podpis na ramce', admin: { description: 'Np. „Scena 2025”.' } },
  ],
}
