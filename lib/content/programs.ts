import type { Program, ProgramsPageCopy, ProgramsTeaser } from "./types";
import data from "./data/programs.json";

/** Grant-funded programmes, in presentation order. Backs /programs. */
export async function getPrograms(): Promise<Program[]> {
  return (data.programs as Program[]).slice().sort((a, b) => a.order - b.order);
}

/** The home-page band that links through to /programs. */
export async function getProgramsTeaser(): Promise<ProgramsTeaser> {
  return data.teaser as ProgramsTeaser;
}

/** Page-level copy for the /programs route. */
export async function getProgramsPageCopy(): Promise<ProgramsPageCopy> {
  return data.page as ProgramsPageCopy;
}
