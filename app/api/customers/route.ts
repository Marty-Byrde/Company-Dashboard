import getHellocashAPI from '@/lib/Shared/HelloCash'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export async function GET(req: Request) {
  const params = new URL(req.url).searchParams
  const limit = parseInt(params?.get('limit')?.toString() ?? '-1')

  const { getCustomers } = getHellocashAPI()
  const customers = await getCustomers(limit)

  return NextResponse.json(customers)
}
