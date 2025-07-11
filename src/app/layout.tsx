import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { cn } from '@/lib/utils';
import { Audiowide, Inter } from 'next/font/google';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';

/**
 * Metadata for the BEEP: Genesis application.
 * @type {Metadata}
 */
export const metadata: Metadata = {
  title: 'BEEP: Genesis',
  description: 'A cognitive and operational sanctuary.',
};

/**
 * The Inscription: The font for headings, logos, and sacred names.
 * It is sharp, futuristic, and carries an air of ancient authority.
 * This is the Obelisk Tier of our Typographic Sigil System.
 * @type {NextFont}
 */
const fontInscription = Audiowide({
  subsets: ['latin'],
  variable: '--font-inscription',
  weight: ['400'],
});

/**
 * The Codex: The workhorse font for all UI text and body copy.
 * It is exceptionally clear, legible, and minimalist, providing
 * effortless clarity. This is the Codex Tier of our Typographic Sigil System.
 * @type {NextFont}
 */
const fontCodex = Inter({
  subsets: ['latin'],
  variable: '--font-codex',
});

/**
 * Defines the root layout for the application, wrapping all pages.
 * It sets up the global fonts, theme, and Toaster component.
 * This is the foundational structure of the "Digital Temple."
 * @param {Readonly<{children: React.ReactNode;}>} props The props for the component.
 * @returns {JSX.Element} The rendered root layout.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("dark", GeistSans.variable, GeistMono.variable, fontInscription.variable, fontCodex.variable)}>
      <body className={cn("font-body antialiased", "min-h-screen")}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
