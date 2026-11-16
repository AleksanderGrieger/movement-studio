import type { CollectionConfig } from 'payload'
import { editorsOnly, publicRead } from '../fields/access'
import { orderField, slugField } from '../fields/common'

/**
 * Which audience a sign-up form is for.
 *
 * A collection rather than a list on a global, because the Forms collection
 * points at it with a relationship — the same reason weekdays are a
 * collection despite there being exactly seven of them. The content handoff
 * filed this under globals; a global cannot be the target of a relationship,
 * and the content check enforces that every form resolves to a real
 * audience.
 */
export const Audiences: CollectionConfig = {
  slug: 'audiences',
  labels: { singular: 'Grupa odbiorców', plural: 'Grupy odbiorców' },
  access: { read: publicRead, create: editorsOnly, update: editorsOnly, delete: editorsOnly },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'order'],
    description: 'Drugi przełącznik w sekcji zapisów — obok lokalizacji.',
    group: 'Zapisy',
  },
  fields: [
    slugField('Używany przez formularze zapisów.'),
    { name: 'name', type: 'text', required: true, label: 'Nazwa', admin: { description: 'Napis na przycisku, np. „Dorośli”.' } },
    orderField('Kolejność na przełączniku.'),
  ],
}
