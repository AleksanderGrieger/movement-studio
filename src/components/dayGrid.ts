/**
 * The day-column vocabulary, shared by #schedule and /programs.
 *
 * /programs deliberately reuses the weekly grid's shape so a reader who has
 * already seen #schedule recognises it (see the note in programs/page.tsx).
 * That used to be expressed as `.sessions .day li` overriding `.day li` from
 * two different blocks of globals.css; here the shared part is named once and
 * the two call sites differ only in the columns they pass.
 *
 * `.day` and `.days` survive as bare marker classes: scripts/check-interactions
 * .mts addresses them, and `emptied`/`emptied-day` key off the ancestor
 * `.is-filtering` that ScheduleGrid toggles.
 */

export const DAYS = "days grid gap-(--sp-5) md:grid-cols-[repeat(2,1fr)] md:gap-(--sp-6)";

export const DAY =
  "day transition-[opacity] duration-(--dur-ui) ease-(--ease-swing) emptied:opacity-45";

/* The step is passed in at the call site: two [--display-step:…] utilities on
   one element would be resolved by Tailwind's own ordering rather than by the
   order they are written in, so this one does not carry a default. */
export const DAY_HEAD =
  "display-flat mb-(--sp-3) border-b-2 border-b-accent pb-(--sp-3) emptied-day:border-b-border";

/* Background and the accent edge answer at hover speed; the filter's recede —
   opacity, grayscale, scale — runs at UI speed. Two durations across five
   properties is past what a duration/ease pair can say, so the transition is
   written out. */
export const ROW_TRANSITION =
  "[transition:background-color_var(--dur-hover)_var(--ease-swing),border-left-color_var(--dur-hover)_var(--ease-swing),opacity_var(--dur-ui)_var(--ease-swing),filter_var(--dur-ui)_var(--ease-swing),translate_var(--dur-ui)_var(--ease-swing),scale_var(--dur-ui)_var(--ease-swing)]";

export const ROW = [
  "grid items-baseline p-(--sp-3)",
  "border-b border-b-border border-l-[3px] border-l-transparent",
  "hover:bg-accent-soft hover:border-l-accent hover:translate-x-[3px]",
  "focus-within:bg-accent-soft focus-within:border-l-accent focus-within:translate-x-[3px]",
  /* Filtering by subtraction: non-matches recede. Scale does not affect
     layout, so the rows shrink while the grid holds its geometry. */
  "dim:opacity-[0.16] dim:grayscale-[0.95] dim:scale-[0.92] dim:origin-[left_center]",
  /* Dimmed rows lose their hover response, so a pointer passing over them
     cannot make them jump back to full size. */
  "dim:hover:bg-transparent dim:hover:border-l-transparent dim:hover:translate-x-0",
  "dim:focus-within:bg-transparent dim:focus-within:border-l-transparent dim:focus-within:translate-x-0",
  ROW_TRANSITION,
].join(" ");

/** The weekly grid prints a start time. */
export const ROW_COLUMNS = "grid-cols-[4.6em_1fr] gap-(--sp-3)";

/** Session times print a range ("09:30 – 12:00"), so the first column has to
    be wider. Below 768 that column would leave the class name only about a
    third of the row, so the two stack instead. */
export const SESSION_COLUMNS =
  "grid-cols-[1fr] gap-(--sp-1) md:grid-cols-[9.5em_1fr] md:gap-(--sp-3)";

export const TIME =
  "text-(length:--s0) font-(--weight-strong) text-accent-text tabular-nums";

export const WHAT =
  "flex flex-col items-start gap-(--sp-1) text-(length:--s-1)";

export const TAG =
  "inline-flex items-center gap-(--sp-1) rounded-full border px-(--sp-2) py-px text-(length:--s-2) tracking-[0.12em] uppercase";
