import { cn } from "@/lib/utils";

/**
 * Props for the Sidecar component.
 * @interface SidecarProps
 */
interface SidecarProps {
    /** The content to be rendered inside the sidecar panel. */
    children: React.ReactNode;
    /** Optional additional class names for custom styling. */
    className?: string;
}

/**
 * A persistent panel that docks to the side of the screen, acting as a "Sidecar Micro-App".
 * It is used to display contextual information or the next step in a guided task,
 * serving as the user's "true north" during a complex workflow. This prevents the user
 * from losing their place and reduces the cognitive load of remembering the next step.
 * @param {SidecarProps} props The props for the component.
 * @returns {JSX.Element} The rendered sidecar panel.
 */
export function Sidecar({ children, className }: SidecarProps) {
    return (
        <aside className={cn("w-full max-w-sm ml-6 flex flex-col", className)}>
            <div className="glassmorphism p-6 rounded-lg h-full">
                {children}
            </div>
        </aside>
    )
}
