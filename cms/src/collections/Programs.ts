import type { CollectionConfig } from 'payload'
import { editorsOnly, publicRead } from '../fields/access'
import { orderField, paragraphsField, slugField, timeField } from '../fields/common'

/** Grant-funded programmes. Backs the /programs route. */
export const Programs: CollectionConfig = {
  slug: 'programs',
  labels: { singular: 'Projekt', plural: 'Projekty' },
  access: { read: publicRead, create: editorsOnly, update: editorsOnly, delete: editorsOnly },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'programme', 'order'],
    description: 'Strona /programs — projekty dofinansowane.',
    group: 'Treść',
  },
  fields: [
    slugField('Używany w odnośnikach do projektu.'),
    { name: 'title', type: 'text', required: true, label: 'Nazwa projektu' },
    {
      name: 'programme',
      type: 'text',
      required: true,
      label: 'Program finansujący',
      admin: { description: 'Np. „NOWEFIO 2021–2030”.' },
    },
    { name: 'summary', type: 'textarea', required: true, label: 'Zajawka', admin: { description: 'Jedno zdanie pod nazwą.' } },
    paragraphsField('body', 'Opis', 'Każdy akapit osobno.'),
    {
      name: 'posters',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      required: true,
      label: 'Plakaty',
    },
    {
      name: 'sessions',
      type: 'array',
      required: true,
      minRows: 1,
      label: 'Terminy',
      labels: { singular: 'Termin', plural: 'Terminy' },
      fields: [
        slugField('Unikalny w obrębie projektu.'),
        {
          name: 'dates',
          type: 'text',
          required: true,
          label: 'Daty',
          admin: { description: 'Tak, jak mają się wyświetlić, np. „27–29.08.2025 — środa–piątek”.' },
        },
        {
          name: 'rows',
          type: 'array',
          required: true,
          minRows: 1,
          label: 'Zajęcia w terminie',
          labels: { singular: 'Pozycja', plural: 'Pozycje' },
          fields: [
            timeField('start', 'Godzina rozpoczęcia', { required: true }),
            timeField('end', 'Godzina zakończenia'),
            { name: 'name', type: 'text', required: true, label: 'Nazwa' },
          ],
        },
      ],
    },
    {
      name: 'venue',
      type: 'textarea',
      required: true,
      label: 'Miejsce',
      admin: { description: 'Prozą — każdy projekt opisuje to inaczej.' },
    },
    orderField('Kolejność projektów na stronie /programs.'),
  ],
}
