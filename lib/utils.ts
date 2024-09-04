import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatErrorCode(code: string) {
  return code.replace(/_/g, ' ')
}

// TODO : faulty function , solve it
export function extractDomainName(email: string): string {
  return email.slice(email.indexOf('@') + 1).split('.')[0];
}