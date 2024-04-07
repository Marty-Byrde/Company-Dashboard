import { Invoice } from 'hellocash-api/typings/Invoice'
import useBackend from '@/hooks/Shared/Fetch/useBackend'
import { notFound } from 'next/navigation'
import filterInvoices, { FilterInvoicesParams } from '@/lib/articles/[ids]/filterInvoices'

interface ArticleSelectionParams {
  searchParams: { ids?: string }
  setFilter?: (valid_ids: number[]) => FilterInvoicesParams['filter']
}

/**
 * This hook is used to parse the params of the article-history page. It then filters the invoices based on the given filter.
 * @param searchParams The search-params of the page.
 * @param setFilter A function that returns a filter which is used to filter the invoices.
 */
export default async function parseArticleHistoryParams({ searchParams, setFilter }: ArticleSelectionParams) {
  if (!searchParams.ids) return notFound()
  const encodedIds = searchParams.ids.split('%2C') // encode ids by spliting by comma

  if (!areIdsValid(encodedIds)) return notFound()

  const ids = encodedIds.map((id) => parseInt(id))

  // Fetching invoice on invalid ids is not necessary.
  // eslint-disable-next-line react-hooks/rules-of-hooks
  let invoices = await useBackend<Invoice[]>('/invoices?limit=-1', { next: { revalidate: 3600 * 24, tags: ['invoices'] } })
  invoices = filterInvoices({ invoices, filter: setFilter?.call(null, ids) })

  return { invoices, ids }
}

/**
 * Check whether a set of ids is given and whether all the ids are indeed numbers
 * @param ids The array of ids to be checked.
 */
function areIdsValid(ids: string[]) {
  if (!ids || ids.length === 0) return false
  if (ids.map((id) => parseInt(id) > 0).every((v) => !v)) return false

  return true
}
