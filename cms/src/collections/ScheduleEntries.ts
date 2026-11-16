import type { CollectionConfig } from 'payload'
import { editorsOnly, publicRead } from '../fields/access'
import { slugField, timeField } from '../fields/common'

/**
 * One class occurrence. Flat — one row per class, never a day column.
 *
 * The day grid the site renders is derived from these rows at build time, so
 * moving a class to another day is one field here rather than a cut and
 * paste between columns.
 */
export const ScheduleEntries: CollectionConfig = {
  slug: 'schedule-entries',
  labels: { singular: 'Zajęcia w grafiku', plural: 'Grafik zajęć' },
  access: { read: publicRead, create: editorsOnly, update: editorsOnly, delete: editorsOnly },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'location', 'day', 'start', 'labels'],
    description: 'Jeden wiersz = jedne zajęcia. Kolumny dni na stronie układają się z tego automatycznie.',
    group: 'Grafik',
  },
  fields: [
    slugField('Musi być unikalny w całym grafiku. Przyjęty wzór: lokalizacja-dzień-godzina-nazwa.'),
    {
      name: 'location',
      type: 'relationship',
      relationTo: 'locations',
      required: true,
      label: 'Lokalizacja',
    },
    {
      name: 'day',
      type: 'relationship',
      relationTo: 'weekdays',
      required: true,
      label: 'Dzień',
    },
    timeField('start', 'Godzina rozpoczęcia', { required: true }),
    timeField('end', 'Godzina zakończenia', {
      description: 'Zostaw puste, jeśli studio nie podaje godziny końca tych zajęć.',
    }),
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Nazwa zajęć',
      admin: { description: 'Np. „Latino solo kids”. Bez dopisków o częstotliwości — od tego jest pole niżej.' },
    },
    {
      name: 'labels',
      type: 'relationship',
      relationTo: 'schedule-labels',
      hasMany: true,
      required: true,
      label: 'Etykiety',
      admin: {
        description: 'Co najmniej jedna. Zajęcia bez etykiety zniknęłyby z każdego filtra.',
      },
      validate: (value: unknown) =>
        (Array.isArray(value) && value.length > 0) || 'Wybierz co najmniej jedną etykietę.',
    },
    {
      name: 'note',
      type: 'text',
      label: 'Dopisek',
      admin: {
        description:
          'Np. „2× w miesiącu” albo „12+ lat”. Trzymany osobno od nazwy, żeby filtr dopasowywał zajęcia, a nie częstotliwość.',
      },
    },
  ],
}
