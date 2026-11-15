
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Acessibilidade from "@/components/Acessibilidade";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "4RP Entregas | Gestão de Entregas",
  description: "Sistema web para gerenciamento e acompanhamento de entregas.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      data-theme="dark"
      data-bold="false"
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Acessibilidade />
      </body>
    </html>
  );
}
