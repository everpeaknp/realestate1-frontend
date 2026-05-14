import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { CMSProvider } from "@/contexts/CMSContext";
import { DynamicMetadata } from "@/components/shared/DynamicMetadata";
import { Chatbot } from "@/components/chatbot";
import { ThemeProvider } from "next-themes";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bijen Khadka",
  description: "Find your dream home with Bijen Khadka, your trusted real estate agent. Explore a wide range of properties, get expert advice, and make informed decisions with our comprehensive real estate services.",
};

import MainWrapper from "@/components/layout/MainWrapper";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full">
        <ThemeProvider attribute="class" defaultTheme="light" disableTransitionOnChange>
          <CMSProvider>
            <DynamicMetadata />
            <MainWrapper>
              {children}
            </MainWrapper>
            <Chatbot />
          </CMSProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
