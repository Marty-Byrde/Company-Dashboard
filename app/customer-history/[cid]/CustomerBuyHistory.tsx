import { Invoice } from 'hellocash-api/typings/Invoice'
import { Customer } from 'hellocash-api/typings/Customer'
import Each from '@/lib/Shared/Each'
import { formatDate, formatDistance } from 'date-fns'
import { CheckCircleIcon } from '@heroicons/react/24/solid'
import FeedContainer from '@/components/Shared/Feeds/FeedContainer'
import Feed from '@/components/Shared/Feeds/Feed'
import MinorFeed from '@/components/Shared/Feeds/MinorFeed'

/**
 * Displays a list of invoices of a given customer and the items that were bought in each invoice.
 * @param customer The customer whoos history shall be displayed
 * @constructor
 */
export default async function CustomerBuyHistory({ customer }: { customer: Customer; invoices?: Invoice[] }) {
  let invoices = await fetch(`${process.env.BACKEND}/invoices?limit=-1`, { next: { revalidate: 3600 * 24, tags: ['invoices'] } })
    .then((res) => res.json())
    .then((json) => json as Invoice[])
  invoices = invoices.filter((i) => i.customer?.id == customer.id)

  return (
    <>
      <FeedContainer>
        <Each
          items={invoices}
          render={(invoice, index) => (
            <>
              <Feed
                key={invoice.id}
                link={`/invoice/${invoice.id}`}
                icon={<CheckCircleIcon className='h-6 w-6 rounded-full text-indigo-600 dark:bg-neutral-700 dark:text-green-500 dark:ring-2 dark:ring-green-500/30' />}
                title={'#' + invoice.id.toString()}
                description={`${customer.firstName} ${customer.lastName} bought the following item${invoice.items.length > 1 && 's'}:`}
                date={`${formatDistance(invoice.timestamp, new Date())} ago`}
              />

              <FeedContainer>
                <Each
                  items={invoice.items.filter((i) => !i.name.toLowerCase().includes('versand'))}
                  render={(item, item_index) => (
                    <MinorFeed
                      key={invoice.id + '-' + item.id + '-' + item_index}
                      description={item.name}
                      title={`Quantity: ${item.quantity}x`}
                      single={invoice.items.filter((i) => !i.name.toLowerCase().includes('versand')).length === 1}
                      last={index === invoices.length - 1}
                      date={formatDate(invoice.timestamp, 'dd.mm.yyyy')}
                    />
                  )}
                />
              </FeedContainer>
            </>
          )}
        />
      </FeedContainer>
    </>
  )
}
