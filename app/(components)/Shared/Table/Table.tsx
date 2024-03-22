'use client'

import { createContext, useContext, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import TableProps, { TableContext, TableElement } from '@/typings/Shared/Table/Types'
import { once } from 'lodash'
import TableColumnLabels from '@/components/Shared/Table/TableColumnLabels'
import TableItems from '@/components/Shared/Table/TableItems'
import TableSearchBar from '@/components/Shared/Table/TableSearchBar'
import { motion } from 'framer-motion'

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
 * @returns
 */
export default function Table<T>({ items: initialItems, visibilities, searchFilter, labels, noDefaultLabels }: TableProps<T>) {
  const Context = createGenericTableContext<TableContext<T>>()
  type Item = TableElement<T>
  const defaultLabels = Object.keys(initialItems[0]).reduce((acc, key) => ({ ...acc, [key]: key }), {} as { [key in keyof Item]: string })

  const [items, setItems] = useState(initialItems)
  const [selected, setSelected] = useState<Item[]>([])

  return (
    <Context.Provider
      value={{
        labels: Object.assign(noDefaultLabels ? {} : defaultLabels, labels),
        initialItems,
        items,
        setItems,
        visibilities,
        selection: selected,
        setSelection: setSelected,
        searchFilter,
      }}>
      <div className='wrapper relative mt-12 @container 2xs:mt-0'>
        <TableSearchBar />
        <table className='w-full rounded-md'>
          <thead className='bg-gray-700 py-2 text-left dark:bg-neutral-900'>
            <tr className='space-x-24 text-gray-100 dark:text-gray-200'>
              <th className='relative my-2 block h-8 min-w-16'>
                <SelectAllCheckbox />
              </th>

              <TableColumnLabels />
            </tr>
          </thead>
          <motion.tbody initial='hidden' animate='visible' className='space-y-24 divide-y divide-gray-400 px-2 dark:divide-neutral-500'>
            <TableItems />
          </motion.tbody>
        </table>
      </div>
    </Context.Provider>
  )
}

/**
 * Renders a checkbox that de- or selects all the items that are currently displayed in the table.
 */
function SelectAllCheckbox<T>({ className }: { className?: string }) {
  const { items, selection, setSelection, initialItems } = useContext<TableContext<T>>(createGenericTableContext())

  return (
    <input
      type='checkbox'
      className={twMerge(
        'absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded-md border-gray-300 text-indigo-600 hover:cursor-pointer focus:ring-indigo-600 dark:bg-neutral-600 dark:text-fuchsia-700 dark:checked:bg-fuchsia-700 dark:focus:ring-fuchsia-700',
        className,
      )}
      checked={selection.length === initialItems.length || items.map((i) => !!selection.find((s) => s.id === i.id)).every(Boolean)}
      onChange={() =>
        setSelection((prev) => {
          //* The displayed articles are a subset of the initial articles, as a search is active
          if (items.length !== initialItems.length) {
            //? if all the displayed articles are selected and the total-checkbox is clicked, then the displayed articles are removed from the selection.
            if (items.map((i) => !!selection.find((s) => s.id === i.id)).every(Boolean)) {
              return prev.filter((a) => !items.find((i) => i.id === a.id))
            }

            //? if not all the displayed articles are selected and the total-checkbox is clicked, then the displayed articles are added to the selection.
            return [...prev, ...items.filter((i) => !prev.find((s) => s.id === i.id))]
          }

          //? When all the articles are displayed, thus no search is active, we can simply toggle the selection of all articles.
          return prev.length === initialItems.length ? [] : initialItems
        })
      }
    />
  )
}
