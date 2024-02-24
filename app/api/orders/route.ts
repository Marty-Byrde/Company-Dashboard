import { NextResponse } from 'next/server'
import getWoocommerceApi from '@/lib/Shared/Woocommerce'

export async function GET(req: Request, context: { params: any }) {
  const limit = context.params?.limit
  const { getOrders } = await getWoocommerceApi()
  const orders = await getOrders(parseInt(limit?.toString() ?? '25'))

  return NextResponse.json(orders)
}
