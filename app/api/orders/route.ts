import { NextResponse } from 'next/server'
import getWoocommerceApi from '@/lib/Shared/Woocommerce'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  const params = new URL(req.url).searchParams
  const limit = parseInt(params?.get('limit')?.toString() ?? '25')

  const { getOrders } = await getWoocommerceApi()
  const orders = await getOrders(limit)

  return NextResponse.json(orders)
}
