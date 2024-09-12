import { useTableContext } from '@/components/Shared/Table/Table'
import { TableElement } from '@/typings/Shared/Table/Types'
import { twMerge } from 'tailwind-merge'
import Each from '@/lib/Shared/Each'
import getKeys from '@/lib/Shared/Keys'
import React from 'react'
import useTableSelection from '@/hooks/Table/useTableSelection'
import { motion } from 'framer-motion'

const animationVariants = {
  hidden: { opacity: 0, y: -24, borderStyle: 'dotted' },
  visible: (i: number) => ({
    y: 0,
    opacity: 1,
    borderStyle: 'solid',
    transition: {
      delay: i > 50 ? 50 * 0.02 : i * 0.02, // staggered effect with an incremental delay, capped at 50
    },
  }),
}

export default function TableItems<T>() {
  const { items } = useTableContext<T>()
  const { isSelected, toggleSelection } = useTableSelection<T>()

  return Each({
    items,
    render: (item, index: number) => (
      <motion.tr
        custom={index}
        variants={animationVariants}
        key={item.id.toString() + index.toString()}
        onClick={toggleSelection(item)}
        className={twMerge(
          'h-12 px-4 transition-colors duration-200 dark:text-gray-300 dark:hover:bg-neutral-700',
          isSelected(item) && 'dark:bg-neutral-700/60 dark:text-gray-100 dark:hover:bg-neutral-700',
        )}>
        <SelectCheckBox item={item} />
        <TableItem item={item} />
        <ItemButtons item={item} />
      </motion.tr>
    ),
  })
}

function SelectCheckBox<T>({ item }: { item: TableElement<T> }) {
  const { isSelected, toggleSelection } = useTableSelection<T>()
  const { allowSelection } = useTableContext<T>()

  return (
    <td className={twMerge('relative min-w-12', !allowSelection && 'hidden')}>
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
  const { labels, visibilities, allowSelection } = useTableContext<T>()

  return Each({
    items: getKeys(labels),
    render: (key, index) => (
      <td key={item.id.toString() + key.toString() + index} className={twMerge('pr-2', visibilities ? visibilities[key] : '', !allowSelection && index === 0 && 'pl-4')}>
        {item[key]}
      </td>
    ),
  })
}

function ItemButtons<T>({ item }: { item: TableElement<T> }) {
  const { itemButtons: buttons, visibilities } = useTableContext<T>()

  if (!buttons) return null

  return <td className={twMerge(visibilities?.itemButtons)}>{buttons({ item })}</td>
}
