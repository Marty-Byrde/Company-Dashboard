'use client'

import { Article } from 'hellocash-api/typings/Article'
import { ArticleCategory } from 'hellocash-api/typings/Category'
import { useEffect, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import Each from '@/lib/Shared/Each'
import { useDebounce } from 'use-debounce'
import Link from 'next/link'
import { CircleStackIcon } from '@heroicons/react/24/outline'

export default function ArticleTable({ articles: initialArticles, categories }: { articles: Article[]; categories: ArticleCategory[] }) {
  const [articles, setArticles] = useState(initialArticles)
  const [selected, setSelected] = useState<Article[]>([])
  const [searchValue, setSearchValue] = useState<string | undefined>(undefined)
  const isSelected = (article: Article) => selected.find((a) => a.id === article.id)
  const toggleSelection = (article: Article) => () => setSelected((prev) => (isSelected(article) ? prev.filter((a) => a.id !== article.id) : [...prev, article]))
  const [debouncedValue] = useDebounce(searchValue, 500)

  useEffect(() => {
    if (debouncedValue === undefined) return
    if (debouncedValue.trim().length === 0) return setArticles(initialArticles)
    setArticles(
      initialArticles.filter(
        (a) =>
          a.name.toLowerCase().includes(debouncedValue.toLowerCase()) ||
          categories
            .find((c) => c.id === a.category)
            ?.name.toLowerCase()
            .includes(debouncedValue.toLowerCase()),
      ),
    )
  }, [debouncedValue])

  return (
    <>
      <div className='wrapper relative mt-12 @container 2xs:mt-0'>
        <TableSelectionButtons selection={selected} />
        <div className={twMerge('mb-1 hidden flex-1 items-center justify-end gap-4 @2xs:flex')}>
          <label htmlFor='table-search text-sm' className='min-w-0'>
            Suche:
          </label>
          <input
            id='table-search'
            onChange={({ target: { value } }) => setSearchValue(value)}
            className='max-w-24 flex-1 rounded-md px-3 py-1.5 text-sm shadow-sm @sm:max-w-32 @md:max-w-48 @2xl:max-w-sm dark:bg-neutral-700 dark:shadow-neutral-600'
          />
        </div>
        <table className='w-full rounded-md'>
          <thead className='bg-gray-700 py-2 text-left dark:bg-neutral-900'>
            <tr className='space-x-24 text-gray-100 dark:text-gray-200'>
              <th className='relative my-2 block h-8 min-w-16'>
                <input
                  type='checkbox'
                  className='absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded-md border-gray-300 text-indigo-600 hover:cursor-pointer focus:ring-indigo-600 dark:bg-neutral-600 dark:text-fuchsia-700 dark:checked:bg-fuchsia-700 dark:focus:ring-fuchsia-700'
                  checked={selected.length === initialArticles.length || articles.map((a) => !!selected.find((s) => s.id === a.id)).every(Boolean)}
                  onChange={() =>
                    setSelected((prev) => {
                      //* The displayed articles are a subset of the initial articles, as a search is active
                      if (articles.length !== initialArticles.length) {
                        //? if all the displayed articles are selected and the total-checkbox is clicked, then the displayed articles are removed from the selection.
                        if (articles.map((a) => !!selected.find((s) => s.id === a.id)).every(Boolean)) {
                          return prev.filter((a) => !articles.find((s) => s.id === a.id))
                        }

                        //? if not all the displayed articles are selected and the total-checkbox is clicked, then the displayed articles are added to the selection.
                        return [...prev, ...articles.filter((a) => !prev.find((s) => s.id === a.id))]
                      }

                      //? When all the articles are displayed, thus no search is active, we can simply toggle the selection of all articles.
                      return prev.length === initialArticles.length ? [] : initialArticles
                    })
                  }
                />
              </th>

              <th className='hidden min-w-16 @xl:table-cell'>ID</th>
              <th className='hidden min-w-2 @xl:table-cell'></th>
              <th className='w-[100%]'>Name</th>
              <th className='hidden text-nowrap pr-4 text-right @3xl:table-cell'>Category</th>
            </tr>
          </thead>
          <tbody className='space-y-24 divide-y divide-gray-400 px-2 dark:divide-neutral-500'>
            <Each
              items={articles}
              render={(article, index) => (
                <tr
                  key={article.id + index}
                  className={twMerge(
                    'h-12 px-4 transition-colors duration-200 dark:hover:bg-neutral-700',
                    isSelected(article) && 'dark:bg-neutral-700/60 dark:hover:bg-neutral-700',
                  )}
                  onClick={toggleSelection(article)}>
                  <td className='relative min-w-12'>
                    {isSelected(article) && <div className='absolute inset-y-0 left-0 w-0.5 bg-indigo-600 dark:bg-fuchsia-700' />}

                    <input
                      type='checkbox'
                      className='absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded-md border-gray-300 text-indigo-600 hover:cursor-pointer focus:ring-indigo-600 dark:bg-neutral-600 dark:text-fuchsia-700 dark:checked:bg-fuchsia-700 dark:focus:ring-fuchsia-700'
                      value={article.id}
                      checked={!!isSelected(article)}
                      onChange={toggleSelection(article)}
                    />
                  </td>

                  <td className='hidden @xl:table-cell'>{article.id}</td>
                  <td className='hidden min-w-2 @xl:table-cell'></td>
                  <td className='line-clamp-2 table-cell max-w-48 pr-4'>{article.name}</td>
                  <td className='hidden pr-4 text-right @3xl:table-cell'>{<span>{categories.find((c) => c.id === article.category)?.name}</span>}</td>
                </tr>
              )}
            />
          </tbody>
        </table>
      </div>
    </>
  )
}

function TableSelectionButtons({ selection }: { selection: Array<Article> }) {
  return (
    <div className={twMerge('absolute -top-10 left-0 @2xs:top-0', selection.length === 0 && 'opacity-25')}>
      <Link
        aria-disabled={selection.length === 0}
        onClick={(e) => selection.length === 0 && e.preventDefault()}
        href={
          '/article-buy-history/' +
          selection
            .map((s) => s.id)
            .filter((item, index, array) => array.indexOf(item) === index)
            .join(',')
        }
        className={twMerge(
          'flex cursor-not-allowed items-center gap-2 rounded-md bg-blue-400/25 px-3 py-1.5 text-sm ring-1 ring-blue-400 hover:bg-blue-400/40 active:bg-blue-400/60 dark:bg-blue-600/25 dark:ring-blue-600 dark:hover:bg-blue-600/40 dark:active:bg-blue-600/60',
          selection.length > 0 && 'cursor-pointer',
        )}>
        <CircleStackIcon width={16} height={16} />
        Show History
      </Link>
    </div>
  )
}
