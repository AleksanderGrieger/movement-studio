import type { Audience, SignUpCopy, SignUpForm } from "./types";
import data from "./data/forms.json";

/**
 * The four sign-up forms (#signup).
 *
 * One form per location per audience, each a faithful transcription of the
 * studio's published Google Form — including the entry ids that form's
 * endpoint expects. See the note on SignUpForm in types.ts for why the four
 * are stored separately rather than folded into one definition with the
 * class list varying.
 *
 * Phase 2.2: in Payload this becomes a Forms collection with Fields as a
 * blocks field. The reader signatures below are what the section imports, so
 * that swap does not reach the components.
 */

/** Both audiences, in toggle order. */
export async function getAudiences(): Promise<Audience[]> {
  return (data.audiences as Audience[])
    .slice()
    .sort((a, b) => a.order - b.order);
}

/** Every form, in presentation order, each with its fields ordered. */
export async function getSignUpForms(): Promise<SignUpForm[]> {
  return (data.forms as SignUpForm[])
    .slice()
    .sort((a, b) => a.order - b.order)
    .map((form) => ({
      ...form,
      fields: form.fields.slice().sort((a, b) => a.order - b.order),
    }));
}

/** Labels, validation messages and the post-submit states. */
export async function getSignUpCopy(): Promise<SignUpCopy> {
  return data.ui as SignUpCopy;
}
