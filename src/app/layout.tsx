import "./globals.css";
import type { Metadata } from "next";
import { fontVariables } from "../fonts";
import { getHeaderCopy } from "@/lib/content/site";
import { Header } from "../components/layout/Header/Header";
import { Footer } from "../components/layout/Footer/Footer";
import { RevealObserver } from "../components/layout/RevealObserver";
import { ThemeScript } from "../components/layout/ThemeScript";

export const metadata: Metadata = {
  title: "Movement Studio | Studio Tańca",
  description: "", //todo: uzupełnić
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headerCopy = await getHeaderCopy();

  return (
    /* suppressHydrationWarning: ThemeScript rewrites data-theme before React
       hydrates, so the server's "a" and the client's stored value can differ
       by design. */
    <html
      lang="pl"
      data-theme="a"
      className={fontVariables}
      suppressHydrationWarning
    >
      <head>
        <ThemeScript />
      </head>
      <body>
        {/* Landmarks per §10. Header and Footer previously sat inside <main>,
            which left the skip link with nothing meaningful to skip to and
            nested two landmarks inside a third. */}
        <a className="skip" href="#main">
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
