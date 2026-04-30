import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Injects f_auto,q_auto into Cloudinary URLs for optimised delivery. Non-Cloudinary URLs pass through unchanged. */
