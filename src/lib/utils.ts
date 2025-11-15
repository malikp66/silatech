import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge conditional class names (shadcn helper).
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

