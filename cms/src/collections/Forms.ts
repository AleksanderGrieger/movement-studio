import type { Block, CollectionConfig, Field } from 'payload'
import { editorsOnly, publicRead } from '../fields/access'
import { orderField, slugField } from '../fields/common'

/**
 * The sign-up forms.
 *
 * The site reproduces the studio's Google Forms and posts to their
 * endpoints, which is why the shape leans on Google's. `entryId` is the wire
 * name Google assigns a question; it is the one value in this collection that
 * is neither copy nor structure, and it is stored because there is nothing to
 * derive it from.
 *
 * Google accepts a POST it cannot match and then silently drops it — no
 * error, no status the site could read. So a typo in an entry id or an option
 * text is a sign-up that vanishes. `npm run check:forms` on the site compares
 * every field here against the live form; run it after anyone edits a form in
 * Google.
 *
 * The four forms are deliberately NOT one definition with a varying class
 * list. They are four documents the studio owns, and an editor changing
 * Kołobrzeg's classes must not silently change Białogard's.
 */

const entryIdField: Field = {
  name: 'entryId',
  type: 'text',
  required: true,
  label: 'Identyfikator pola w Google (entry)',
  admin: {
    description:
      'Dokładnie tak, jak w formularzu Google, np. entry.2005620554. Błąd tutaj oznacza zapis, który Google po cichu odrzuci.',
    placeholder: 'entry.2005620554',
  },
  validate: (value: string | null | undefined) =>
    (typeof value === 'string' && /^entry\.\d+$/.test(value)) ||
    'Identyfikator musi mieć postać entry.123456789.',
}

const requiredField: Field = {
  name: 'required',
  type: 'checkbox',
  label: 'Pole wymagane',
  admin: { description: 'Musi zgadzać się z ustawieniem w formularzu Google.' },
}

const textField: Block = {
  slug: 'textField',
  labels: { singular: 'Pole tekstowe', plural: 'Pola tekstowe' },
  fields: [
    slugField('Unikalny w obrębie formularza.'),
    entryIdField,
    {
      name: 'kind',
      type: 'select',
      required: true,
      defaultValue: 'text',
      label: 'Rodzaj',
      admin: { description: 'Decyduje o klawiaturze na telefonie i o sprawdzaniu poprawności.' },
      options: [
        { label: 'Tekst', value: 'text' },
        { label: 'E-mail', value: 'email' },
        { label: 'Telefon', value: 'tel' },
      ],
    },
    { name: 'label', type: 'text', required: true, label: 'Etykieta' },
    {
      name: 'autoComplete',
      type: 'text',
      label: 'Autouzupełnianie',
      admin: {
        description:
          'Token HTML, np. name, email, tel. Zostaw PUSTE, jeśli pole nie dotyczy osoby wypełniającej — formularze dziecięce pytają o imię dziecka, a podpowiadanie tam danych rodzica byłoby błędem, nie udogodnieniem.',
      },
    },
    requiredField,
  ],
}

const choiceField: Block = {
  slug: 'choiceField',
  labels: { singular: 'Pole wyboru', plural: 'Pola wyboru' },
  fields: [
    slugField('Unikalny w obrębie formularza.'),
    entryIdField,
    { name: 'label', type: 'text', required: true, label: 'Etykieta' },
    {
      name: 'options',
      type: 'array',
      required: true,
      minRows: 1,
      label: 'Opcje',
      labels: { singular: 'Opcja', plural: 'Opcje' },
      admin: {
        description:
          'Kolejność na liście = kolejność na stronie. Wartość musi być identyczna jak w Google, co do znaku.',
      },
      fields: [
        {
          name: 'value',
          type: 'text',
          required: true,
          label: 'Wartość wysyłana do Google',
          admin: { description: 'Skopiuj dokładnie tekst opcji z formularza Google.' },
        },
        { name: 'label', type: 'text', required: true, label: 'Napis na stronie' },
      ],
    },
    requiredField,
  ],
}

const consentField: Block = {
  slug: 'consentField',
  labels: { singular: 'Zgoda (RODO)', plural: 'Zgody (RODO)' },
  fields: [
    slugField('Unikalny w obrębie formularza.'),
    entryIdField,
    {
      name: 'label',
      type: 'text',
      required: true,
      label: 'Napis przy polu wyboru',
      admin: { description: 'Np. „Akceptuję”.' },
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      label: 'Treść klauzuli',
      admin: { description: 'Pełna klauzula, wyświetlana nad polem wyboru.' },
    },
    {
      name: 'value',
      type: 'text',
      required: true,
      label: 'Wartość wysyłana do Google',
      admin: { description: 'Tekst opcji z formularza Google, co do znaku.' },
    },
    requiredField,
  ],
}

export const Forms: CollectionConfig = {
  slug: 'forms',
  labels: { singular: 'Formularz zapisów', plural: 'Formularze zapisów' },
  access: { read: publicRead, create: editorsOnly, update: editorsOnly, delete: editorsOnly },
  admin: {
    useAsTitle: 'slug',
    defaultColumns: ['slug', 'location', 'audience', 'order'],
    description:
      'Po jednym formularzu na każdą parę lokalizacja + grupa odbiorców. Brakująca para to kombinacja, którą odwiedzający może kliknąć — zobaczy wtedy komunikat z sekcji „Teksty zapisów”.',
    group: 'Zapisy',
  },
  fields: [
    slugField('Przyjęty wzór: lokalizacja-grupa, np. bialogard-dorosli.'),
    { name: 'location', type: 'relationship', relationTo: 'locations', required: true, label: 'Lokalizacja' },
    { name: 'audience', type: 'relationship', relationTo: 'audiences', required: true, label: 'Grupa odbiorców' },
    {
      name: 'formId',
      type: 'text',
      required: true,
      label: 'Identyfikator formularza Google',
      admin: {
        description:
          'Część z publicznego adresu: /forms/d/e/TEN-FRAGMENT/viewform. Adres wysyłki wyprowadzany jest z niego, więc nie mogą się rozjechać.',
      },
    },
    {
      name: 'fields',
      type: 'blocks',
      required: true,
      minRows: 1,
      label: 'Pytania',
      labels: { singular: 'Pytanie', plural: 'Pytania' },
      admin: { description: 'Kolejność na liście = kolejność na stronie.' },
      blocks: [textField, choiceField, consentField],
    },
    orderField('Kolejność formularzy. Na stronie i tak wybiera je przełącznik.'),
  ],
}
