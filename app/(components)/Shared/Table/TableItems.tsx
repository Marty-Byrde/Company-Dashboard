import { useTableContext } from '@/components/Shared/Table/Table'
import { TableElement } from '@/typings/Shared/Table/Types'
import { twMerge } from 'tailwind-merge'
import Each from '@/lib/Shared/Each'
import getKeys from '@/lib/Shared/Keys'
import React from 'react'

export default function TableItems<T>() {
  const { items, isSelected, setSelection } = useTableContext<T>()
  const toggleSelection = (item: TableElement<T>) => () => setSelection((prev) => (isSelected(item) ? prev.filter((a) => a.id !== item.id) : [...prev, item]))

  return Each({
    items,
    render: (item, index: number) => (
      <tr
        key={item.id.toString() + index.toString()}
        onClick={toggleSelection(item)}
        className={twMerge('h-12 px-4 transition-colors duration-200 dark:hover:bg-neutral-700', isSelected(item) && 'dark:bg-neutral-700/60 dark:hover:bg-neutral-700')}>
        <SelectCheckBox item={item} />
        <TableItem item={item} />
      </tr>
    ),
  })
}

function SelectCheckBox<T>({ item }: { item: TableElement<T> }) {
  const { isSelected, setSelection } = useTableContext<T>()
  const toggleSelection = (item: TableElement<T>) => () => setSelection((prev) => (isSelected(item) ? prev.filter((a) => a.id !== item.id) : [...prev, item]))

  return (
    <td className='relative min-w-12'>
      {isSelected(item) && <div className='absolute inset-y-0 left-0 w-0.5 bg-indigo-600 dark:bg-fuchsia-700' />}

      <input
        type='checkbox'
        className='absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded-md border-gray-300 text-indigo-600 hover:cursor-pointer focus:ring-indigo-600 dark:bg-neutral-600 dark:text-fuchsia-700 dark:checked:bg-fuchsia-700 dark:focus:ring-fuchsia-700'
        value={item.id}
        checked={isSelected(item)}
        onChange={toggleSelection(item)}
      />
    </td>
  )
}

function TableItem<T>({ item }: { item: TableElement<T> }) {
  const { labels, visibilities } = useTableContext<T>()

  return Each({
    items: getKeys(labels),
    render: (key, index) => (
      <td key={item.id.toString() + key.toString() + index} className={twMerge(visibilities ? visibilities[key] : '')}>
        {item[key]}
      </td>
    ),
  })
}
