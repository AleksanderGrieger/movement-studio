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
 */
export async function Header() {
  const [copy, navigation] = await Promise.all([
    getHeaderCopy(),
    getNavigation(),
  ]);

  return (
    <StickyHeader>
      <div className="bar">
        <a className="logo" href="/#top" aria-label={copy.logoAriaLabel}>
          <LogoHorizontal />
        </a>

        <SiteNav items={navigation} ariaLabel={copy.navAriaLabel} />

        <div className="bar-end">
          <ThemeToggle copy={copy.themeToggle} />
          <a className="btn btn-primary cta" href={copy.cta.href}>
            {copy.cta.label}
          </a>
          <MobileNav items={navigation} copy={copy.menuButton} />
        </div>
      </div>
    </StickyHeader>
  );
}
