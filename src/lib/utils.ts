import type { ClassValue } from 'clsx'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: Array<ClassValue>) {
  return twMerge(clsx(inputs))
}

export function arrayMove<T>(
  arr: Array<T>,
  from: number,
  to: number,
): Array<T> {
  const newItems = [...arr]
  const [removed] = newItems.splice(from, 1)
  newItems.splice(to, 0, removed)
  return newItems
}
