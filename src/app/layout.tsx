import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Chatbot } from "@/components/chatbot";
import { CMSProvider } from "@/contexts/CMSContext";
import { DynamicMetadata } from "@/components/shared/DynamicMetadata";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
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
