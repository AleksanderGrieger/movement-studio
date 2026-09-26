import type { SignUpForm } from "@/lib/content/types";
import type { SignUpValues } from "./values";

/**
 * Talking to Google Forms.
 *
 * A published form accepts an ordinary form-encoded POST to its own
 * /formResponse, with one parameter per question named by that question's
 * entry id. The response lands in the same form and the same linked sheet as
 * one filled in on Google's own page, so the studio's existing workflow does
 * not change.
 *
 * Two properties of these four forms make that straightforward, both verified
 * against their published definitions: they are single-page (so no
 * pageHistory is needed), and none of them collects the responder's Google
 * identity or a file upload — the two cases a POST cannot satisfy. The email
 * address is an ordinary question of the form's own, not Google's built-in
 * collector, so it travels as a normal entry.
 */

/**
 * NOT YET WIRED.
 *
 * The section is built and the payload below is the real one, but nothing is
 * transmitted until this is flipped and submitSignUp's fetch is uncommented.
 * Until then submitting exercises the whole flow — validation, the pending
 * state, the confirmation — without putting a test response into the studio's
 * live sheet.
 */
export const SENDING_ENABLED = true;

/** The POST endpoint, derived from the id in the form's public URL. */
export function signUpEndpoint(formId: string): string {
  return `https://docs.google.com/forms/d/e/${formId}/formResponse`;
}

/**
 * The payload, in Google's shape.
 *
 * Checkboxes repeat their entry name once per selection — that is how Google
 * encodes a multi-select, and appending is what produces it. The consent
 * checkbox posts the option's own text, because on Google's side that
 * question is a single-option radio and the text is its value.
 *
 * Fields left blank are omitted rather than sent empty: an empty string is a
 * different thing from an unanswered optional question, and only one of the
 * nine questions across the four forms is optional.
 */
export function toSignUpPayload(
  form: SignUpForm,
  values: SignUpValues,
): URLSearchParams {
  const payload = new URLSearchParams();

  for (const field of form.fields) {
    if (field.kind === "choice") {
      const selected = values.choices[field.slug] ?? [];
      for (const option of selected) payload.append(field.entryId, option);
      continue;
    }
    if (field.kind === "consent") {
      if (values.consents[field.slug]) payload.append(field.entryId, field.value);
      continue;
    }
    const text = (values.texts[field.slug] ?? "").trim();
    if (text) payload.append(field.entryId, text);
  }

  return payload;
}

/**
 * Sends one response.
 *
 * Google sets no CORS headers on /formResponse, so the request goes out as
 * `no-cors`: it is delivered and recorded, but the reply is opaque and its
 * status unreadable. A resolved promise therefore means "handed to the
 * network", not "Google accepted it" — which is why the form validates
 * everything Google would have validated before it gets here, rather than
 * relying on a rejection to find out.
 */
export async function submitSignUp(
  form: SignUpForm,
  values: SignUpValues,
): Promise<void> {
  const payload = toSignUpPayload(form, values);

  if (!SENDING_ENABLED) {
    /* Same shape as the real call, so the pending state is exercised at
       roughly its real length rather than flashing past. */
    await new Promise((resolve) => setTimeout(resolve, 600));
    return;
  }

  await fetch(signUpEndpoint(form.formId), {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: payload,
  });
}
