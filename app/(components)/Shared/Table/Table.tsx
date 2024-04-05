'use client'

import { createContext, useContext, useState } from 'react'
import TableProps, { TableContext, TableElement } from '@/typings/Shared/Table/Types'
import { once } from 'lodash'
import TableColumns from '@/components/Shared/Table/TableColumns'
import TableItems from '@/components/Shared/Table/TableItems'
import { motion } from 'framer-motion'
import TableSearchBar from '@/components/Shared/Table/TableSearchBar'
import TableSelectionButtons from '@/components/Shared/Table/TableSelectionButtons'

const createGenericTableContext = once(<T,>() => createContext<T>({} as T))

export const useTableContext = <T,>() => useContext<TableContext<T>>(createGenericTableContext())

/**
 * This component renders a table with the given items and their properties.
 * It also provides a search input to filter the items based on their properties.
 * @param initialItems The unfiltered array of items that is to be displayed by the table.
 * @param visibilities Visibility classes for each property of an item, using container-queries.
 * @param searchFilter Takes in the properties of an item as an array, that are then used by the search-input to filter the displayed items.
 * @param labels The labels for each (or partial) item-property of an item, that are displayed as the table headers.
 * @param noDefaultLabels Whether the Table component should provide default labels, based on the property-keys of the items, for the labels that were not provided.
 * @param itemButtons Takes in a functional component that receives the current row's item and returns buttons that are displayed in the last column.
 * @param selectionButtons Buttons that are displayed above the table, that can be used to perform actions on the selected items.
 * @returns
 */
export default function Table<T>(props: TableProps<T>) {
  const Context = createGenericTableContext<TableContext<T>>()
  const ContextProps = useTableProps(props)

  return (
    <Context.Provider value={ContextProps}>
      <div className='wrapper relative @container 2xs:mt-0'>
        <div className='flex items-end justify-end px-1 py-2'>
          <TableSelectionButtons />
          <TableSearchBar className='flex-1' />
        </div>
        <table className='w-full rounded-md'>
          <thead className='bg-gray-700 py-2 text-left dark:bg-neutral-900'>
            <TableColumns />
          </thead>
          <motion.tbody initial='hidden' animate='visible' className='space-y-24 divide-y divide-gray-400 px-2 dark:divide-neutral-500'>
            <TableItems />
          </motion.tbody>
        </table>
      </div>
    </Context.Provider>
  )
}

function useTableProps<T>({ items: initialItems, labels, ...props }: TableProps<T>): TableContext<T> {
  const defaultLabels = Object.keys(initialItems.at(0) ?? {}).reduce((acc, key) => ({ ...acc, [key]: key }), {} as { [key in keyof TableElement<T>]: string })
  labels = Object.assign(props.noDefaultLabels ? {} : defaultLabels, labels)

  const [items, setItems] = useState(initialItems)
  const [selection, setSelection] = useState<TableElement<T>[]>([])

  return {
    initialItems,
    labels,
    items,
    setItems,
    selection,
    setSelection,
    ...props,
  }
}
