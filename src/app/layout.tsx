
import type { Metadata } from "next";
import "./globals.css";
import Acessibilidade from "@/components/Acessibilidade";

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
      className="h-full antialiased"
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
