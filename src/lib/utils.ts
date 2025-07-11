import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * A utility function to conditionally join class names together.
 * It merges Tailwind CSS classes and resolves conflicts.
 * @param {...ClassValue} inputs - A list of class values to be combined.
 * @returns {string} The combined and merged class name string.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
