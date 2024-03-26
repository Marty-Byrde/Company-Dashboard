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
export default function TableColumnLabels<T>() {
  const { labels, visibilities, itemButtons, allowSelection } = useTableContext<T>()
  const visiblilty = (key: keyof TableVisibilities<T>) => (visibilities && visibilities.hasOwnProperty(key) ? visibilities[key] : '')

  return (
    <>
      <Each
        items={getKeys(labels)}
        render={(value, index) => (
          <Label key={value.toString() + index} label={labels[value]!} classes={`${visiblilty(value as keyof TableVisibilities<T>)} ${index === 0 && !allowSelection && 'pl-4'}`} />
        )}
      />

      {itemButtons && <th className={twMerge('pr-3 text-right', visibilities?.itemButtons)}>Actions</th>}
    </>
  )
}

function Label({ label, classes }: { label: string; classes?: string }) {
  return (
    <th key={label.toString() + 'headers'} className={classes}>
      {label.toString()}
    </th>
  )
}
