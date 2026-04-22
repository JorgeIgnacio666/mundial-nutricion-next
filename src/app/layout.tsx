import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mundial de Nutrición Clínica 2026 — CELAN",
  description: "Competición académica para decidir la especialidad líder en evidencia basada para 2026.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full">
      <body className={`${inter.className} min-h-full flex flex-col`}>
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
