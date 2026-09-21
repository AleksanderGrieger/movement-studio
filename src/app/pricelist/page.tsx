import { LegacyRedirect, legacyMetadata } from "../legacy-redirect";
import { getSectionIntro } from "@/lib/content/site";

export const metadata = legacyMetadata("pricelist");

/** Retired route — now the #pricelist section of the home page. */
export default async function Page() {
  const section = await getSectionIntro("pricelist");
  return <LegacyRedirect anchor="pricelist" label={section.eyebrow} />;
}
