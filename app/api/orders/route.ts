import { NextApiRequest } from 'next'
import { NextResponse } from 'next/server'
import getWoocommerceApi from '@/lib/Shared/Woocommerce'

export async function GET(req: NextApiRequest) {
  const limit: unknown = req.query?.limit
  const { getOrders } = await getWoocommerceApi()
  const orders = await getOrders(parseInt(limit?.toString() ?? '25'))

  return NextResponse.json(orders)
}
