import ArticleTable from '@/app/articles/ArticleTable'
import { Article } from 'hellocash-api/typings/Article'
import { ArticleCategory } from 'hellocash-api/typings/Category'
import useBackend from '@/hooks/Shared/Fetch/useBackend'

export default async function ArticlesPage() {
  const articles = await useBackend<Article[]>('/articles', { next: { revalidate: 3600, tags: ['articles'] } })
  const categories = await useBackend<ArticleCategory[]>('/categories', { next: { revalidate: 3600, tags: ['categories'] } })

  return (
    <div className='gap4 flex flex-col'>
      <h1 className='mb-6 text-2xl font-semibold'>Articles</h1>

      <ArticleTable articles={articles} categories={categories} />
    </div>
  )
}
