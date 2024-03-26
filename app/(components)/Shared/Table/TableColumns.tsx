import { useTableContext } from '@/components/Shared/Table/Table'
import { TableVisibilities } from '@/typings/Shared/Table/Types'
import getKeys from '@/lib/Shared/Keys'
import Each from '@/lib/Shared/Each'
import { twMerge } from 'tailwind-merge'

/**
 * Renders the column headings of table based on the given items or provided labels.
 * In case no labels are provided, the property-keys of the items are used as the column headings.
 * @constructor
 */
export default function TableColumns<T>() {
  const { labels, visibilities, itemButtons, allowSelection } = useTableContext<T>()
  const visiblilty = (key: keyof TableVisibilities<T>) => (visibilities && visibilities.hasOwnProperty(key) ? visibilities[key] : '')

  return (
    <tr className='h-12 space-x-24 text-gray-100 dark:text-gray-200'>
      <th className={twMerge('relative my-2 block h-8 min-w-16', !allowSelection && 'hidden')}>
        <SelectAllCheckbox />
      </th>

      <Each
        items={getKeys(labels)}
        render={(value, index) => (
          <Label
            key={value.toString() + index}
            label={labels[value]!}
            classes={twMerge('pr-2', visiblilty(value as keyof TableVisibilities<T>), index === 0 && !allowSelection && 'pl-4')}
          />
        )}
      />

      {itemButtons && <th className={twMerge('pr-3 text-right', visibilities?.itemButtons)}>Actions</th>}
    </tr>
  )
}

function Label({ label, classes }: { label: string; classes?: string }) {
  return (
    <th key={label.toString() + 'headers'} className={classes}>
      {label.toString()}
    </th>
  )
}

/**
 * Renders a checkbox that de- or selects all the items that are currently displayed in the table.
 */
function SelectAllCheckbox<T>({ className }: { className?: string }) {
  const { items, selection, setSelection, initialItems } = useTableContext<T>()

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
