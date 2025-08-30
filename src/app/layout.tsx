import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import Link from "next/link";
import { Code, TestTube } from "lucide-react";

export const metadata: Metadata = {
  title: 'TestGenius',
  description: 'Intelligent Test Case Generator powered by AI',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Source+Code+Pro:wght@400;500;600&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-background text-foreground">
        <div className="flex flex-col min-h-screen">
          <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center">
              <Link href="/" className="mr-6 flex items-center space-x-2">
                <TestTube className="h-6 w-6 text-primary" />
                <span className="font-bold font-headline sm:inline-block">TestGenius</span>
              </Link>
              <nav className="flex items-center gap-6 text-sm">
                <Link href="/" className="transition-colors hover:text-foreground/80 text-foreground/60">
                  Generator
                </Link>
                <Link href="/about" className="transition-colors hover:text-foreground/80 text-foreground/60">
                  About
                </Link>
              </nav>
            </div>
          </header>
          <main className="flex-1">{children}</main>
          <footer className="border-t border-border/40">
            <div className="container flex flex-col items-center justify-center gap-4 py-8 md:h-24 md:flex-row md:py-0">
              <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
                <TestTube className="h-6 w-6 text-primary" />
                <p className="text-center text-sm leading-loose md:text-left text-muted-foreground">
                  Built by TestGenius. © {new Date().getFullYear()}. All rights reserved.
                </p>
              </div>
            </div>
          </footer>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
