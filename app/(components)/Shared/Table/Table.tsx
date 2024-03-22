'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useDebounce } from 'use-debounce'
import { twMerge } from 'tailwind-merge'
import TableProps, { TableContext, TableElement } from '@/typings/Shared/Table/Types'
import { once } from 'lodash'
import TableColumnLabels from '@/components/Shared/Table/TableColumnLabels'
import TableItems from '@/components/Shared/Table/TableItems'

const createGenericTableContext = once(<T,>() => createContext<T>({} as T))

export const useTableContext = <T,>() => useContext<TableContext<T>>(createGenericTableContext())

/**
 * This component renders a table with the given items and their properties.
 * It also provides a search input to filter the items based on their properties.
 * @param initialItems The unfiltered array of items that is to be displayed by the table.
 * @param visibilities Visibility classes for each property of an item, using container-queries.
 * @param searchFilter Takes in the properties of an item as an array, that are then used by the search-input to filter the displayed items.
 * @param labels The labels for each (or partial) item-property of an item, that are displayed as the table headers.
 * @returns
 */
export default function Table<T>({ items: initialItems, visibilities, searchFilter, labels, noDefaultLabels }: TableProps<T>) {
  const Context = createGenericTableContext<TableContext<T>>()
  type Item = TableElement<T>
  const defaultLabels = Object.keys(initialItems[0]).reduce((acc, key) => ({ ...acc, [key]: key }), {} as { [key in keyof Item]: string })

  const [items, setItems] = useState(initialItems)
  const [selected, setSelected] = useState<Item[]>([])
  const [searchValue, setSearchValue] = useState<string | undefined>(undefined)
  const isSelected = (item: Item) => !!selected.find((i) => i.id === item.id)
  const [debouncedValue] = useDebounce(searchValue, 500)

  useEffect(() => {
    if (debouncedValue === undefined) return
    if (debouncedValue.trim().length === 0) return setItems(initialItems)

    setItems(initialItems.filter((i) => applyFilters(i, debouncedValue, searchFilter)))
  }, [debouncedValue])

  return (
    <Context.Provider
      value={{
        labels: Object.assign(noDefaultLabels ? {} : defaultLabels, labels),
        visibilities,
        items,
        initialItems,
        selection: selected,
        setSelection: setSelected,
        searchFilter,
        isSelected,
      }}>
      <div className='wrapper relative mt-12 @container 2xs:mt-0'>
        {/*<TableSelectionButtons selection={selected} />*/}
        <div className={twMerge('mb-1 hidden flex-1 items-center justify-end gap-4 @2xs:flex')}>
          <label htmlFor='table-search text-sm' className='min-w-0'>
            Suche:
          </label>
          <input
            id='table-search'
            onChange={({ target: { value } }) => setSearchValue(value)}
            className='max-w-24 flex-1 rounded-md px-3 py-1.5 text-sm shadow-sm @sm:max-w-32 @md:max-w-48 @2xl:max-w-sm dark:bg-neutral-700 dark:shadow-neutral-600'
          />
        </div>
        <table className='w-full rounded-md'>
          <thead className='bg-gray-700 py-2 text-left dark:bg-neutral-900'>
            <tr className='space-x-24 text-gray-100 dark:text-gray-200'>
              <th className='relative my-2 block h-8 min-w-16'>
                <SelectAllCheckbox />
              </th>

              <TableColumnLabels />
            </tr>
          </thead>
          <tbody className='space-y-24 divide-y divide-gray-400 px-2 dark:divide-neutral-500'>
            <TableItems />
          </tbody>
        </table>
      </div>
    </Context.Provider>
  )
}

/**
 * Checks whether an item's property, that is included in the searchFilter, includes the search value
 * @param item One of the initial items that is checked whether the given filter applies.
 * @param searchValue The value that is used to filter the items and that has been entered into the search-input
 * @param filters The properties of an item that are used to filter the items based on that properties.
 * @returns Whether the filter applies to the given item or not.
 */
function applyFilters<T>(item: TableElement<T>, searchValue: string, filters: TableProps<T>['searchFilter']) {
  const filteredProperties = Object.keys(item).filter((k) => filters.includes(k as keyof T))
  return filteredProperties.some((k) => {
    const key = k as keyof TableElement<T>
    return item[key].toString().toLowerCase().includes(searchValue.toLowerCase())
  })
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
