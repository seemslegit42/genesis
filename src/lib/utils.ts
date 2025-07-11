import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * A utility function to conditionally join class names together.
 * It uses 'clsx' to handle conditional classes and 'tailwind-merge' 
 * to intelligently merge Tailwind CSS classes and resolve conflicts.
 * This is essential for building reusable and customizable components.
 * @param {...ClassValue} inputs - A list of class values to be combined. These can be strings, objects, or arrays.
 * @returns {string} The combined and merged class name string.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
