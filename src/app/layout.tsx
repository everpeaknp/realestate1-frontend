import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { CMSProvider } from "@/contexts/CMSContext";
import { DynamicMetadata } from "@/components/shared/DynamicMetadata";
import { Chatbot } from "@/components/chatbot";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lily White Realestate",
  description: "Find your dream home with Lily White Realestate",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <CMSProvider>
          <DynamicMetadata />
          {children}
          <Chatbot />
        </CMSProvider>
      </body>
    </html>
  );
}
