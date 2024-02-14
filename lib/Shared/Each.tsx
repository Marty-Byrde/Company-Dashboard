export default function Each<T>({ items, render }: { items?: Array<T>; render(item: T, index: number): React.ReactNode }) {
  return <>{items?.map((item, index) => render(item, index))}</>
}
