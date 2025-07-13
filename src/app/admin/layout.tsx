
import { ReactNode } from 'react';
import Link from 'next/link';
import { Logo } from '@/components/logo';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-20 w-full glassmorphism h-[70px]">
        <div className="flex items-center justify-between h-full w-full max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <Logo className="h-6 w-auto" />
              <span className="font-headline text-lg text-primary">/</span>
              <span className="font-headline text-lg">Admin</span>
            </Link>
          </div>
          <nav>
            <Link href="/admin/users" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              User Management
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}
