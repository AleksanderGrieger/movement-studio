import type { CollectionConfig } from 'payload'
import { editorsOnly, publicRead } from '../fields/access'
import { orderField, slugField } from '../fields/common'

/**
 * The crew.
 *
 * The count is not fixed — the grid holds anywhere from one to ten cards
 * without a layout change.
 */
export const Instructors: CollectionConfig = {
  slug: 'instructors',
  labels: { singular: 'Instruktor', plural: 'Kadra' },
  access: { read: publicRead, create: editorsOnly, update: editorsOnly, delete: editorsOnly },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'role', 'order'],
    description: 'Sekcja „O nas”.',
    group: 'Treść',
  },
  fields: [
    slugField('Używany w odnośnikach do karty.'),
    { name: 'name', type: 'text', required: true, label: 'Imię i nazwisko' },
    {
      name: 'role',
      type: 'text',
      required: true,
      label: 'Specjalizacja',
      admin: { description: 'Jedna linijka, np. „Taniec współczesny · Power Dance”.' },
    },
    {
      name: 'bio',
      type: 'textarea',
      required: true,
      label: 'Opis',
      admin: { description: 'Około dwóch zdań — tyle mieści zatwierdzona karta.' },
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Zdjęcie',
    },
    orderField('Kolejność kart w sekcji „O nas”.'),
  ],
}
