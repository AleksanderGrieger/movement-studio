import type { CollectionConfig } from 'payload'
import { editorsOnly, publicRead } from '../fields/access'
import { linkField, orderField, paragraphsField, slugField } from '../fields/common'

/**
 * The questions in #faq.
 *
 * Order is editorial, not alphabetical: the list walks a first visit, and the
 * section opens whichever question sorts first — so `order` decides what a
 * visitor reads without clicking anything.
 *
 * An answer that needs to send the reader somewhere carries a link after the
 * prose rather than an anchor buried inside it, which keeps HTML out of the
 * data and keeps the destination visible to someone scanning.
 */
export const FaqItems: CollectionConfig = {
  slug: 'faq-items',
  labels: { singular: 'Pytanie', plural: 'Najczęstsze pytania' },
  access: { read: publicRead, create: editorsOnly, update: editorsOnly, delete: editorsOnly },
  admin: {
    useAsTitle: 'question',
    defaultColumns: ['question', 'slug', 'order'],
    description: 'Sekcja „FAQ”. Pierwsze pytanie w kolejności otwiera się samo — ustaw tam to, co czyta się najpierw.',
    group: 'Treść',
  },
  fields: [
    slugField('Unikalny w całej sekcji.'),
    { name: 'question', type: 'text', required: true, label: 'Pytanie' },
    paragraphsField('answer', 'Odpowiedź', 'Każdy akapit osobno. Co najmniej jeden.'),
    linkField('link', 'Odnośnik pod odpowiedzią', {
      required: false,
      description:
        'Opcjonalny. Wyświetla się po tekście odpowiedzi. Kotwica musi wskazywać istniejącą sekcję strony głównej — np. #pricelist.',
    }),
    orderField('Kolejność pytań. Pierwsze jest otwarte przy wejściu.'),
  ],
}
