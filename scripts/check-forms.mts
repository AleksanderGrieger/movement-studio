/**
 * Sign-up forms vs. the live Google Forms.
 *
 * The site reproduces four Google Forms and posts to their endpoints using
 * the entry ids and option texts stored in lib/content/data/forms.json. Google
 * accepts such a POST without validating it against the form: a response whose
 * entry id is unknown, or whose checkbox value is not one of the published
 * options, is accepted and then silently dropped. Nothing on the site can tell
 * — the request is sent no-cors, so even its status is unreadable.
 *
 * So this is the check that the stored copy still matches the source. It
 * fetches each form's public page, reads the definition Google publishes
 * there, and compares every field. Run it after anyone edits a form in Google
 * — adding a class to a list is the common case, and it is exactly the edit
 * that would otherwise lose every sign-up for that class.
 *
 * Read-only: it submits nothing and creates no responses.
 *
 * Run: npm run check:forms
 */
import { getSignUpForms } from "@/lib/content/forms";
import type { SignUpField } from "@/lib/content/types";

/** Google's question types, for the two we use. */
const CHECKBOX = 4;
const RADIO = 2;

/** The shape Google publishes, as far as this script reads into it. */
type PublishedEntry = [number, [string][] | null, number, ...unknown[]];
type PublishedQuestion = [
  number,
  string,
  string | null,
  number,
  PublishedEntry[],
  ...unknown[],
];

const fail: string[] = [];
const ok: string[] = [];

const check = (label: string, got: unknown, want: unknown) => {
  const passed = JSON.stringify(got) === JSON.stringify(want);
  if (passed) {
    ok.push(label);
  } else {
    fail.push(label);
    console.log(`FAIL  ${label}`);
    console.log(`        stored on the site: ${JSON.stringify(got)}`);
    console.log(`        live in Google:     ${JSON.stringify(want)}`);
  }
};

async function fetchDefinition(formId: string): Promise<PublishedQuestion[]> {
  const url = `https://docs.google.com/forms/d/e/${formId}/viewform`;
  const response = await fetch(url, { redirect: "follow" });
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText} for ${url}`);
  }
  const html = await response.text();

  /* A form that has been switched to require a Google account answers with a
     sign-in page instead, which has no definition in it — and would also be a
     form the site can no longer post to at all. Worth naming rather than
     failing as an unhelpful parse error. */
  const match = html.match(/FB_PUBLIC_LOAD_DATA_ = (\[[\s\S]*?\]);<\/script>/);
  if (!match) {
    throw new Error(
      `no public definition at ${url} — the form may have been unpublished or set to require sign-in`,
    );
  }
  return JSON.parse(match[1])[1][1] as PublishedQuestion[];
}

/** What the site would post for this field, described the way Google does. */
function storedShape(field: SignUpField) {
  return {
    entryId: field.entryId,
    required: field.required,
    options:
      field.kind === "choice"
        ? field.options.map((option) => option.value)
        : field.kind === "consent"
          ? [field.value]
          : null,
  };
}

function liveShape(question: PublishedQuestion) {
  const [entryId, choices, required] = question[4][0];
  return {
    entryId: `entry.${entryId}`,
    required: required === 1,
    options: choices ? choices.map((choice) => choice[0]) : null,
  };
}

const forms = await getSignUpForms();

for (const form of forms) {
  console.log(`\n— ${form.slug}`);
  let questions: PublishedQuestion[];
  try {
    questions = await fetchDefinition(form.formId);
  } catch (error) {
    fail.push(`${form.slug}: unreachable`);
    console.log(`FAIL  ${form.slug}: ${(error as Error).message}`);
    continue;
  }

  check(`${form.slug}: field count`, form.fields.length, questions.length);

  /* Matched by entry id rather than by position: a question reordered in
     Google is harmless — the POST is keyed by id — and flagging it would
     train everyone to ignore this script. */
  const liveByEntry = new Map(
    questions.map((question) => [liveShape(question).entryId, question]),
  );

  for (const field of form.fields) {
    const live = liveByEntry.get(field.entryId);
    if (!live) {
      fail.push(`${form.slug}/${field.slug}: entry id not in the live form`);
      console.log(
        `FAIL  ${form.slug}/${field.slug}: ${field.entryId} is not a question on the live form`,
      );
      continue;
    }
    check(`${form.slug}/${field.slug}`, storedShape(field), liveShape(live));

    /* The two kinds we render must stay the kind we render them as: a
       checkbox list turned into a dropdown still posts one value per entry,
       but a list turned into a grid does not. */
    const type = live[3];
    if (field.kind === "choice" && type !== CHECKBOX) {
      fail.push(`${form.slug}/${field.slug}: no longer a checkbox question`);
      console.log(
        `FAIL  ${form.slug}/${field.slug}: rendered as checkboxes but Google now has type ${type}`,
      );
    }
    if (field.kind === "consent" && type !== RADIO) {
      fail.push(`${form.slug}/${field.slug}: no longer a radio question`);
      console.log(
        `FAIL  ${form.slug}/${field.slug}: rendered as a consent checkbox but Google now has type ${type}`,
      );
    }
  }
}

console.log(
  fail.length
    ? `\n${ok.length} ok, ${fail.length} FAILED — lib/content/data/forms.json is out of date`
    : `\n${ok.length} checks passed — every field matches the live forms`,
);
process.exit(fail.length ? 1 : 0);
