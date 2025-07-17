
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

interface InvocationCardProps {
  title: string;
  description: string;
  onClick: () => void;
  sigil: React.ReactNode;
}

export function InvocationCard({ title, description, onClick, sigil }: InvocationCardProps) {
  return (
    <Card className="group relative glassmorphism h-full flex flex-col overflow-hidden transition-all duration-300 hover:shadow-primary/20 hover:shadow-2xl hover:-translate-y-2">
      <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse group-hover:animate-none" />
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-primary/50 transition-colors duration-300 rounded-lg" />

      <CardHeader className="items-center text-center p-8">
        <div className="w-24 h-24 mb-6 text-primary transition-all duration-500 group-hover:text-primary group-hover:drop-shadow-[0_0_20px_hsl(var(--primary))]">
          {sigil}
        </div>
        <CardTitle className="font-headline text-2xl">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col justify-between text-center px-6 pb-6">
        <CardDescription className="text-base text-muted-foreground mb-6">
          {description}
        </CardDescription>
        <div className="relative h-10">
          <Button
            onClick={onClick}
            variant="outline"
            className={cn(
              "absolute inset-x-0 bottom-0 w-full transition-all duration-300 opacity-0 group-hover:opacity-100 border-primary/50 text-primary",
              "hover:bg-primary hover:text-primary-foreground hover:shadow-lg hover:shadow-primary/30"
            )}
          >
            Commit
          </Button>
           <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-300 opacity-100 group-hover:opacity-0">
                <span className="font-bold text-xs tracking-widest text-muted-foreground/50">SELECT</span>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
