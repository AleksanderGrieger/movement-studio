import type { Program, ProgramsPageCopy, ProgramsTeaser } from "./types";
import { snapshot } from "./snapshot";

/** Grant-funded programmes, in presentation order. Backs /programs. */
export async function getPrograms(): Promise<Program[]> {
  return snapshot()
    .programs.programs.slice()
    .sort((a, b) => a.order - b.order);
}

/** The home-page band that links through to /programs. */
export async function getProgramsTeaser(): Promise<ProgramsTeaser> {
  return snapshot().programs.teaser;
}

/** Page-level copy for the /programs route. */
export async function getProgramsPageCopy(): Promise<ProgramsPageCopy> {
  return snapshot().programs.page;
}
