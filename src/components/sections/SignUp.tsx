import { getAudiences, getSignUpCopy, getSignUpForms } from "@/lib/content/forms";
import { getLocations } from "@/lib/content/locations";
import { getSectionIntro } from "@/lib/content/site";
import { SignUpPicker } from "../signup/SignUpPicker";
import { SectionHead } from "./SectionHead";

/**
 * #signup — the last section on the page, and where the header and hero CTAs
 * both land (§2's terminal action, now that there is something to act on).
 *
 * It sits after #contact rather than before it: the phone number and the
 * email are the faster route for anyone who wants to ask something first, and
 * the form is the one that wants the visitor to have read the offer, the
 * grafik and the price.
 *
 * A Server Component. Everything it reads is content, and only the switches
 * and the form itself are interactive — those are SignUpPicker.
 */
export async function SignUp() {
  const [section, locations, audiences, forms, copy] = await Promise.all([
    getSectionIntro("signup"),
    getLocations(),
    getAudiences(),
    getSignUpForms(),
    getSignUpCopy(),
  ]);

  return (
    <section className="section" aria-labelledby="signup-title">
      <div className="mx-auto w-(--wrap)">
        <SectionHead section={section} />
        <SignUpPicker
          locations={locations}
          audiences={audiences}
          forms={forms}
          copy={copy}
        />
      </div>
    </section>
  );
}
