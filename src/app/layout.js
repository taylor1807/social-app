import localFont from "next/font/local";
import "./globals.css";
import { Sixtyfour, Londrina_Sketch } from "next/font/google";

import Navbar from "@/components/Navbar";
import { ClerkProvider } from "@clerk/nextjs";

export const sixtyFour = Sixtyfour({
  subsets: ["latin"],
  variable: "--font-sixtyfour",
});

export const Londrina = Londrina_Sketch({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-londrina",
});

export const spaceMarine = localFont({
  src: "./fonts/space-marine.ttf",
  variable: "--font-spaceMarine",
});

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "Talkio",
  description: "Talkio Social Chat App",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${sixtyFour.variable} ${Londrina.variable} ${spaceMarine.variable} antialiased`}
      >
        <ClerkProvider>
          <Navbar />
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
