import type { ClassValue } from 'clsx'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { v4 as uuidv4 } from 'uuid'

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

export function generateId() {
  return uuidv4()
}
