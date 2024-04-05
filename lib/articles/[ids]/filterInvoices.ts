import { Invoice } from 'hellocash-api/typings/Invoice'
import { Customer } from 'hellocash-api/typings/Customer'
import getKeys from '@/lib/Shared/Keys'

/**
 * The options that can be used to filter invoices.
 */
interface InvoiceFilterOptions {
  maxYears?: number
  hasItems?: boolean
  hasCustomer?: boolean

  includesItems?: Array<Invoice['items'][number]['id']>
  includesItemsOnly?: Array<Invoice['items'][number]['id']>
  includesCustomers?: Array<Customer['id']>
  custom?: (invoice: Invoice) => boolean
}

/**
 * The parameters that are used to filter invoices.
 */
export interface FilterInvoicesParams {
  invoices: Invoice[]
  filter?: InvoiceFilterOptions
}

/**
 * Filters the given invoices based on the given filter.
 * @param invoices The invoices that are to be filtered.
 * @param filter The filter that is used to filter the invoices.
 */
export default function filterInvoices({ invoices, filter }: FilterInvoicesParams) {
  if (!filter) return invoices

  for (let key of getKeys(filter)) {
    if (!filter[key]) continue

    invoices = applyFilter(invoices, key, filter[key]!)
  }

  return invoices
}

/**
 * Applies a filter to the given invoices.
 * @param invoices The invoices that are to be filtered.
 * @param key The key of the filter that is to be applied.
 * @param value The value of the filter that is to be applied and or used.
 */
function applyFilter<K extends keyof InvoiceFilterOptions>(invoices: Invoice[], key: K, value: InvoiceFilterOptions[K]) {
  switch (key) {
    case 'maxYears':
      return invoices.filter((i) => {
        const now = new Date(Date.now()).getFullYear()
        const year = new Date(Date.parse(i.timestamp.toString()))?.getFullYear()

        // @ts-ignore
        return now - year <= value
      })

    case 'hasItems':
      return invoices.filter((i) => !!i.items.length)

    case 'hasCustomer':
      return invoices.filter((i) => !!i.customer)

    case 'includesItems':
      // @ts-ignore
      return invoices.filter((i) => i.items.some((item) => value.includes(item.id)))

    case 'includesItemsOnly':
      // @ts-ignore
      invoices = invoices.filter((i) => i.items.some((item) => value.includes(item.id)))

      // @ts-ignore
      return invoices.map((i): Invoice => Object.assign({}, i, { items: i.items.filter((item) => value.includes(item.id)) }))

    case 'includesCustomers':
      // @ts-ignore
      return invoices.filter((i) => value.includes(i.customer.id))

    case 'custom':
      // @ts-ignore
      return invoices.filter((i) => value(i))

    default:
      return invoices
  }
}
