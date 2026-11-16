import type { CollectionConfig } from 'payload'
import { editorsOnly, publicRead } from '../fields/access'
import { defaultFlagField, orderField, slugField } from '../fields/common'

/**
 * The two studios.
 *
 * A first-class entity rather than a field repeated on three other types:
 * one location state drives the schedule, the pricelist and the contact
 * section at once, so every one of them reads from here.
 */
export const Locations: CollectionConfig = {
  slug: 'locations',
  labels: { singular: 'Lokalizacja', plural: 'Lokalizacje' },
  access: { read: publicRead, create: editorsOnly, update: editorsOnly, delete: editorsOnly },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'order', 'isDefault'],
    description: 'Miejsca, w których odbywają się zajęcia. Przełącznik na stronie pokazuje je w tej kolejności.',
    group: 'Treść',
  },
  hooks: {
    /**
     * Exactly one location is the default. Setting the flag here clears it
     * everywhere else, so the rule holds without asking an editor to
     * remember it.
     */
    afterChange: [
      async ({ doc, req, operation }) => {
        if (!doc.isDefault || operation === 'delete') return
        const others = await req.payload.find({
          collection: 'locations',
          where: { and: [{ isDefault: { equals: true } }, { id: { not_equals: doc.id } }] },
          limit: 100,
          req,
        })
        for (const other of others.docs) {
          await req.payload.update({
            collection: 'locations',
            id: other.id,
            data: { isDefault: false },
            req,
            context: { skipDefaultSync: true },
          })
        }
      },
    ],
  },
  fields: [
    slugField('Używany w adresach i w powiązaniach z grafikiem oraz cennikiem.'),
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Nazwa',
      admin: { description: 'Napis na przycisku przełącznika, np. „Białogard”.' },
    },
    {
      name: 'address',
      type: 'array',
      required: true,
      minRows: 1,
      label: 'Adres',
      labels: { singular: 'Wiersz adresu', plural: 'Wiersze adresu' },
      admin: { description: 'Każdy wiersz osobno, tak jak ma się wyświetlić.' },
      fields: [{ name: 'line', type: 'text', required: true, label: 'Wiersz' }],
    },
    {
      name: 'hours',
      type: 'array',
      required: true,
      minRows: 1,
      label: 'Godziny otwarcia biura',
      labels: { singular: 'Wiersz', plural: 'Wiersze' },
      admin: {
        description:
          'Pary „nazwa — wartość”, np. „Poniedziałek–Czwartek” / „16:00–21:00”. Celowo nie są to ustrukturyzowane godziny: publikowane godziny biura przeczą grafikowi zajęć i czekają na odpowiedź klienta (§11.2), a pary pozwalają wpisać tę odpowiedź bez zmiany struktury.',
      },
      fields: [
        { name: 'term', type: 'text', required: true, label: 'Nazwa' },
        { name: 'value', type: 'text', required: true, label: 'Wartość' },
      ],
    },
    {
      name: 'map',
      type: 'group',
      label: 'Mapa',
      admin: {
        description: 'Zostaw adres pusty, żeby sekcja wyświetliła się bez mapy — bez żadnej ramki zastępczej.',
      },
      fields: [
        {
          name: 'src',
          type: 'textarea',
          label: 'Adres osadzenia (embed)',
          admin: { description: 'Z Google Maps → Udostępnij → Umieść mapę → skopiuj wartość src.' },
        },
        {
          name: 'title',
          type: 'text',
          label: 'Nazwa mapy dla czytników ekranu',
          admin: { description: 'Np. „Mapa — Movement Studio Białogard”. Wymagana, jeśli mapa jest ustawiona.' },
        },
      ],
    },
    orderField('Kolejność na przełączniku lokalizacji.'),
    defaultFlagField(
      'Lokalizacja wybrana przy wejściu na stronę. Zaznaczenie tutaj odznacza ją w pozostałych.',
    ),
  ],
}
