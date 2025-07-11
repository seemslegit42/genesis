import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { cn } from '@/lib/utils';
import { Audiowide } from 'next/font/google';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { TypographicStateProvider } from '@/hooks/use-typographic-state.tsx';

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
    <html lang="en" className={cn("dark", GeistSans.variable, GeistMono.variable, fontInscription.variable)}>
      <body className={cn("font-body antialiased", "min-h-screen")}>
        <TypographicStateProvider>
            {children}
        </TypographicStateProvider>
        <Toaster />
      </body>
    </html>
  );
}
