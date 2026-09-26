import Link from "next/link";
import { getHeaderCopy, getNavigation } from "@/lib/content/site";
import { LogoHorizontal } from "../../brand/LogoHorizontal";
import { MobileNav } from "../MobileNav";
import { SiteNav } from "../SiteNav";
import { StickyHeader } from "../StickyHeader";
import { ThemeToggle } from "../ThemeToggle";

/**
 * Site header. A Server Component: it reads the copy and renders the shell,
 * delegating only the genuinely interactive parts to client islands
 * (StickyHeader, SiteNav, ThemeToggle, MobileNav).
 *
 * The wordmark is a <Link>, not a plain <a>: its href is a literal route, so
 * next/link is what turns the trip home from /programs into a client-side
 * navigation instead of a full reload. The nav links next door stay plain
 * anchors because their hrefs come from the content layer — same-document
 * fragments on the home page, which the browser already scrolls to without
 * reloading (see scripts/check-interactions.mts).
 *
 * The wordmark takes the theme toggle's lift, but keeps its tilt to the -1deg
 * the posters already use: -18deg across a 12.5rem lockup would read as a
 * broken layout rather than a flourish. Same duration and the same
 * overshooting curve, so the two read as one gesture. The footer lockup is a
 * <div role="img">, not a link, and stays still.
 */
export async function Header() {
  const [copy, navigation] = await Promise.all([
    getHeaderCopy(),
    getNavigation(),
  ]);

  return (
    <StickyHeader>
      <div className="mx-auto flex w-(--wrap) min-h-(--header-h) items-center justify-between gap-(--sp-3)">
        <Link
          className="block w-[clamp(9rem,22vw,12.5rem)] transition-[translate,rotate] duration-(--dur-ui) ease-(--ease-weight) hover:-translate-y-px hover:-rotate-1 focus-visible:-translate-y-px focus-visible:-rotate-1"
          href="/#top"
          aria-label={copy.logoAriaLabel}
        >
          <LogoHorizontal />
        </Link>

        <SiteNav items={navigation} ariaLabel={copy.navAriaLabel} />

        <div className="flex items-center gap-(--sp-2) lg:gap-(--sp-3)">
          <ThemeToggle copy={copy.themeToggle} />
          <a
            className="btn btn-primary hidden lg:inline-flex lg:px-(--sp-4) lg:text-(length:--s-1)"
            href={copy.cta.href}
          >
            {copy.cta.label}
          </a>
          <MobileNav
            items={navigation}
            cta={copy.cta}
            copy={copy.menuButton}
          />
        </div>
      </div>
    </StickyHeader>
  );
}
