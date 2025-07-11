import { cn } from "@/lib/utils";

interface SidecarProps {
    children: React.ReactNode;
    className?: string;
}

export function Sidecar({ children, className }: SidecarProps) {
    return (
        <aside className={cn("w-full max-w-sm ml-6 flex flex-col", className)}>
            <div className="glassmorphism p-6 rounded-lg h-full">
                {children}
            </div>
        </aside>
    )
}
