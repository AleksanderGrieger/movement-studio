import "./styles.css";
import "./globals.scss";
import "./globals.css";
import type { Metadata } from "next";
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
    <html lang="pl">
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
