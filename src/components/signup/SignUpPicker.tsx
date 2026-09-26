"use client";

import { useState } from "react";
import type {
  Audience,
  Location,
  SignUpCopy,
  SignUpForm as SignUpFormData,
} from "@/lib/content/types";
import { useHomeState } from "../home/HomeState";
import { LocationToggle } from "../home/LocationToggle";
import { SegmentedToggle } from "../home/SegmentedToggle";
import { SignUpForm } from "./SignUpForm";

/**
 * The two switches over #signup, and whichever form they select.
 *
 * 'use client': it owns the audience choice and reads the shared location.
 *
 * The two switches are deliberately different in kind. Location is the
 * page-wide state from §6.4 — picking Kołobrzeg here also moves the schedule
 * and the pricelist, and a visitor who chose their town up at the schedule
 * finds this section already set to it. Audience is local: nothing else on
 * the page is split by it, so putting it in the shared context would be
 * inventing a second global for one consumer.
 *
 * Only the selected form is rendered, which is the opposite of what the
 * location panels elsewhere do (§6.4 keeps both in the DOM so switching is
 * instant). Forms cannot follow that pattern: four of them mounted at once
 * would mean four sets of the same field names in one document, three of them
 * holding whatever a visitor typed before changing their mind — and on the
 * no-JS path, four native posts fighting over which one the submit button
 * belongs to. The `key` is what makes the switch a fresh form rather than the
 * previous one's answers relabelled.
 */
export function SignUpPicker({
  locations,
  audiences,
  forms,
  copy,
}: {
  locations: Location[];
  audiences: Audience[];
  forms: SignUpFormData[];
  copy: SignUpCopy;
}) {
  const { location } = useHomeState();
  const [audience, setAudience] = useState(audiences[0].slug);

  const form = forms.find(
    (candidate) =>
      candidate.location === location && candidate.audience === audience,
  );

  return (
    <>
      <div className="flex flex-wrap items-center gap-x-(--sp-4)">
        <LocationToggle
          locations={locations}
          ariaLabel={copy.locationToggleAriaLabel}
        />
        <SegmentedToggle
          variant="toggle-audience"
          ariaLabel={copy.audienceToggleAriaLabel}
          options={audiences.map((candidate) => ({
            value: candidate.slug,
            label: candidate.name,
          }))}
          value={audience}
          onChange={setAudience}
        />
      </div>

      <div className="max-w-[48rem]">
        {form ? (
          <SignUpForm key={form.slug} form={form} copy={copy} />
        ) : (
          <p className="max-w-(--measure) text-text-muted">
            {copy.unavailable}
          </p>
        )}
      </div>
    </>
  );
}
