import ReactState from '@/typings/ReactState'
import { ReactNode } from 'react'

/**
 * This interface represents the visibility-classes type that takes in each partial keys of a
 * generic type were a classes can be assigned for that key / property.
 */
export type TableVisibilities<T> = { itemButtons?: string } & {
  [key in keyof T]?: string
}

/**
 * This interface represents a table-item and defines the properties a generic type and extends
 * an id property of type string | number, that is used for the key-properties.
 */
export type TableElement<T> = { id: string | number } & {
  [key in keyof T]: any
}

/**
 * This interface takes in an array of property-keys of a given generic-type.
 * It is used to filter the items based on their properties when the user types in the search input.
 */
export interface SearchFilter<T> extends Array<keyof T> {}

/**
 * This interface represents the props of the Table component and takes in a generic type.
 * It includes the items that are displayed in the table, the labels for each property of the items,
 * the visibilities for each property of the items and the searchFilter that is used to filter the items
 * based on their properties.
 */
export default interface TableProps<T> {
  items: TableElement<T>[]
  labels?: { [key in keyof TableElement<T>]?: string }
  visibilities?: TableVisibilities<T>
  searchFilter: SearchFilter<T>
  noDefaultLabels?: boolean

  selectionButtons?: ReactNode | ReactNode[]
  itemButtons?: (item: TableElement<T>) => ReactNode
}

export interface TableContext<T> extends TableProps<T> {
  setItems: ReactState<TableProps<T>['items']>['setState']
  initialItems: TableProps<T>['items']

  labels: { [key in keyof TableElement<T>]?: string }
  selection: TableElement<T>[]
  setSelection: ReactState<TableProps<T>['items']>['setState']
}
