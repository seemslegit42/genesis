
import { ReactNode } from 'react';
import Link from 'next/link';
import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { Home, Users } from 'lucide-react';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-20 w-full glassmorphism h-[70px] border-b border-border/30">
        <div className="flex items-center justify-between h-full w-full max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <Logo className="h-6 w-auto" />
              <span className="font-headline text-lg text-primary">/</span>
              <span className="font-headline text-lg">Admin</span>
            </Link>
          </div>
          <nav className="flex items-center gap-2">
             <Button variant="ghost" asChild>
                <Link href="/admin">
                    <Home className="h-4 w-4 mr-2" />
                    Dashboard
                </Link>
            </Button>
            <Button variant="ghost" asChild>
                <Link href="/admin/users">
                    <Users className="h-4 w-4 mr-2" />
                    User Management
                </Link>
            </Button>
          </nav>
        </div>
      </header>
      <main className="flex-1 p-4 sm:p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
