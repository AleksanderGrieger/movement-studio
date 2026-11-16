import type { CollectionConfig } from 'payload'

/** Admin accounts. `auth.useAPIKey` leaves room to lock the read API down. */
export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: 'Użytkownik', plural: 'Użytkownicy' },
  admin: { useAsTitle: 'email', group: 'Ustawienia' },
  auth: { useAPIKey: true },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Imię',
    },
  ],
}
