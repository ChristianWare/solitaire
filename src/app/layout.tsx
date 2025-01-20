import type { Metadata } from "next";
import { Inter_Tight } from "next/font/google";
import localFont from "next/font/local";

import "./globals.css";

const InterTight = Inter_Tight({
  variable: "--InterTight",
  weight: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

const BoogyBrutPoster = localFont({
  src: "../../public/fonts/BoogyBrutPoster.woff2",
  variable: "--BoogyBrutPoster",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Christian Ware's Portfolio Website",
  description:
    "Welcome to my website wher you can see my most recent work and download my resume. Feel free to reach out at any time.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={`${InterTight.variable} ${BoogyBrutPoster.variable}`}>
        {children}
      </body>
    </html>
  );
}
