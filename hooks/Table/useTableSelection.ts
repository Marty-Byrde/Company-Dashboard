'use client'

import { useTableContext } from '@/components/Shared/Table/Table'

export default function useTableSelection<T>() {
  const { items, selection, setSelection, allowSelection } = useTableContext<T>()

  const isSelected = (item: (typeof items)[number]) => !!selection.find((i) => i.id === item.id)
  const toggleSelection = (item: (typeof items)[number]) => () =>
    allowSelection ? setSelection((prev) => (isSelected(item) ? prev.filter((a) => a.id !== item.id) : [...prev, item])) : null

  return { isSelected, toggleSelection }
}
