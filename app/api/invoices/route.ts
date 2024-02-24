import { NextResponse } from 'next/server'
import getHellocashAPI from '@/lib/Shared/HelloCash'

export async function GET(req: Request) {
  const params = new URL(req.url).searchParams
  const limit = parseInt(params?.get('limit')?.toString() ?? '25')

  const { getInvoices } = getHellocashAPI()
  const invoices = await getInvoices(parseInt(limit?.toString() ?? '25'))

  return NextResponse.json(invoices)
}
