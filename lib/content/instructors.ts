import type { FoundersIntro, Instructor } from "./types";
import data from "./data/instructors.json";

/**
 * The crew, in presentation order.
 *
 * The count is not fixed: the approved design showed four, the studio
 * currently has five, and the grid is built to hold anywhere from one to ten
 * without a layout change.
 */
export async function getInstructors(): Promise<Instructor[]> {
  return (data.instructors as Instructor[])
    .slice()
    .sort((a, b) => a.order - b.order);
}

/** The founders' statement that opens #about-us. */
export async function getFoundersIntro(): Promise<FoundersIntro> {
  return data.founders as FoundersIntro;
}
