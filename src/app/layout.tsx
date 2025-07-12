
import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Comfortaa, Lexend, Antonio } from 'next/font/google';
import { AppProvider } from '@/components/app-provider';

/**
 * Metadata for the BEEP: Genesis application.
 * @type {Metadata}
 */
export const metadata: Metadata = {
  title: 'BEEP: Genesis',
  description: 'A cognitive and operational sanctuary.',
};

/**
 * The Display: The font for primary headings (H1, H2).
 * Sharp, condensed, and impactful, embodying "mythic brutalism."
 * @type {NextFont}
 */
const fontDisplay = Antonio({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['400', '600'],
});

/**
 * The Inscription: The font for subheadings (H3, H4) and logos.
 * Geometric and futuristic, it carries an air of ancient authority.
 * @type {NextFont}
 */
const fontInscription = Comfortaa({
  subsets: ['latin'],
  variable: '--font-inscription',
});

/**
 * The Codex: The font for body text, UI elements, and detailed content.
 * Chosen for its clarity, legibility, and calming presence.
 * @type {NextFont}
 */
const fontCodex = Lexend({
  subsets: ['latin'],
  variable: '--font-codex',
});

/**
 * Defines the root layout for the application, wrapping all pages.
 * It sets up the global fonts, theme, and providers.
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
    <html lang="en" className={cn("dark", fontDisplay.variable, fontInscription.variable, fontCodex.variable)}>
      <body className={cn("antialiased", "min-h-screen", "font-body")}>
        <AppProvider>
            {children}
        </AppProvider>
      </body>
    </html>
  );
}
