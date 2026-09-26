import { LegacyRedirect, legacyMetadata } from "../legacy-redirect";
import { getSectionIntro } from "@/lib/content/site";

export const metadata = legacyMetadata("offer");

/** Retired route — now the #offer section of the home page. */
export default async function Page() {
  const section = await getSectionIntro("offer");
  return <LegacyRedirect anchor="offer" label={section.eyebrow} />;
}
