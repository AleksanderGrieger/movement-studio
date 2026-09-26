import type {
  SignUpErrorCopy,
  SignUpForm,
  SignUpField,
} from "@/lib/content/types";

/**
 * What one filled-in form holds, and what makes it valid.
 *
 * Kept out of the component so the rules are readable on their own and so the
 * payload builder can be handed values without a React tree. Validation runs
 * here rather than being left to the browser's own `required` and
 * `type="email"`, for three reasons: the messages are authored Polish copy
 * like everything else on the site, the checkbox group's "pick at least one"
 * has no native equivalent, and a native bubble cannot be pointed at from an
 * error summary.
 *
 * The inputs still carry their native constraints too — they are what a
 * visitor with scripting disabled gets.
 */

/**
 * Values split by what holds them rather than by field, so each map has one
 * type and the component never has to narrow a union to read a value.
 * Keys are field slugs.
 */
export interface SignUpValues {
  texts: Record<string, string>;
  choices: Record<string, string[]>;
  consents: Record<string, boolean>;
}

/** Field slug -> message. Empty means the form is ready to send. */
export type SignUpErrors = Record<string, string>;

/** An untouched form: every field present, so no input is ever uncontrolled. */
export function emptyValues(form: SignUpForm): SignUpValues {
  const values: SignUpValues = { texts: {}, choices: {}, consents: {} };
  for (const field of form.fields) {
    if (field.kind === "choice") values.choices[field.slug] = [];
    else if (field.kind === "consent") values.consents[field.slug] = false;
    else values.texts[field.slug] = "";
  }
  return values;
}

/**
 * Deliberately permissive — one `@`, something either side, a dot in the
 * domain. Anything stricter rejects addresses that are legal and deliverable,
 * and the address is confirmed by the studio replying to it anyway.
 */
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Polish numbers are nine digits, but people write them with spaces, dashes,
 * and a +48 or 0048 prefix. So the check is on the digits that survive
 * stripping the punctuation, not on the shape of what was typed.
 */
function digitCount(value: string): number {
  return value.replace(/\D/g, "").replace(/^(?:0048|48)/, "").length;
}

function validateField(
  field: SignUpField,
  values: SignUpValues,
  copy: SignUpErrorCopy,
): string | null {
  if (field.kind === "choice") {
    const selected = values.choices[field.slug] ?? [];
    return field.required && selected.length === 0 ? copy.choice : null;
  }

  if (field.kind === "consent") {
    return field.required && !values.consents[field.slug] ? copy.consent : null;
  }

  const value = (values.texts[field.slug] ?? "").trim();
  if (!value) return field.required ? copy.required : null;
  /* Format is only checked once there is something to check: an empty
     optional field is valid, and an empty required one has already been
     reported as missing rather than as malformed. */
  if (field.kind === "email" && !EMAIL.test(value)) return copy.email;
  if (field.kind === "tel" && digitCount(value) < 9) return copy.phone;
  return null;
}

/** Every failing field, in the form's own field order. */
export function validate(
  form: SignUpForm,
  values: SignUpValues,
  copy: SignUpErrorCopy,
): SignUpErrors {
  const errors: SignUpErrors = {};
  for (const field of form.fields) {
    const error = validateField(field, values, copy);
    if (error) errors[field.slug] = error;
  }
  return errors;
}
