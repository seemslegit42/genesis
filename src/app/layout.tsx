import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { cn } from '@/lib/utils';
import { Comfortaa, Lexend } from 'next/font/google';

export const metadata: Metadata = {
  title: 'BEEP: Genesis',
  description: 'A cognitive and operational sanctuary.',
};

const comfortaa = Comfortaa({
  subsets: ['latin'],
  variable: '--font-comfortaa',
  weight: ['400', '700'],
});

const lexend = Lexend({
  subsets: ['latin'],
  variable: '--font-lexend',
});


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={cn("font-body antialiased", comfortaa.variable, lexend.variable, "min-h-screen")}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
