import { LegacyRedirect, legacyMetadata } from "../legacy-redirect";
import { getSectionIntro } from "@/lib/content/site";

export const metadata = legacyMetadata("about-us");

/** Retired route — now the #about-us section of the home page. */
export default async function Page() {
  const section = await getSectionIntro("about-us");
  return <LegacyRedirect anchor="about-us" label={section.eyebrow} />;
}
