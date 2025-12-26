import type { Metadata } from "next";
import "./globals.css";
import NavbarServer from "./components/NavbarServer";

export const metadata: Metadata = {
  title: "ClosetIQ",
  description: "Track your clothes, wears, and get smarter recommendations.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <NavbarServer />
        {children}
      </body>
    </html>
  );
}
