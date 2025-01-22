import type { Metadata } from "next";
import { Inter_Tight, Anton, Barlow_Condensed } from "next/font/google";
import localFont from "next/font/local";

import "./globals.css";

const InterTight = Inter_Tight({
  variable: "--InterTight",
  weight: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

const anton = Anton({
  variable: "--Anton",
  weight: ["400"],
  subsets: ["latin"],
});

const HelveticaNowDisplay = localFont({
  src: "../../public/fonts/HelveticaNowDisplay.woff2",
  variable: "--HelveticaNowDisplay",
  display: "swap",
});

const FixtureCondensedSemiBold = localFont({
  src: "../../public/fonts/FixtureCondensedSemiBold.woff2",
  variable: "--FixtureCondensedSemiBold",
  display: "swap",
});

const Furore = localFont({
  src: "../../public/fonts/Furore.otf",
  variable: "--Furore",
  display: "swap",
});

const DashingRegular = localFont({
  src: "../../public/fonts/DashingRegular.otf",
  variable: "--DashingRegular",
  display: "swap",
});

const HumaneMedium = localFont({
  src: "../../public/fonts/HumaneMedium.otf",
  variable: "--HumaneMedium",
  display: "swap",
});

const barlowCondensed = Barlow_Condensed({
  variable: "--barlowCondensed",
  weight: ["500", "600", "700"],
  subsets: ["latin"],
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
      <body
        className={`${InterTight.variable} ${HelveticaNowDisplay.variable} ${FixtureCondensedSemiBold.variable} ${anton.variable} ${Furore.variable} ${DashingRegular.variable} ${HumaneMedium.variable} ${barlowCondensed.variable}`}
      >
        {children}
      </body>
    </html>
  );
}
