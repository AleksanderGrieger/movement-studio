import { specialistCards } from "@/lib/content/content-objects";
import { AboutContent } from "@/src/components/contents/AboutContent/AboutContent";
import { SpecialistsContent } from "@/src/components/contents/SpecialistsContent/SpecialistsContent";

export default function About() {
  return (
    <>
      <AboutContent />
      <SpecialistsContent specialistCardsData={specialistCards} />
    </>
  );
}
