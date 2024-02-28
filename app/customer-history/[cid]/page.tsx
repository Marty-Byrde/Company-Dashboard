import getHellocashAPI from '@/lib/Shared/HelloCash'
import CustomerBuyHistory from '@/app/customer-history/[cid]/CustomerBuyHistory'
import { notFound } from 'next/navigation'

export default async function CustomerHistoryPage({ params }: { params: { cid?: string } }) {
  if (!params.cid) return notFound()
  const { findExactCustomer } = getHellocashAPI()
  const customer = await findExactCustomer({ id: params.cid }).then((customers) => customers.at(0))

  if (!customer) return <div>Customer not found</div>

  return <CustomerBuyHistory customer={customer} />
}
