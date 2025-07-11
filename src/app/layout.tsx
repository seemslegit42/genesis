import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { cn } from '@/lib/utils';
import { Comfortaa, Lexend } from 'next/font/google';
import { TypographicStateProvider } from '@/hooks/use-typographic-state';
import { AmbientStateProvider } from '@/hooks/use-ambient-state';

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
const fontInscription = Comfortaa({
  subsets: ['latin'],
  variable: '--font-inscription',
});

/**
 * The Codex: The font for body text, UI elements, and detailed content.
 * It is chosen for its clarity, legibility, and calming presence.
 * This is the Scribe Tier of our Typographic Sigil System.
 * @type {NextFont}
 */
const fontCodex = Lexend({
  subsets: ['latin'],
  variable: '--font-codex',
});

/**
 * Defines the root layout for the application, wrapping all pages.
 * It sets up the global fonts, theme, Toaster, and the TypographicStateProvider.
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
    <html lang="en" className={cn("dark", fontInscription.variable, fontCodex.variable)}>
      <body className={cn("antialiased", "min-h-screen", "font-body")}>
        <AmbientStateProvider>
          <TypographicStateProvider>
              {children}
          </TypographicStateProvider>
        </AmbientStateProvider>
        <Toaster />
      </body>
    </html>
  );
}
