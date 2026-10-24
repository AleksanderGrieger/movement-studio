import path from 'path'
import { fileURLToPath } from 'url'

import { postgresAdapter } from '@payloadcms/db-postgres'
import { pl } from '@payloadcms/translations/languages/pl'
import { buildConfig } from 'payload'
import sharp from 'sharp'

import { Audiences } from './collections/Audiences'
import { FaqItems } from './collections/FaqItems'
import { Forms } from './collections/Forms'
import { Instructors } from './collections/Instructors'
import { Locations } from './collections/Locations'
import { Media } from './collections/Media'
import { OfferGroups } from './collections/OfferGroups'
import { PriceBlocks } from './collections/PriceBlocks'
import { Programs } from './collections/Programs'
import { ScheduleEntries } from './collections/ScheduleEntries'
import { ScheduleLabels } from './collections/ScheduleLabels'
import { Users } from './collections/Users'
import { Weekdays } from './collections/Weekdays'

import { HeroCopy } from './globals/hero'
import { ProgramsPageCopy, ProgramsTeaser } from './globals/programs'
import { FoundersIntro, SectionIntros } from './globals/sections'
import { SignUpCopy } from './globals/signup'
import {
  ContactCopy,
  Facts,
  FooterCopy,
  HeaderCopy,
  Marquee,
  Navigation,
  SiteMeta,
  UiCopy,
} from './globals/site'

import { publishOnChange, publishOnGlobalChange } from './hooks/publish'

const dirname = path.dirname(fileURLToPath(import.meta.url))

/**
 * Movement Studio's content.
 *
 * This CMS runs out of process. The site is a static export on GitHub Pages
 * and reads a snapshot taken at build time — nothing on www.movement-studio.pl
 * ever calls this API. See docs/cms.md in the site repository.
 *
 * There is no rich-text editor anywhere on purpose. The content contract
 * keeps HTML out of the data: a paragraph break is a record, emphasis is a
 * separate run, and a link after an answer is a link field. A rich-text field
 * would be the one place an editor could put markup the site has no way to
 * render safely.
 */
const content = [
  Locations,
  OfferGroups,
  ScheduleLabels,
  Weekdays,
  ScheduleEntries,
  PriceBlocks,
  Instructors,
  Programs,
  FaqItems,
  Audiences,
  Forms,
  Media,
].map(publishOnChange)

const globals = [
  SiteMeta,
  Navigation,
  HeaderCopy,
  FooterCopy,
  HeroCopy,
  SectionIntros,
  Facts,
  Marquee,
  UiCopy,
  ContactCopy,
  FoundersIntro,
  ProgramsTeaser,
  ProgramsPageCopy,
  SignUpCopy,
].map(publishOnGlobalChange)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
    meta: {
      titleSuffix: '— Movement Studio',
    },
  },
  collections: [...content, Users],
  globals,
  i18n: {
    supportedLanguages: { pl },
    fallbackLanguage: 'pl',
  },
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URI || '' },
  }),
  secret: process.env.PAYLOAD_SECRET || '',
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3100',
  cors: [process.env.SITE_URL, process.env.NEXT_PUBLIC_SERVER_URL].filter(Boolean) as string[],
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  sharp,
  upload: { limits: { fileSize: 20_000_000 } },
})
