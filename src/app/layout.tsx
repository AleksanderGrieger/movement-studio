import "./styles.css";
import "./globals.scss";
import "./globals.css";
import type { Metadata } from "next";
import { fontVariables } from "../fonts";
import { Header } from "../components/layout/Header/Header";
import { Footer } from "../components/layout/Footer/Footer";

export const metadata: Metadata = {
  title: "Movement Studio | Studio Tańca",
  description: "", //todo: uzupełnić
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl" data-theme="a" className={fontVariables}>
      <body>
        <main>
          <Header />
          {children}
          <Footer />
        </main>
      </body>
    </html>
  );
}
