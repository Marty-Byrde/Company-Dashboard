import { twMerge } from 'tailwind-merge'
import { useEffect, useState } from 'react'
import { useDebounce } from 'use-debounce'
import { useTableContext } from '@/components/Shared/Table/Table'
import TableProps, { TableElement } from '@/typings/Shared/Table/Types'

export default function TableSearchBar<T>() {
  const { items: initialItems, searchFilter, setItems } = useTableContext<T>()

  const [searchValue, setSearchValue] = useState<string | undefined>(undefined)
  const [debouncedValue] = useDebounce(searchValue, 500)

  useEffect(() => {
    if (!debouncedValue?.trim()) return setItems(initialItems)

    setItems(initialItems.filter((i) => applySearchFilters(i, debouncedValue, searchFilter)))
  }, [debouncedValue])

  return (
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
  )
}

/**
 * Checks whether an item's property, that is included in the searchFilter, includes the search value
 * @param item One of the initial items that is checked whether the given filter applies.
 * @param searchValue The value that is used to filter the items and that has been entered into the search-input
 * @param filters The properties of an item that are used to filter the items based on that properties.
 * @returns Whether the filter applies to the given item or not.
 */
function applySearchFilters<T>(item: TableElement<T>, searchValue: string, filters: TableProps<T>['searchFilter']) {
  const filteredProperties = Object.keys(item).filter((k) => filters.includes(k as keyof T))
  return filteredProperties.some((k) => {
    const key = k as keyof TableElement<T>
    return item[key].toString().toLowerCase().includes(searchValue.toLowerCase())
  })
}
