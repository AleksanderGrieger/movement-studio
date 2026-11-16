import type { CollectionConfig } from 'payload'
import { editorsOnly, publicRead } from '../fields/access'
import { nestedSlugField, orderField, slugField } from '../fields/common'

/**
 * The pricelist, three blocks per location.
 *
 * Prices are numeric so they stay sortable and can be validated. Note that
 * the "już od 140 zł" in the facts strip is NOT computed from these rows:
 * the cheapest row is a twice-monthly add-on, so the minimum would both
 * contradict approved copy and misrepresent the offer. That value is
 * authored, on the Facts global.
 */
export const PriceBlocks: CollectionConfig = {
  slug: 'price-blocks',
  labels: { singular: 'Blok cennika', plural: 'Cennik' },
  access: { read: publicRead, create: editorsOnly, update: editorsOnly, delete: editorsOnly },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'location', 'order'],
    description: 'Sekcja „Cennik”. Każda lokalizacja ma własne bloki.',
    group: 'Treść',
  },
  fields: [
    slugField('Unikalny w całym cenniku.'),
    { name: 'location', type: 'relationship', relationTo: 'locations', required: true, label: 'Lokalizacja' },
    { name: 'title', type: 'text', required: true, label: 'Nazwa bloku', admin: { description: 'Np. „Dorośli”.' } },
    {
      name: 'rows',
      type: 'array',
      required: true,
      minRows: 1,
      label: 'Pozycje',
      labels: { singular: 'Pozycja', plural: 'Pozycje' },
      admin: { description: 'Kolejność na liście = kolejność w cenniku.' },
      fields: [
        nestedSlugField('Unikalny w obrębie bloku.'),
        {
          name: 'name',
          type: 'text',
          required: true,
          label: 'Nazwa',
          admin: { description: 'Sama nazwa, bez częstotliwości — od tego jest osobne pole.' },
        },
        {
          name: 'cadence',
          type: 'text',
          label: 'Częstotliwość',
          admin: { description: 'Np. „1× 45 min w tygodniu”. Wyświetla się mniejszą czcionką pod nazwą.' },
        },
        {
          name: 'price',
          type: 'number',
          required: true,
          min: 0,
          label: 'Cena',
          admin: { description: 'Pełne złote, samą liczbą — bez „zł”.', step: 1 },
        },
        {
          name: 'currency',
          type: 'select',
          required: true,
          defaultValue: 'PLN',
          label: 'Waluta',
          options: [{ label: 'złoty (PLN)', value: 'PLN' }],
        },
      ],
    },
    orderField('Kolejność bloków w cenniku.'),
  ],
}
