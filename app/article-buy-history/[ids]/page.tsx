import { Invoice } from 'hellocash-api/typings/Invoice'
import Link from 'next/link'
import InvoiceHistoryFeed from '@/components/Shared/Feeds/History/InvoiceHistoryFeed'
import Each from '@/lib/Shared/Each'
import getKeys from '@/lib/Shared/Keys'
import ListSelectedArticles from '@/components/article-buy-history/[ids]/ListSelectedArticles'
import parseArticleHistoryParams from '@/lib/articles/[ids]/parseArticleHistoryParams'

const MAX_YEARS_DIFFERENCE = 4

export default async function ArticlesBuyHistoryPage({ params: searchParams }: { params: { ids?: string } }) {
  const { invoices, ids } = await parseArticleHistoryParams({
    searchParams,
    setFilter: (ids) => ({ includesItemsOnly: ids, maxYears: MAX_YEARS_DIFFERENCE, hasCustomer: true }),
  })

  const groupedInvoices = groupInvoices(invoices)

  return (
    <>
      <div className='mb-12'>
        <h1 className='text-xl font-semibold'>Displaying Buy History of the following Products:</h1>
        <h2 className='text-sm dark:text-gray-400'>Showing invoices that are within the last {MAX_YEARS_DIFFERENCE} years.</h2>
        <ListSelectedArticles article_ids={ids} />
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
