"use client";

import { useEffect, useId, useRef, useState } from "react";
/* The content type and this component want the same name. The type is the
   one that gets qualified, since the component is what the tree refers to. */
import type {
  SignUpCopy,
  SignUpField,
  SignUpForm as SignUpFormData,
} from "@/lib/content/types";
import { SENDING_ENABLED, signUpEndpoint, submitSignUp } from "./submit";
import {
  emptyValues,
  validate,
  type SignUpErrors,
  type SignUpValues,
} from "./values";

/**
 * One sign-up form, reproducing the studio's Google Form for the selected
 * location and audience.
 *
 * 'use client': it holds the entered values, runs the authored validation and
 * owns the four-state submit cycle.
 *
 * Progressive enhancement is the shape of this component. The <form> carries
 * a real action and method and every input its real `name` — Google's entry
 * id — so with scripting unavailable it posts natively and the visitor lands
 * on Google's own confirmation page. With scripting, the submit is
 * intercepted so the confirmation happens here instead and the page is never
 * left. Nothing about the payload differs between the two.
 *
 * `noValidate` is set from an effect rather than in the markup for the same
 * reason: it must apply only once this component can report errors itself,
 * and the server-rendered HTML — the thing the no-JS visitor gets — has to
 * keep the browser's native constraint checking.
 *
 * Nothing here carries `.r`. RevealObserver collects the revealable elements
 * once and unobserves each as it fires, so an element mounted later never
 * gets `is-in` and would sit at opacity 0 forever — which is both of the
 * things this component renders: the form remounts whenever a toggle changes
 * its key, and the confirmation replaces it after a submit. The section head
 * above still reveals, so #signup still enters with motion.
 *
 * The component is keyed on the form's slug by its parent, so switching town
 * or audience mounts a fresh one rather than carrying half-typed answers from
 * one form into a different one's fields.
 */

type Status = "idle" | "sending" | "sent" | "failed";

const FIELD_LABEL =
  "block text-(length:--s-1) font-(--weight-strong) tracking-[0.04em]";

/* Inputs read as one control with the toggles above them: same 1px
   border-strong boundary, same --radius, same tap-target floor. The invalid
   state changes the border rather than adding one, so nothing reflows when a
   message appears. */
const CONTROL = [
  "w-full min-h-(--tap-target) rounded-(--radius) border border-border-strong",
  "bg-surface-2 px-(--sp-3) py-(--sp-2) text-text",
  "transition-[border-color] duration-(--dur-hover) ease-(--ease-swing)",
  "hover:border-text focus-visible:border-text",
  "aria-[invalid=true]:border-accent-text",
].join(" ");

const BOX =
  "mt-[0.2em] size-[1.15em] flex-none accent-[var(--color-accent)] cursor-pointer";

const ERROR = "text-(length:--s-1) text-accent-text";

export function SignUpForm({
  form,
  copy,
}: {
  form: SignUpFormData;
  copy: SignUpCopy;
}) {
  const [values, setValues] = useState<SignUpValues>(() => emptyValues(form));
  const [errors, setErrors] = useState<SignUpErrors>({});
  const [status, setStatus] = useState<Status>("idle");

  const formRef = useRef<HTMLFormElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const outcomeRef = useRef<HTMLDivElement>(null);
  const id = useId();

  /* The ids have to be unique on a page that also renders a schedule filter
     and a contact form's worth of controls, and `useId` is what guarantees
     that without threading a prefix through every field. */
  const fieldId = (slug: string) => `${id}-${slug}`;
  const errorId = (slug: string) => `${id}-${slug}-error`;

  useEffect(() => {
    /* See the note on progressive enhancement above. */
    formRef.current?.setAttribute("novalidate", "");
  }, []);

  /* Both outcomes move focus to what they put on screen: after a submit the
     visitor's attention is on the button they pressed, and neither the
     confirmation that replaces the form nor the failure notice above it is
     where the caret would otherwise land. */
  useEffect(() => {
    if (status === "sent" || status === "failed") outcomeRef.current?.focus();
  }, [status]);

  function setText(slug: string, value: string) {
    setValues((current) => ({
      ...current,
      texts: { ...current.texts, [slug]: value },
    }));
  }

  function toggleChoice(slug: string, option: string, checked: boolean) {
    setValues((current) => {
      const selected = current.choices[slug] ?? [];
      return {
        ...current,
        choices: {
          ...current.choices,
          [slug]: checked
            ? [...selected, option]
            : selected.filter((value) => value !== option),
        },
      };
    });
  }

  function setConsent(slug: string, checked: boolean) {
    setValues((current) => ({
      ...current,
      consents: { ...current.consents, [slug]: checked },
    }));
  }

  /* A message clears as soon as the field it is about changes, so a corrected
     field stops being flagged while the visitor is still in it — but nothing
     is flagged before the first submit. Validating on blur would mark a
     half-typed address wrong on the way to the next field. */
  function clearError(slug: string) {
    setErrors((current) => {
      if (!(slug in current)) return current;
      const next = { ...current };
      delete next[slug];
      return next;
    });
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;

    const found = validate(form, values, copy.errors);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      setStatus("idle");
      /* The summary is rendered by this same pass, so focus moves after it
         commits. It is what tells a screen-reader user what went wrong and
         where, and each entry links to the field it names. */
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }

    setStatus("sending");
    try {
      await submitSignUp(form, values);
      setStatus("sent");
    } catch {
      setStatus("failed");
    }
  }

  function reset() {
    setValues(emptyValues(form));
    setErrors({});
    setStatus("idle");
  }

  if (status === "sent") {
    return (
      <div
        className="border border-border bg-surface p-(--sp-5) md:p-(--sp-6)"
        ref={outcomeRef}
        tabIndex={-1}
        role="status"
      >
        <h3 className="display [--display-step:var(--s2)]">
          {copy.success.title}
        </h3>
        <p className="mt-(--sp-3) max-w-(--measure) text-text-muted">
          {copy.success.body}
        </p>
        <button
          className="btn btn-ghost mt-(--sp-5)"
          type="button"
          onClick={reset}
        >
          {copy.success.againLabel}
        </button>
      </div>
    );
  }

  const summary = form.fields.filter((field) => errors[field.slug]);

  return (
    <form
      className="border border-border bg-surface p-(--sp-5) md:p-(--sp-6)"
      ref={formRef}
      /* Live only once sending is switched on, so the no-JS path and the
         scripted one start working in the same commit. */
      action={SENDING_ENABLED ? signUpEndpoint(form.formId) : undefined}
      method="post"
      aria-label={copy.formAriaLabel}
      onSubmit={onSubmit}
    >
      {status === "failed" ? (
        <div
          className="mb-(--sp-5) border border-accent-text bg-accent-soft p-(--sp-4)"
          ref={outcomeRef}
          tabIndex={-1}
          role="alert"
        >
          <p className="font-(--weight-strong)">{copy.failure.title}</p>
          <p className="mt-(--sp-2) max-w-(--measure) text-text-muted">
            {copy.failure.body}
          </p>
        </div>
      ) : null}

      {summary.length > 0 ? (
        <div
          className="mb-(--sp-5) border border-accent-text bg-accent-soft p-(--sp-4)"
          ref={summaryRef}
          tabIndex={-1}
          role="alert"
        >
          <p className="font-(--weight-strong)">{copy.errorSummaryTitle}</p>
          <ul className="mt-(--sp-2) grid gap-(--sp-1)">
            {summary.map((field) => (
              <li key={field.slug}>
                <a
                  className="text-accent-text"
                  href={`#${fieldId(field.slug)}`}
                >
                  {field.label} — {errors[field.slug]}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <p className="mb-(--sp-5) text-(length:--s-1) text-text-muted">
        {copy.requiredNote}
      </p>

      <div className="grid gap-(--sp-5)">
        {form.fields.map((field) => (
          <Field
            key={field.slug}
            field={field}
            copy={copy}
            values={values}
            error={errors[field.slug]}
            fieldId={fieldId(field.slug)}
            errorId={errorId(field.slug)}
            onText={setText}
            onChoice={toggleChoice}
            onConsent={setConsent}
            onClearError={clearError}
          />
        ))}
      </div>

      <button
        className="btn btn-primary mt-(--sp-6) w-full md:w-auto"
        type="submit"
        disabled={status === "sending"}
      >
        {status === "sending"
          ? copy.submittingLabel
          : status === "failed"
            ? copy.failure.retryLabel
            : copy.submitLabel}
      </button>
    </form>
  );
}

/**
 * One field.
 *
 * Split out so the three shapes stay legible side by side. The union is
 * narrowed on `kind`, so each branch reaches only for what its own kind
 * carries.
 */
function Field({
  field,
  copy,
  values,
  error,
  fieldId,
  errorId,
  onText,
  onChoice,
  onConsent,
  onClearError,
}: {
  field: SignUpField;
  copy: SignUpCopy;
  values: SignUpValues;
  error?: string;
  fieldId: string;
  errorId: string;
  onText: (slug: string, value: string) => void;
  onChoice: (slug: string, option: string, checked: boolean) => void;
  onConsent: (slug: string, checked: boolean) => void;
  onClearError: (slug: string) => void;
}) {
  const mark = field.required ? (
    <span aria-hidden> *</span>
  ) : (
    <span className="font-(--weight-body) text-text-muted">
      {" "}
      ({copy.optionalNote})
    </span>
  );

  const message = error ? (
    <p className={ERROR} id={errorId}>
      {error}
    </p>
  ) : null;

  if (field.kind === "choice") {
    const selected = values.choices[field.slug] ?? [];
    return (
      /* A group of related controls with one shared question and one shared
         message, which is what a fieldset is for — the legend is the only
         way the question reaches each checkbox's accessible name. */
      <fieldset
        aria-describedby={error ? errorId : undefined}
        aria-invalid={error ? true : undefined}
        id={fieldId}
        /* The error summary links here by fragment. Every other field's id is
           on an input, which the browser focuses on arrival; a fieldset is not
           focusable, so without this the jump would land near the question
           without putting the caret anywhere. */
        tabIndex={-1}
      >
        <legend className={`${FIELD_LABEL} mb-(--sp-3)`}>
          {field.label}
          {mark}
        </legend>
        <div className="grid gap-(--sp-2)">
          {field.options.map((option) => (
            <label
              className="flex cursor-pointer items-start gap-(--sp-3)"
              key={option.value}
            >
              <input
                className={BOX}
                type="checkbox"
                name={field.entryId}
                value={option.value}
                checked={selected.includes(option.value)}
                onChange={(event) => {
                  onChoice(field.slug, option.value, event.target.checked);
                  onClearError(field.slug);
                }}
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
        {message ? <div className="mt-(--sp-2)">{message}</div> : null}
      </fieldset>
    );
  }

  if (field.kind === "consent") {
    return (
      <div className="border-t border-t-border pt-(--sp-5)">
        <p
          className="max-w-(--measure) text-(length:--s-2) leading-(--leading-body) text-text-muted"
          id={`${fieldId}-notice`}
        >
          {field.description}
        </p>
        <label
          className="mt-(--sp-3) flex cursor-pointer items-start gap-(--sp-3)"
          htmlFor={fieldId}
        >
          <input
            className={BOX}
            id={fieldId}
            type="checkbox"
            name={field.entryId}
            value={field.value}
            required={field.required}
            checked={values.consents[field.slug] ?? false}
            aria-describedby={
              /* The notice is the thing being consented to, so it belongs to
                 the checkbox's description whether or not there is an error. */
              error ? `${fieldId}-notice ${errorId}` : `${fieldId}-notice`
            }
            aria-invalid={error ? true : undefined}
            onChange={(event) => {
              onConsent(field.slug, event.target.checked);
              onClearError(field.slug);
            }}
          />
          <span className={FIELD_LABEL}>
            {field.label}
            {mark}
          </span>
        </label>
        {message ? <div className="mt-(--sp-2)">{message}</div> : null}
      </div>
    );
  }

  return (
    <div className="grid gap-(--sp-2)">
      <label className={FIELD_LABEL} htmlFor={fieldId}>
        {field.label}
        {mark}
      </label>
      <input
        className={CONTROL}
        id={fieldId}
        type={field.kind === "text" ? "text" : field.kind}
        name={field.entryId}
        /* Absent on the children's forms, where the question asks for the
           child's name and the visitor's own saved profile is the wrong
           answer. `off` rather than nothing, so nothing is guessed from the
           field's other attributes. */
        autoComplete={field.autoComplete ?? "off"}
        inputMode={field.kind === "tel" ? "tel" : undefined}
        required={field.required}
        value={values.texts[field.slug] ?? ""}
        aria-describedby={error ? errorId : undefined}
        aria-invalid={error ? true : undefined}
        onChange={(event) => {
          onText(field.slug, event.target.value);
          onClearError(field.slug);
        }}
      />
      {message}
    </div>
  );
}
