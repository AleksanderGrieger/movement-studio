import type { GlobalConfig } from 'payload'
import { editorsOnly, publicRead } from '../fields/access'

/**
 * The numbered heading block that opens each section.
 *
 * `id` is a closed list, unlike every other identifier in this CMS: the
 * anchors are the page's information architecture, not content, and each one
 * is what a section is named by for assistive technology. A section with no
 * intro has no accessible name, so the site's build fails rather than
 * shipping one — which is why these cannot be added or removed here.
 */
export const SectionIntros: GlobalConfig = {
  slug: 'section-intros',
  label: 'Nagłówki sekcji',
  access: { read: publicRead, update: editorsOnly },
  admin: {
    description:
      'Po jednym na każdą sekcję strony głównej. Usunięcie któregokolwiek zatrzyma budowanie strony — sekcja bez nagłówka nie ma nazwy, pod którą mógłby ją ogłosić czytnik ekranu.',
    group: 'Strona',
  },
  fields: [
    {
      name: 'sections',
      type: 'array',
      required: true,
      minRows: 1,
      label: 'Sekcje',
      labels: { singular: 'Sekcja', plural: 'Sekcje' },
      fields: [
        {
          /* Not `id`: an array row already has one, and Payload stores it as
             an integer. The site's SectionIntro.id is rebuilt from this. */
          name: 'sectionId',
          type: 'select',
          required: true,
          label: 'Sekcja',
          admin: { description: 'Lista jest zamknięta — to struktura strony, nie treść.' },
          options: [
            { label: 'Oferta (#offer)', value: 'offer' },
            { label: 'Grafik (#schedule)', value: 'schedule' },
            { label: 'Cennik (#pricelist)', value: 'pricelist' },
            { label: 'O nas (#about-us)', value: 'about-us' },
            { label: 'FAQ (#faq)', value: 'faq' },
            { label: 'Kontakt (#contact)', value: 'contact' },
            { label: 'Zapisy (#signup)', value: 'signup' },
          ],
        },
        {
          name: 'number',
          type: 'text',
          required: true,
          label: 'Numer',
          admin: { description: '„01”, „02”… Wpisywany, a nie liczony, żeby zmiana kolejności była edycją treści.' },
        },
        { name: 'eyebrow', type: 'text', required: true, label: 'Nadtytuł', admin: { description: 'Np. „Oferta”. To samo słowo co w menu.' } },
        { name: 'title', type: 'text', required: true, label: 'Nagłówek' },
        { name: 'intro', type: 'textarea', label: 'Wprowadzenie', admin: { description: 'Opcjonalne.' } },
      ],
    },
  ],
}

/** The founders' statement above the crew grid. */
export const FoundersIntro: GlobalConfig = {
  slug: 'founders-intro',
  label: 'Słowo założycielek',
  access: { read: publicRead, update: editorsOnly },
  admin: { description: 'Otwiera sekcję „O nas”, nad kartami kadry.', group: 'Treść' },
  fields: [
    {
      name: 'statement',
      type: 'textarea',
      required: true,
      label: 'Zdanie główne',
      admin: { description: 'Składane większym, ozdobnym krojem — trzymaj krótko.' },
    },
    { name: 'body', type: 'textarea', required: true, label: 'Tekst' },
  ],
}
