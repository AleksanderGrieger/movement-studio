import { LegacyRedirect, legacyMetadata } from "../legacy-redirect";
import { getSectionIntro } from "@/lib/content/site";

export const metadata = legacyMetadata("contact");

/** Retired route — now the #contact section of the home page. */
export default async function Page() {
  const section = await getSectionIntro("contact");
  return <LegacyRedirect anchor="contact" label={section.eyebrow} />;
}
