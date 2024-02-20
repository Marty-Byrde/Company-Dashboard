import Each from '@/lib/Shared/Each'
import getWoocommerceApi from '@/lib/Shared/Woocommerce'
import Slideover from '../(components)/Shared/Slideover/SlideOver'
import SlideOverProvider from '../(components)/Shared/Slideover/SlideoverProvider'
import CustomerRegistrationMenu from '../(components)/orders/CustomerRegistrationMenu'
import RegistrationProvider from '../(components)/orders/RegistrationProvider'
import DisplayOrder, { DisplayOrderHeaders } from '@/components/orders/DisplayOrder'

export default async function OrdersPage() {
  const { getOrders } = await getWoocommerceApi()
  const orders = await getOrders(100)

  return (
    <SlideOverProvider>
      <RegistrationProvider>
        <DisplayOrderHeaders />
        <div className='flex flex-wrap gap-2 @container'>
          <Each items={orders} render={(order) => <DisplayOrder key={order.id} order={order} href={`${process.env.WOOCOMMERCE_DASHBOARD}/post.php?action=edit&post=${order.id}`} />} />
        </div>
        <Slideover title='Customer Registration' maxWidth='w-full max-w-full lg:max-w-md'>
          <CustomerRegistrationMenu />
        </Slideover>
      </RegistrationProvider>
    </SlideOverProvider>
  )
}
