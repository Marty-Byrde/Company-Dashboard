import getHellocashAPI from '@/lib/Shared/HelloCash'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const { getCategories } = getHellocashAPI()
  const categories = await getCategories()

  return NextResponse.json(categories)
}
