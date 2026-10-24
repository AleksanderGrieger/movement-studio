import type { CheckboxField, Field, NumberField, TextField } from 'payload'

/**
 * Shared field shapes.
 *
 * Every label and description here is Polish, because the editors are the
 * studio. Where a field encodes a rule the contract depends on — a slug that
 * must outlive copy edits, an aria-label that must not be used as a label —
 * the description says so in the admin UI, which is the only place an editor
 * will ever read it.
 */

/** A stable identifier. Slugs are referenced by other records; copy is not. */
export const slugField = (description: string): TextField => ({
  name: 'slug',
  type: 'text',
  required: true,
  unique: true,
  index: true,
  label: 'Identyfikator (slug)',
  admin: {
    description: `${description} Nie zmieniaj go po publikacji — inne rekordy i linki opierają się na nim. Małe litery, bez polskich znaków, myślniki zamiast spacji.`,
  },
})

/**
 * A slug on a nested row.
 *
 * Same idea as slugField, without the unique index: uniqueness here is
 * within the parent document, not across the table. The four sign-up forms
 * ask the same five questions and their fields carry the same slugs by
 * design — they are four separate documents, not one shared definition.
 */
export const nestedSlugField = (description: string): TextField => ({
  name: 'slug',
  type: 'text',
  required: true,
  label: 'Identyfikator (slug)',
  admin: {
    description: `${description} Nie zmieniaj go po publikacji. Małe litery, bez polskich znaków, myślniki zamiast spacji.`,
  },
})

/** Presentation order. Lower numbers come first. */
export const orderField = (description = 'Kolejność wyświetlania.'): NumberField => ({
  name: 'order',
  type: 'number',
  required: true,
  defaultValue: 0,
  label: 'Kolejność',
  admin: {
    description: `${description} Mniejsza liczba = wyżej na stronie.`,
    step: 1,
  },
})

/**
 * A link, with both ways of clarifying its accessible name.
 *
 * The two are not interchangeable and mixing them up is a real accessibility
 * defect (WCAG 2.5.3 Label in Name), so the distinction is spelled out on the
 * fields themselves rather than left in a document nobody opens.
 */
export const linkFields = (options: { required?: boolean } = {}): Field[] => [
  {
    name: 'label',
    type: 'text',
    required: options.required ?? true,
    label: 'Widoczny tekst',
    admin: { description: 'To, co widzi odwiedzający.' },
  },
  {
    name: 'href',
    type: 'text',
    required: options.required ?? true,
    label: 'Adres',
    admin: {
      description:
        'Kotwica na stronie głównej (np. #schedule), ścieżka (np. /programs/) albo pełny adres (https://…, tel:…, mailto:…).',
    },
  },
  {
    name: 'ariaLabel',
    type: 'text',
    label: 'Nazwa dla czytników ekranu (zastępuje tekst)',
    admin: {
      description:
        'ZASTĘPUJE widoczny tekst. Wypełnij TYLKO wtedy, gdy link nie ma własnego tekstu — np. opakowuje sam obrazek. Użycie tego pola przy linku z tekstem łamie WCAG 2.5.3: nazwa dostępna musi zawierać to, co widać.',
    },
  },
  {
    name: 'context',
    type: 'text',
    label: 'Doprecyzowanie (dodawane po tekście)',
    admin: {
      description:
        'DODAWANE po widocznym tekście, niewidoczne na ekranie. Tego pola używaj, gdy tekst jest widoczny, ale sam z siebie za mało mówi — np. „Movement Studio” z doprecyzowaniem „Facebook”.',
    },
  },
  {
    name: 'external',
    type: 'checkbox',
    label: 'Otwiera się w nowej karcie',
    admin: { description: 'Dodaje target="_blank" i rel="noopener".' },
  },
]

/** The same fields wrapped in a named group, for a single link on a document. */
export const linkField = (
  name: string,
  label: string,
  options: { required?: boolean; description?: string } = {},
): Field => ({
  name,
  type: 'group',
  label,
  admin: options.description ? { description: options.description } : undefined,
  fields: linkFields(options),
})

/**
 * Body copy as separate paragraphs.
 *
 * An array rather than one long field with markup: rule 1 of the content
 * contract keeps HTML out of the data, so a paragraph break is a record, not
 * a tag.
 */
export const paragraphsField = (
  name: string,
  label: string,
  description: string,
  options: { required?: boolean } = {},
): Field => ({
  name,
  type: 'array',
  label,
  required: options.required ?? true,
  minRows: options.required === false ? 0 : 1,
  labels: { singular: 'Akapit', plural: 'Akapity' },
  admin: { description, initCollapsed: false },
  fields: [
    {
      name: 'text',
      type: 'textarea',
      required: true,
      label: 'Tekst akapitu',
    },
  ],
})

/** A run of text, so one word can be italic without HTML in the data. */
export const textRunsField = (name: string, label: string, description: string): Field => ({
  name,
  type: 'array',
  label,
  required: true,
  minRows: 1,
  labels: { singular: 'Fragment', plural: 'Fragmenty' },
  admin: { description },
  fields: [
    { name: 'text', type: 'text', required: true, label: 'Tekst' },
    {
      name: 'emphasis',
      type: 'checkbox',
      label: 'Wyróżnienie (kursywa)',
    },
  ],
})

/** "HH:MM", the format <time datetime> needs. */
export const timeField = (
  name: string,
  label: string,
  options: { required?: boolean; description?: string } = {},
): TextField => ({
  name,
  type: 'text',
  required: options.required ?? false,
  label,
  admin: {
    description: options.description ?? 'Format 24-godzinny, np. 18:30.',
    placeholder: '18:30',
  },
  validate: (value: string | null | undefined) => {
    if (!value) return options.required ? 'Podaj godzinę.' : true
    return /^([01]\d|2[0-3]):[0-5]\d$/.test(value) || 'Godzina musi mieć format HH:MM, np. 18:30.'
  },
})

/** Exactly one record carries the flag. */
export const defaultFlagField = (description: string): CheckboxField => ({
  name: 'isDefault',
  type: 'checkbox',
  label: 'Domyślna',
  admin: { description },
})
