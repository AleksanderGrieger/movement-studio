import type { CollectionConfig } from 'payload'
import { editorsOnly, publicRead } from '../fields/access'
import { nestedSlugField, orderField, slugField } from '../fields/common'

/**
 * The offer, grouped by audience.
 *
 * The four groups are the studio's eight source entries regrouped
 * editorially, so the grouping is stored rather than derived. Item numbers
 * (01–20 in the design) are NOT stored — they come from the position in the
 * flattened list at render time, so reordering stays a content edit.
 *
 * Items are an array rather than their own collection on purpose: nothing
 * references an offer item, and it has no meaning outside its group's order.
 * A collection would buy cross-group dragging at the price of a join and the
 * possibility of an orphan.
 */
export const OfferGroups: CollectionConfig = {
  slug: 'offer-groups',
  labels: { singular: 'Grupa oferty', plural: 'Oferta' },
  access: { read: publicRead, create: editorsOnly, update: editorsOnly, delete: editorsOnly },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'order'],
    description: 'Sekcja „Oferta”. Numery 01, 02… nadaje strona — nie wpisuje się ich tutaj.',
    group: 'Treść',
  },
  fields: [
    slugField('Używany w odnośnikach do grupy.'),
    { name: 'title', type: 'text', required: true, label: 'Nazwa grupy', admin: { description: 'Np. „Dla dorosłych”.' } },
    {
      name: 'items',
      type: 'array',
      required: true,
      minRows: 1,
      label: 'Zajęcia w grupie',
      labels: { singular: 'Pozycja', plural: 'Pozycje' },
      admin: { description: 'Kolejność na liście = kolejność na stronie. Przeciągnij, żeby zmienić.' },
      fields: [
        nestedSlugField('Unikalny w obrębie grupy.'),
        { name: 'title', type: 'text', required: true, label: 'Nazwa', admin: { description: 'Np. „Latino Solo”.' } },
        { name: 'body', type: 'textarea', required: true, label: 'Opis' },
      ],
    },
    {
      name: 'scheduleFilter',
      type: 'relationship',
      relationTo: 'schedule-labels',
      label: 'Przycisk „Zobacz terminy” — etykieta grafiku',
      admin: {
        description:
          'Wybierz etykietę, a pod grupą pojawi się przycisk prowadzący do grafiku odfiltrowanego do tej etykiety. Zostaw puste, jeśli grupa nie ma odpowiednika w grafiku — tak jest dziś z „Dla par” i „Na zamówienie”.',
      },
    },
    {
      name: 'scheduleFilterLabel',
      type: 'text',
      label: 'Napis na przycisku',
      admin: {
        description: 'Np. „Zobacz terminy zajęć dla dorosłych”. Wymagany, jeśli wybrano etykietę powyżej.',
        condition: (_, siblingData) => Boolean(siblingData?.scheduleFilter),
      },
      validate: (value: string | null | undefined, { siblingData }: { siblingData: Record<string, unknown> }) => {
        const hasFilter = Boolean(siblingData?.scheduleFilter)
        if (hasFilter && !value) return 'Podaj napis na przycisku albo usuń wybraną etykietę.'
        if (!hasFilter && value) return 'Napis bez wybranej etykiety nigdzie się nie pokaże.'
        return true
      },
    },
    orderField('Kolejność grup w sekcji „Oferta”.'),
  ],
}
