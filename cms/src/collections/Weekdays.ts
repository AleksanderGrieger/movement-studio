import type { CollectionConfig } from 'payload'
import { editorsOnly, publicRead } from '../fields/access'
import { orderField, slugField } from '../fields/common'

/**
 * The seven days.
 *
 * All seven exist even though three currently carry no classes: the grid
 * omits empty days at render time, so a day with nothing in it is not a
 * missing record.
 */
export const Weekdays: CollectionConfig = {
  slug: 'weekdays',
  labels: { singular: 'Dzień tygodnia', plural: 'Dni tygodnia' },
  access: { read: publicRead, create: editorsOnly, update: editorsOnly, delete: editorsOnly },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'order'],
    description: 'Dni, w kolumnach których układa się grafik. Dni bez zajęć nie są pokazywane na stronie.',
    group: 'Grafik',
  },
  fields: [
    slugField('Używany przez zajęcia.'),
    { name: 'name', type: 'text', required: true, label: 'Nazwa', admin: { description: 'Np. „Poniedziałek”.' } },
    orderField('Poniedziałek = 1, zgodnie z ISO-8601.'),
  ],
}
