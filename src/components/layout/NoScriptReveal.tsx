/**
 * Makes the page visible when JavaScript does not run.
 *
 * Reveals are driven by an IntersectionObserver: `.r` starts at opacity 0 and
 * the hero's masked lines start translated down, both waiting for JS to lift
 * them. With scripting unavailable nothing ever does, and every one of the 41
 * revealable elements stays invisible — the page renders blank.
 *
 * Everything here is server-rendered and readable without JS, so the content
 * is present; only the animation's initial state hides it. This restores the
 * resting state so the site degrades to a plain, complete page.
 *
 * The approved prototype has the same flaw for the same reason.
 */
export function NoScriptReveal() {
  return (
    <noscript>
      <style>{`.r{opacity:1!important;transform:none!important}.hero h1 .line>span{transform:none!important}`}</style>
    </noscript>
  );
}
