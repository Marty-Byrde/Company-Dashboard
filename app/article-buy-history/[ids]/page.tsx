import { Invoice } from 'hellocash-api/typings/Invoice'
import useBackend from '@/hooks/Shared/Fetch/useBackend'
import Link from 'next/link'
import InvoiceHistoryFeed from '@/components/Shared/Feeds/History/InvoiceHistoryFeed'
import Each from '@/lib/Shared/Each'
import getKeys from '@/lib/Shared/Keys'
import { notFound } from 'next/navigation'
import ListSelectedArticles from '@/components/article-buy-history/[ids]/ListSelectedArticles'

export default async function ArticlesBuyHistoryPage({ params }: { params: { ids?: string } }) {
  const original_invoices = await useBackend<Invoice[]>('/invoices?limit=-1', { next: { revalidate: 3600, tags: ['invoices'] } })

  if (!params.ids) return notFound()
  const ids = params.ids.split('%2C')

  //? Check whether a set of ids is given and whether all the ids are indeed numbers
  if (!ids || ids.length === 0 || ids.map((id) => parseInt(id) > 0).every((v) => !v)) return <div>No Articles were selected...</div>

  const invoices = filterInvoices(original_invoices, ids, 4, true)
  const groupedInvoices = groupInvoices(invoices)

  return (
    <>
      <div className='mb-12'>
        <h1 className='text-xl font-semibold'>Displaying Buy History of the following Products:</h1>
        <h2 className='text-sm dark:text-gray-400'>Showing invoices that are within the last 4 years.</h2>
        <ListSelectedArticles article_ids={ids.map((id) => parseInt(id))} />
      </div>

      <div className='mb-24 flex flex-col gap-16'>
        <Each items={getKeys(groupedInvoices)} render={(customer_name) => <CustomerHistory key={customer_name} invoices={groupedInvoices[customer_name]} />} />
      </div>
    </>
  )
}

/**
 * Shows a container that has a heading displaying the customers-name and renders the history of that customer below based on the given invoices.
 * The customer-name is retrieved from the first invoice-object. It is assumed that the given array has already been filtered by the invoices' customer.
 *
 * @param invoices The array of invoices whoose history is to be displayed.
 * @returns A container that includes a heading with the customer's name and the history based the given invoices.
 */
async function CustomerHistory({ invoices }: { invoices: Invoice[] }) {
  if (invoices.length === 0) return null

  const customer = invoices.at(0)?.customer
  const name = `${customer?.firstName} ${customer?.lastName}`.trim()

  return (
    <div>
      <h2 className='mb-4 text-lg font-semibold'>
        History for:
        <Link className='ml-2 decoration-2 hover:underline' href={`/customer-history/${customer?.id}`}>
          {name ? name : 'Unknown Customer'}
        </Link>
      </h2>
      <InvoiceHistoryFeed invoices={invoices} />
    </div>
  )
}

interface GroupedInvoices {
  [key: string]: Invoice[]
}

/**
 * This function maps through the given invoies and returns an object that maps all the invoices of a customer to a tupel consisting of the customers-firstname and lastname.
 * @param invoices The invoices that are to be grouped.
 * @returns The group-object were all the invoices of a customer are mapped to a tupel consisting of the customers-firstname and lastname.
 */
function groupInvoices(invoices: Invoice[]): GroupedInvoices {
  return invoices.reduce((group: GroupedInvoices, invoice) => {
    const nameTuple = `${invoice.customer?.firstName ?? ''} ${invoice.customer?.lastName ?? ''}`
    const id = nameTuple.trim().length > 0 ? nameTuple : 'Unknown Customer'

    group[id] = group[id] ?? []
    group[id].push(invoice)
    return group
  }, {})
}

/**
 * Filters the invoices by the given parameters
 * @param invoices The invoices to be filtered
 * @param product_ids Filters the invoices by their items, thus only invoices that contain the given product_ids remain
 * @param year_difference The max. difference in years between the current year and the invoice's year
 * @param givenProductsOnly If true, only the requested products whoose ids match the given ids in the remaining invoices remain
 */
function filterInvoices(invoices: Invoice[], product_ids: string[] = [], year_difference: number = 3, givenProductsOnly: boolean = false) {
  //? Only valid invoices
  invoices = invoices.filter((i) => !!i.customer)

  //? Filter out those invoices that have the requested items / articles
  invoices = invoices.filter((i) => i.items.filter((item) => product_ids.includes(item.id.toString())).length > 0)

  //? Only invoices of the past <year_difference> years
  invoices = invoices.filter((i) => new Date(i.timestamp).getFullYear() >= new Date().getFullYear() - Math.abs(year_difference))

  if (givenProductsOnly) {
    //? remove the items that are not in the requested list
    invoices = invoices.map((i) =>
      Object.assign({}, i, {
        items: i.items.filter((item) => product_ids.includes(item.id.toString())),
      }),
    )
  }

  return invoices
}
