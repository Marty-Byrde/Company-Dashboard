'use client'
import Order from 'woocommerce-utils/helper/typings/Order'
import { ArrowTopRightOnSquareIcon, Cog6ToothIcon } from '@heroicons/react/24/outline'
import { useCustomerSlideOverContext } from '@/components/orders/RegistrationProvider'
import { useSlideOver } from '@/components/Shared/Slideover/SlideoverProvider'
import structureClasses from '@/lib/Shared/structureClasses'
import { twMerge } from 'tailwind-merge'
import Link from 'next/link'
import convertContactInformations from '@/lib/orders/ConvertContactInformations'

/**
 * The visibilities of the order fields and headers.
 */
const visibilities = {
  id: 'min-w-12',
  status: 'hidden @lg:block @xl:min-w-[6.5rem]',
  date: 'hidden @3xl:block min-w-[5.5rem]',
  name: 'overflow-hidden  flex-1',
  total: 'hidden @4xl:block min-w-24',
  actions: 'min-w-12 @2xl:min-w-[9rem]',
}

/**
 * Displays the order information in a row.
 * @param order The woocommerce-order that is to be displayed
 * @param domain The domain of the woocommerce-dashboard that is used to open the order, were only the post argument is missing
 * @constructor
 */
export default function DisplayOrder({ order, href }: { order: Order; href: string }) {
  const { setOrder, setCustomer } = useCustomerSlideOverContext()
  const { setOpen } = useSlideOver()

  const OpenButton = () => {
    return (
      <Link target='_blank' href={href} className='mx-1 my-1 rounded-md border px-2 py-2 @2xl:m-0 @2xl:px-4 dark:border-gray-500'>
        <ArrowTopRightOnSquareIcon width={16} height={16} className='block @2xl:hidden' />
        <span className='hidden @2xl:block'>Open</span>
      </Link>
    )
  }

  const EditButton = () => {
    const onClick = () => {
      setOrder(order)
      setCustomer(convertContactInformations(order.billing))
      setOpen(true)
    }

    // the margin ensures that the height of each order-element stays the same.
    return (
      <button onClick={onClick} className='mx-1 my-1 rounded-md px-2 py-2 @2xl:m-0 @2xl:px-4 dark:bg-blue-600'>
        <Cog6ToothIcon width={16} height={16} className='block @2xl:hidden' />
        <span className='hidden @2xl:block'>Edit</span>
      </button>
    )
  }

  return (
    <div className='group flex w-full items-center gap-4 rounded-md px-3 py-2 ring-1 transition-all duration-500 @lg:gap-8 dark:ring-gray-500 dark:hover:bg-neutral-700/80'>
      <div className={twMerge('text-sm font-semibold', visibilities.id)}>#{order.id}</div>
      <div className={twMerge(visibilities.status)}>
        <StatusIcon status={order.status} />
      </div>
      <div className={visibilities.date}>
        <span>
          {order.date_created
            .toLocaleDateString('de')
            .split('.')
            .map((el) => (el.length === 1 ? '0' + el : el))
            .join('.')}
        </span>
      </div>
      <div className={twMerge('flex gap-2', visibilities.name)}>
        <span hidden={order.billing.title_formatted.length === 0}>{order.billing.title_formatted}</span>
        <span>{order.billing.first_name}</span>
        <span>{order.billing.last_name}</span>
      </div>

      <div className={visibilities.total}>
        <span>{order.checkout.total.toFixed(2)} €</span>
      </div>

      <div className='flex gap-2'>
        <OpenButton />
        <EditButton />
      </div>
    </div>
  )
}

/**
 * Returns the 'column' headers for the fields of each order.
 */
export function DisplayOrderHeaders({ className }: { className?: string }) {
  return (
    <div className='@container'>
      <div className={twMerge('flex w-full gap-4 rounded-t-md px-3 py-2 font-semibold @lg:gap-8 dark:bg-neutral-900/80', className)}>
        <span className={visibilities.id}>Nr.</span>
        {/*the margins classes are used to center the status-column-label when the indicator is shown, then to align it with status idicator and status-label*/}
        <span className={twMerge(visibilities.status, '-ml-6 -mr-4 @xl:-mr-0 @xl:ml-0')}>Status</span>
        <span className={twMerge(visibilities.date)}>Date</span>
        <span className={twMerge(visibilities.name)}>Name</span>
        <span className={twMerge(visibilities.total)}>Total</span>
        <span className={twMerge(visibilities.actions)}>Actions</span>
      </div>
    </div>
  )
}

function StatusIcon({ status }: { status: Order['status'] }) {
  const isPending = status === 'pending' || status === 'on-hold' || status === 'processing'
  const isCompleted = status === 'completed' || status === 'trash' || status === 'refunded' || status === 'cancelled'
  const isFailed = status === 'failed'

  const getStatusColor = () => {
    if (isCompleted) return 'text-green-400 bg-green-400/10'
    if (isFailed) return 'text-rose-400 bg-rose-400/10'
    return 'text-orange-400 bg-orange-400/20'
  }

  return (
    <div className='flex items-center gap-2'>
      <div className={structureClasses(getStatusColor(), 'flex-none rounded-full p-1')}>
        <div className={twMerge('h-1.5 w-1.5 rounded-full bg-current', isPending && 'animate-pulse duration-75')} />
      </div>
      <div className='hidden text-white @xl:block'>{status}</div>
    </div>
  )
}
