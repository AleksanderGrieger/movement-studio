import { LegacyRedirect, legacyMetadata } from "../legacy-redirect";
import { getSectionIntro } from "@/lib/content/site";

export const metadata = legacyMetadata("schedule");

/** Retired route — now the #schedule section of the home page. */
export default async function Page() {
  const section = await getSectionIntro("schedule");
  return <LegacyRedirect anchor="schedule" label={section.eyebrow} />;
}
