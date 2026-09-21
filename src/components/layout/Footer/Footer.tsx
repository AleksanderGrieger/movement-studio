import { getFooterCopy } from "@/lib/content/site";
import { LogoStacked } from "../../brand/LogoStacked";

/** Site footer. Server Component — nothing here is interactive. */
export async function Footer() {
  const copy = await getFooterCopy();

  return (
    <footer className="footer">
      <div className="wrap inner">
        <div className="logo" role="img" aria-label={copy.logoAriaLabel}>
          <LogoStacked />
        </div>
        <nav aria-label={copy.navAriaLabel}>
          <ul>
            {copy.nav.map((item) => (
              <li key={item.href}>
                <a href={item.href}>{item.label}</a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="wrap">
        <p className="legal">{copy.legal}</p>
      </div>
    </footer>
  );
}
