import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Injects f_auto,q_auto into Cloudinary URLs for optimised delivery. Non-Cloudinary URLs pass through unchanged. */
export function cloudinaryUrl(src: string, transforms = "f_auto,q_auto"): string {
  if (!src.includes("res.cloudinary.com")) return src;
  // Insert transforms after /upload/
  return src.replace(/\/upload\//, `/upload/${transforms}/`);
}
