import getHellocashAPI from '@/lib/Shared/HelloCash'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export async function GET(req: Request) {
  const params = new URL(req.url).searchParams
  const limit = parseInt(params?.get('limit')?.toString() ?? '-1')

  const { getArticles } = getHellocashAPI()
  const articles = await getArticles(limit)

  return NextResponse.json(articles)
}
