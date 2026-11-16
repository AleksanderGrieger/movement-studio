import type { CollectionConfig } from 'payload'
import { editorsOnly, publicRead } from '../fields/access'
import { orderField, slugField } from '../fields/common'

/**
 * The filter chips above the schedule.
 *
 * A collection, not an enum: labels are a relation on the class record, and
 * the current four-label taxonomy is still unconfirmed with the studio
 * (§11.3). An editor must be able to add a fifth without a code change.
 *
 * `colorToken` is the one presentation value anywhere in the content layer.
 * It holds the NAME of a CSS custom property, never a colour — the site
 * defines what `--label-kids` looks like in each theme, and both themes are
 * contrast-checked. A select rather than free text, because a typo here is a
 * label that renders with no colour at all.
 */
export const ScheduleLabels: CollectionConfig = {
  slug: 'schedule-labels',
  labels: { singular: 'Etykieta grafiku', plural: 'Etykiety grafiku' },
  access: { read: publicRead, create: editorsOnly, update: editorsOnly, delete: editorsOnly },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'tag', 'colorToken', 'order'],
    description: 'Filtry nad grafikiem. Każde zajęcia mają co najmniej jedną etykietę.',
    group: 'Grafik',
  },
  fields: [
    slugField('Używany przez zajęcia i przez przyciski „Zobacz terminy” w ofercie.'),
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Nazwa na filtrze',
      admin: { description: 'Napis na przycisku filtra, np. „Gr. sportowa”.' },
    },
    {
      name: 'tag',
      type: 'text',
      required: true,
      label: 'Nazwa przy zajęciach',
      admin: {
        description:
          'Słowo drukowane przy wierszu zajęć, np. „gr. sportowa”. Istnieje po to, żeby kolor nigdy nie był jedynym nośnikiem informacji.',
      },
    },
    {
      name: 'colorToken',
      type: 'select',
      required: true,
      label: 'Kolor',
      admin: {
        description:
          'Kolory są zdefiniowane w motywie strony i sprawdzone pod kątem kontrastu w obu wersjach — jasnej i ciemnej. Wybierasz który, nie jaki.',
      },
      options: [
        { label: 'Dorośli (różowy / ceglany)', value: '--label-adults' },
        { label: 'Dzieci (pomarańczowy / zielony)', value: '--label-kids' },
        { label: 'Nabór (miętowy / rdzawy)', value: '--label-intake' },
        { label: 'Grupa sportowa (piaskowy / złoty)', value: '--label-sport' },
      ],
    },
    orderField('Kolejność filtrów nad grafikiem.'),
  ],
}
