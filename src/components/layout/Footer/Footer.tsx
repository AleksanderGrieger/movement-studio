import { getFooterCopy } from "@/lib/content/site";
import { LogoStacked } from "../../brand/LogoStacked";

/** Site footer. Server Component — nothing here is interactive. */
export async function Footer() {
  const copy = await getFooterCopy();

  return (
    <footer className="border-t border-t-border pt-(--sp-7) pb-(--sp-6)">
      <div className="mx-auto grid w-(--wrap) gap-(--sp-6) md:grid-cols-[auto_1fr] md:items-center md:gap-(--sp-7)">
        <div
          className="w-[clamp(7rem,18vw,10rem)]"
          role="img"
          aria-label={copy.logoAriaLabel}
        >
          <LogoStacked />
        </div>
        <nav aria-label={copy.navAriaLabel}>
          <ul className="flex flex-wrap gap-x-(--sp-5) gap-y-(--sp-3)">
            {copy.nav.map((item) => (
              <li key={item.href}>
                <a
                  className="text-(length:--s-1) text-text-muted no-underline transition-[color] duration-(--dur-hover) ease-(--ease-swing) hover:text-text focus-visible:text-text"
                  href={item.href}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="mx-auto w-(--wrap)">
        <p className="mt-(--sp-6) text-(length:--s-2) text-text-muted">
          {copy.legal}
        </p>
      </div>
    </footer>
  );
}
