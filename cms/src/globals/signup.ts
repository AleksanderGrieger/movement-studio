import type { GlobalConfig } from 'payload'
import { editorsOnly, publicRead } from '../fields/access'

/**
 * Labels, validation messages and the three post-submit states.
 *
 * The messages are keyed by the RULE rather than by the field, so adding a
 * question to a form stays a content edit and never needs a new message.
 */
export const SignUpCopy: GlobalConfig = {
  slug: 'signup-copy',
  label: 'Teksty zapisów',
  access: { read: publicRead, update: editorsOnly },
  admin: { description: 'Wszystko, co w sekcji zapisów nie jest samym pytaniem.', group: 'Zapisy' },
  fields: [
    {
      type: 'collapsible',
      label: 'Opisy dla czytników ekranu',
      fields: [
        { name: 'locationToggleAriaLabel', type: 'text', required: true, label: 'Przełącznik lokalizacji' },
        { name: 'audienceToggleAriaLabel', type: 'text', required: true, label: 'Przełącznik grupy odbiorców' },
        { name: 'formAriaLabel', type: 'text', required: true, label: 'Sam formularz' },
      ],
    },
    {
      type: 'collapsible',
      label: 'Etykiety formularza',
      fields: [
        {
          name: 'unavailable',
          type: 'textarea',
          required: true,
          label: 'Komunikat, gdy dla wybranej pary nie ma formularza',
          admin: {
            description:
              'Dziś wypełnione są wszystkie cztery pary, więc tego komunikatu nikt nie zobaczy — pokaże się, gdy dojdzie trzecia lokalizacja albo gdy w sezonie otwarte będą tylko grupy dorosłych.',
          },
        },
        { name: 'requiredNote', type: 'text', required: true, label: 'Wyjaśnienie gwiazdki' },
        { name: 'optionalNote', type: 'text', required: true, label: 'Dopisek przy polu nieobowiązkowym' },
        { name: 'submitLabel', type: 'text', required: true, label: 'Napis na przycisku wysyłki' },
        { name: 'submittingLabel', type: 'text', required: true, label: 'Napis w trakcie wysyłania' },
        {
          name: 'errorSummaryTitle',
          type: 'text',
          required: true,
          label: 'Nagłówek podsumowania błędów',
          admin: { description: 'Na to miejsce przeskakuje fokus po nieudanej wysyłce.' },
        },
      ],
    },
    {
      name: 'success',
      type: 'group',
      label: 'Po udanej wysyłce',
      fields: [
        { name: 'title', type: 'text', required: true, label: 'Nagłówek' },
        { name: 'body', type: 'textarea', required: true, label: 'Tekst' },
        { name: 'againLabel', type: 'text', required: true, label: 'Napis na przycisku „wypełnij ponownie”' },
      ],
    },
    {
      name: 'failure',
      type: 'group',
      label: 'Po nieudanej wysyłce',
      fields: [
        { name: 'title', type: 'text', required: true, label: 'Nagłówek' },
        { name: 'body', type: 'textarea', required: true, label: 'Tekst' },
        { name: 'retryLabel', type: 'text', required: true, label: 'Napis na przycisku ponowienia' },
      ],
    },
    {
      name: 'errors',
      type: 'group',
      label: 'Komunikaty o błędach',
      admin: { description: 'Przypisane do reguły, nie do pola — dzięki temu nowe pytanie nie wymaga nowego komunikatu.' },
      fields: [
        { name: 'required', type: 'text', required: true, label: 'Pole wymagane' },
        { name: 'email', type: 'text', required: true, label: 'Niepoprawny e-mail' },
        { name: 'phone', type: 'text', required: true, label: 'Niepoprawny telefon' },
        { name: 'choice', type: 'text', required: true, label: 'Nie wybrano żadnej opcji' },
        { name: 'consent', type: 'text', required: true, label: 'Brak zgody' },
      ],
    },
  ],
}
