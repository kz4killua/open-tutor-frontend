import clsx from "clsx";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { Providers } from "./providers";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Open Tutor",
  description: "An AI-augmented learning experience",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // "suppressHydrationWarning" for next-themes
    <html lang="en" suppressHydrationWarning>
      <body className={clsx(
        inter.className, 
        "selection:bg-primary/20"
      )}>
        <Providers>
          <Toaster richColors />
          {children}
        </Providers>
      </body>
    </html>
  );
}
