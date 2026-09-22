import type { Metadata } from "next";
import { Plus_Jakarta_Sans, DM_Sans, JetBrains_Mono } from "next/font/google";
import AppChrome from "./components/AppChrome";
import "./globals.css";

const fontDisplay = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-display",
});

const fontBody = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-body",
});

const fontData = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-data",
});

export const metadata: Metadata = {
  title: "RecoverX | AI-Powered Post-Surgery Rehabilitation Assistant",
  description: "Clinical-grade AI physiotherapy with real-time pose tracking, medical report parsing, hands-free voice coaching, and physician connectivity.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fontDisplay.variable} ${fontBody.variable} ${fontData.variable}`}
    >
      <body className="antialiased min-h-screen">
        <AppChrome>{children}</AppChrome>
      </body>
    </html>
  );
}
