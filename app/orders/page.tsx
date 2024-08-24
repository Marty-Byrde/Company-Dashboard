import Each from '@/lib/Shared/Each'
import Slideover from '../(components)/Shared/Slideover/SlideOver'
import SlideOverProvider from '../(components)/Shared/Slideover/SlideoverProvider'
import CustomerRegistrationMenu from '../(components)/orders/CustomerRegistrationMenu'
import RegistrationProvider from '../(components)/orders/RegistrationProvider'
import DisplayOrder, { DisplayOrderHeaders } from '@/components/orders/DisplayOrder'
import Order from 'woocommerce-utils/helper/typings/Order'
import env from '@/lib/root/Environment'

export default async function OrdersPage() {
  const orders = await fetch(`${env.BACKEND}/orders?limit=25`, { next: { revalidate: 60 } })
    .then((res) => res.json())
    .then((orders) => orders as Order[])

  return (
    <SlideOverProvider>
      <RegistrationProvider>
        <DisplayOrderHeaders />
        <div className='flex flex-wrap gap-2 @container'>
          <Each
            items={orders}
            render={(order) => <DisplayOrder key={order.id} order={order} href={`${env.WOOCOMMERCE_DASHBOARD}/post.php?action=edit&post=${order.id}`} />}
          />
        </div>
        <Slideover title='Customer Registration' maxWidth='w-full max-w-full lg:max-w-md'>
          <CustomerRegistrationMenu />
        </Slideover>
      </RegistrationProvider>
    </SlideOverProvider>
  )
}
