import { ReactNode } from 'react'

export default function Each<T>({ items, render }: { items?: Array<T>; render(item: T, index: number): ReactNode }) {
  return items?.map((item, index) => render(item, index))
}
