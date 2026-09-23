import "./globals.css";
import type { Metadata } from "next";
import { fontVariables } from "../fonts";
import { getHeaderCopy, getSiteMeta } from "@/lib/content/site";
import { Header } from "../components/layout/Header/Header";
import { Footer } from "../components/layout/Footer/Footer";
import { RevealObserver } from "../components/layout/RevealObserver";
import { NoScriptReveal } from "../components/layout/NoScriptReveal";
import { ThemeScript } from "../components/layout/ThemeScript";
import { DEFAULT_THEME } from "../components/layout/theme";

/* Search results and share cards are user-visible copy, so the title and
   description come from the content layer like everything else. */
export async function generateMetadata(): Promise<Metadata> {
  const meta = await getSiteMeta();
  return {
    title: meta.title,
    description: meta.description,
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headerCopy = await getHeaderCopy();

  return (
    /* suppressHydrationWarning: ThemeScript rewrites data-theme before React
       hydrates, so the server-rendered DEFAULT_THEME and the client's stored
       value can differ by design. */
    <html
      lang="pl"
      data-theme={DEFAULT_THEME}
      className={fontVariables}
      suppressHydrationWarning
    >
      <head>
        <ThemeScript />
        <NoScriptReveal />
      </head>
      <body>
        {/* Skip link — visible on focus (§10). */}
        <a
          className="absolute top-(--sp-3) left-(--sp-3) z-[100] bg-accent px-(--sp-4) py-(--sp-2) text-on-accent -translate-y-[200%] transition-[translate] duration-(--dur-ui) ease-(--ease-momentum) focus:translate-y-0"
          href="#main"
        >
          {headerCopy.skipLink}
        </a>
        <span id="top" />
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <RevealObserver />
      </body>
    </html>
  );
}
