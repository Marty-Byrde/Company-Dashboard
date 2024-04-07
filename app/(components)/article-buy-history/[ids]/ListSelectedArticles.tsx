import useBackend from '@/hooks/Shared/Fetch/useBackend'
import { Article } from 'hellocash-api/typings/Article'
import Each from '@/lib/Shared/Each'

/**
 * Retrieves the products-names based on the given ids and lists them in an ordered-list.
 * @param product_ids The ids of the requested / selected products.
 * @returns An ordered list of the requested product-names.
 */
export default async function ListSelectedArticles({ article_ids }: { article_ids: Array<number> }) {
  const articles = await useBackend<Article[]>('/articles', { next: { revalidate: 3600, tags: ['articles'] } })
  const getName = (id: (typeof article_ids)[number]) => articles.find((a) => a.id === id)?.name

  return (
    <ol className='ml-4 mt-4 flex list-decimal flex-col gap-2 pl-4 text-gray-400'>
      <Each items={article_ids} render={(id) => <li key={id}>{getName(id)}</li>} />
    </ol>
  )
}
