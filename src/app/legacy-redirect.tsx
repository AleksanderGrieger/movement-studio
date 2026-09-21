import type { Metadata } from "next";

/**
 * Stub for a route the redesign retired.
 *
 * The approved IA collapses /offer, /schedule, /pricelist, /about-us and
 * /contact into anchors on the home page (§2). Those URLs are live and
 * indexed today, so dropping them would 404 real traffic.
 *
 * This is a meta-refresh rather than a real redirect because the site is a
 * static export to GitHub Pages: next.config has output: "export", which does
 * not support redirects() — there is no server to issue a 301. If the site
 * ever moves to a host with redirect rules, delete these stubs and configure
 * 301s there instead, which is better for search engines than a refresh.
 *
 * The page still renders a working link, so it degrades correctly for anyone
 * whose browser ignores the refresh.
 */
export function legacyMetadata(anchor: string): Metadata {
  return {
    // Signals the canonical destination to crawlers, which a meta-refresh
    // alone does not do reliably.
    alternates: { canonical: `/#${anchor}` },
    robots: { index: false, follow: true },
  };
}

export function LegacyRedirect({
  anchor,
  label,
}: {
  anchor: string;
  label: string;
}) {
  const target = `/#${anchor}`;

  return (
    <>
      <meta httpEquiv="refresh" content={`0; url=${target}`} />
      <section className="section">
        <div className="wrap">
          <p className="prose">
            <a className="btn btn-primary" href={target}>
              {label}
            </a>
          </p>
        </div>
      </section>
    </>
  );
}
