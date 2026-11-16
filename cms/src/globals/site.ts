import type { GlobalConfig } from 'payload'
import { editorsOnly, publicRead } from '../fields/access'
import { linkFields, textRunsField } from '../fields/common'

const access = { read: publicRead, update: editorsOnly }

/** Document title and meta description — what search results and share cards show. */
export const SiteMeta: GlobalConfig = {
  slug: 'site-meta',
  label: 'Tytuł i opis strony',
  access,
  admin: { description: 'To, co widać w wynikach wyszukiwania i w podglądzie linku.', group: 'Strona' },
  fields: [
    { name: 'title', type: 'text', required: true, label: 'Tytuł' },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      label: 'Opis',
      admin: { description: 'Około 150 znaków — dłuższy zostanie ucięty w wynikach wyszukiwania.' },
    },
  ],
}

/** Main navigation. */
export const Navigation: GlobalConfig = {
  slug: 'navigation',
  label: 'Nawigacja',
  access,
  admin: { description: 'Menu w nagłówku. Kolejność na liście = kolejność w menu.', group: 'Strona' },
  fields: [
    {
      name: 'items',
      type: 'array',
      required: true,
      minRows: 1,
      label: 'Pozycje menu',
      labels: { singular: 'Pozycja', plural: 'Pozycje' },
      fields: [
        { name: 'label', type: 'text', required: true, label: 'Napis' },
        {
          name: 'href',
          type: 'text',
          required: true,
          label: 'Adres',
          admin: { description: 'Kotwica (#offer) albo ścieżka (/programs/).' },
        },
        {
          name: 'scrollSpy',
          type: 'checkbox',
          label: 'Podświetla się przy przewijaniu',
          admin: {
            description:
              'Zaznacz dla kotwic na stronie głównej. Odznacz dla pozycji prowadzących na inną stronę — tam nie ma czego śledzić.',
          },
        },
      ],
    },
  ],
}

export const HeaderCopy: GlobalConfig = {
  slug: 'header-copy',
  label: 'Nagłówek',
  access,
  admin: { description: 'Teksty paska na górze strony, razem z opisami dla czytników ekranu.', group: 'Strona' },
  fields: [
    {
      name: 'skipLink',
      type: 'text',
      required: true,
      label: 'Link „przejdź do treści”',
      admin: { description: 'Pierwsze, co słyszy czytnik ekranu i co widać po naciśnięciu Tab.' },
    },
    { name: 'logoAriaLabel', type: 'text', required: true, label: 'Opis logo dla czytników ekranu' },
    { name: 'navAriaLabel', type: 'text', required: true, label: 'Opis menu dla czytników ekranu' },
    { name: 'cta', type: 'group', label: 'Przycisk z telefonem', fields: linkFields() },
    {
      name: 'menuButton',
      type: 'group',
      label: 'Przycisk menu (telefon)',
      fields: [
        { name: 'label', type: 'text', required: true, label: 'Napis obok ikony' },
        { name: 'openAriaLabel', type: 'text', required: true, label: 'Opis, gdy menu jest zamknięte' },
        { name: 'closeAriaLabel', type: 'text', required: true, label: 'Opis, gdy menu jest otwarte' },
        { name: 'panelAriaLabel', type: 'text', required: true, label: 'Opis otwartego panelu' },
      ],
    },
    {
      name: 'themeToggle',
      type: 'group',
      label: 'Przełącznik motywu',
      admin: {
        description:
          'Przycisk pokazuje ikonę i słowo trybu, NA KTÓRY przełączy — więc oba stany trzeba napisać osobno.',
      },
      fields: [
        {
          name: 'toLight',
          type: 'group',
          label: 'Gdy włączony jest tryb ciemny',
          fields: [
            { name: 'label', type: 'text', required: true, label: 'Napis' },
            { name: 'ariaLabel', type: 'text', required: true, label: 'Opis dla czytników ekranu' },
          ],
        },
        {
          name: 'toDark',
          type: 'group',
          label: 'Gdy włączony jest tryb jasny',
          fields: [
            { name: 'label', type: 'text', required: true, label: 'Napis' },
            { name: 'ariaLabel', type: 'text', required: true, label: 'Opis dla czytników ekranu' },
          ],
        },
      ],
    },
  ],
}

export const FooterCopy: GlobalConfig = {
  slug: 'footer-copy',
  label: 'Stopka',
  access,
  admin: { group: 'Strona' },
  fields: [
    { name: 'navAriaLabel', type: 'text', required: true, label: 'Opis menu stopki dla czytników ekranu' },
    {
      name: 'nav',
      type: 'array',
      required: true,
      minRows: 1,
      label: 'Menu stopki',
      labels: { singular: 'Pozycja', plural: 'Pozycje' },
      fields: [
        { name: 'label', type: 'text', required: true, label: 'Napis' },
        { name: 'href', type: 'text', required: true, label: 'Adres' },
        { name: 'scrollSpy', type: 'checkbox', label: 'Podświetla się przy przewijaniu' },
      ],
    },
    { name: 'logoAriaLabel', type: 'text', required: true, label: 'Opis logo dla czytników ekranu' },
    {
      name: 'legal',
      type: 'textarea',
      required: true,
      label: 'Prawa autorskie i adres',
      admin: { description: 'Jedna linijka na dole strony.' },
    },
  ],
}

export const Facts: GlobalConfig = {
  slug: 'facts',
  label: 'Pasek faktów',
  access,
  admin: {
    description:
      'Trzy krótkie fakty pod ruchomym paskiem. Cena jest tu WPISANA, nie liczona z cennika: najtańsza pozycja to dodatek dwa razy w miesiącu, więc automatyczne minimum przeczyłoby zatwierdzonemu „już od 140 zł”.',
    group: 'Strona',
  },
  fields: [
    {
      name: 'items',
      type: 'array',
      required: true,
      minRows: 1,
      label: 'Fakty',
      labels: { singular: 'Fakt', plural: 'Fakty' },
      fields: [
        { name: 'term', type: 'text', required: true, label: 'Nazwa' },
        { name: 'value', type: 'text', required: true, label: 'Wartość' },
      ],
    },
  ],
}

export const Marquee: GlobalConfig = {
  slug: 'marquee',
  label: 'Ruchomy pasek',
  access,
  admin: {
    description:
      'Nazwy stylów przewijające się pod sekcją powitalną. Pasek jest ozdobny i ukryty przed czytnikami ekranu — nie wpisuj tu nic, czego nie ma gdzie indziej na stronie.',
    group: 'Strona',
  },
  fields: [
    {
      name: 'items',
      type: 'array',
      required: true,
      minRows: 1,
      label: 'Hasła',
      labels: { singular: 'Hasło', plural: 'Hasła' },
      fields: [{ name: 'text', type: 'text', required: true, label: 'Tekst' }],
    },
  ],
}

export const UiCopy: GlobalConfig = {
  slug: 'ui-copy',
  label: 'Teksty elementów sterujących',
  access,
  admin: { description: 'Opisy przełączników i filtrów — w większości czytane tylko przez czytniki ekranu.', group: 'Strona' },
  fields: [
    {
      name: 'locationToggle',
      type: 'group',
      label: 'Przełącznik lokalizacji',
      admin: { description: 'Ten sam przełącznik pojawia się w trzech sekcjach i w każdej opisuje się inaczej.' },
      fields: [
        { name: 'scheduleAriaLabel', type: 'text', required: true, label: 'W sekcji „Grafik”' },
        { name: 'pricelistAriaLabel', type: 'text', required: true, label: 'W sekcji „Cennik”' },
        { name: 'contactAriaLabel', type: 'text', required: true, label: 'W sekcji „Kontakt”' },
      ],
    },
    {
      name: 'scheduleFilter',
      type: 'group',
      label: 'Filtr grafiku',
      fields: [
        {
          name: 'legend',
          type: 'text',
          required: true,
          label: 'Napis przed filtrami',
          admin: { description: 'Widoczne „Pokaż”, a zarazem nazwa całej grupy filtrów dla czytników ekranu.' },
        },
        { name: 'allLabel', type: 'text', required: true, label: 'Napis na filtrze zerującym', admin: { description: 'Np. „Wszystkie”.' } },
      ],
    },
    textRunsField(
      'scheduleNote',
      'Przypis pod grafikiem',
      'Wyjaśnia, co znaczy nabór i grupa sportowa. Podziel na fragmenty tam, gdzie słowo ma być kursywą — zamiast wstawiać znaczniki HTML.',
    ),
  ],
}

export const ContactCopy: GlobalConfig = {
  slug: 'contact-copy',
  label: 'Kontakt',
  access,
  admin: { description: 'Telefon, e-mail i profile społecznościowe w sekcji „Kontakt”.', group: 'Strona' },
  fields: [
    {
      name: 'links',
      type: 'array',
      required: true,
      minRows: 1,
      label: 'Odnośniki',
      labels: { singular: 'Odnośnik', plural: 'Odnośniki' },
      admin: {
        description:
          'Każdy ma własny widoczny tekst. Przy profilach społecznościowych użyj pola „Doprecyzowanie”, nie „Nazwa dla czytników ekranu”.',
      },
      fields: linkFields(),
    },
  ],
}
