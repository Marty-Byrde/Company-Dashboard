import { Invoice } from 'hellocash-api/typings/Invoice'
import Each from '@/lib/Shared/Each'
import { formatDate, formatDistance } from 'date-fns'
import { CheckCircleIcon } from '@heroicons/react/24/solid'
import FeedContainer from '@/components/Shared/Feeds/FeedContainer'
import Feed from '@/components/Shared/Feeds/Feed'
import MinorFeed from '@/components/Shared/Feeds/MinorFeed'
import { ReactNode } from 'react'

const defaultInvoiceDescription = (invoice: Invoice) => {
  const name = `${invoice?.customer?.firstName ?? ''} ${invoice?.customer?.lastName ?? ''}`.trim()
  return `${name ? name : '?'} bought the following item${invoice?.items?.length > 1 ? 's' : ''}`
}

const defaultInvoiceIcon = (invoice: Invoice) => (
  <CheckCircleIcon className='h-6 w-6 rounded-full text-indigo-600 dark:bg-neutral-700 dark:text-green-500 dark:ring-2 dark:ring-green-500/30' />
)

/**
 * Displays a list of invoices in the form of feeds. Each feed contains the invoice number, the customer who bought the items and the items of the invoice themselves.
 * @param invoices The invoices that are to be displayed. The invoices should be filtered to only contain by the customer in question.
 * @param showItems Whether the items of the invoice should be displayed in a feed as well
 * @param invoiceDescription A function that returns a custom description for each invoice.
 * @constructor
 */
export default async function InvoiceHistoryFeed({
  invoices,
  showItems = true,
  invoiceDescription = defaultInvoiceDescription,
  invoiceIcon = defaultInvoiceIcon,
}: {
  invoices: Invoice[]
  showItems?: boolean
  invoiceDescription?: (invoice: Invoice) => string
  invoiceIcon?: (invoice: Invoice) => ReactNode
}) {
  return (
    <FeedContainer>
      <Each
        items={invoices}
        render={(invoice, index) => (
          <>
            <Feed
              key={invoice.id}
              link={`/invoices/pdf/${invoice._id}`}
              icon={invoiceIcon(invoice)}
              title={'#' + invoice.id.toString()}
              description={invoiceDescription(invoice)}
              date={`${formatDistance(invoice.timestamp, new Date())} ago`}
            />

            <InvoiceItemFeed show={showItems} invoice={invoice} isLast={index === invoices.length - 1} />
          </>
        )}
      />
    </FeedContainer>
  )
}

/**
 * Displays the items of an invoice in the form of feeds.
 * @param invoice The invoice whose items are to be displayed.
 * @param isLast Whether the invoice is the last one in the list of invoices.
 * @param show Whether the items should be displayed.
 */
function InvoiceItemFeed({ invoice, isLast, show }: { invoice: Invoice; isLast: boolean; show?: boolean }) {
  if (!show) return null

  return (
    <FeedContainer>
      <Each
        items={invoice.items.filter((i) => !i.name.toLowerCase().includes('versand'))}
        render={(item, item_index) => (
          <MinorFeed
            key={invoice.id + '-' + item.id + '-' + item_index}
            description={item.name}
            title={`Quantity: ${item.quantity}x`}
            single={invoice.items.filter((i) => !i.name.toLowerCase().includes('versand')).length === 1}
            last={isLast}
            date={formatDate(invoice.timestamp, 'dd. MMM yyyy')}
          />
        )}
      />
    </FeedContainer>
  )
}
