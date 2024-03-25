'use client'

import { twMerge } from 'tailwind-merge'
import Link from 'next/link'
import { CircleStackIcon } from '@heroicons/react/24/outline'
import { useTableContext } from '@/components/Shared/Table/Table'

export default function ShowArticleHistoryButton<T>() {
  const { selection } = useTableContext<T>()
  const ids = selection.map((s) => s.id).filter((item, index, array) => array.indexOf(item) === index)

  return (
    <Link
      aria-disabled={selection.length === 0}
      onClick={(e) => selection.length === 0 && e.preventDefault()}
      href={'/article-buy-history/' + ids.join(',')}
      className={twMerge(
        'flex cursor-not-allowed items-center gap-2 rounded-md bg-blue-400/25 px-3 py-1.5 text-sm ring-1 ring-blue-400 hover:bg-blue-400/40 active:bg-blue-400/60 dark:bg-blue-600/25 dark:ring-blue-600 dark:hover:bg-blue-600/40 dark:active:bg-blue-600/60',
        selection.length > 0 && 'cursor-pointer',
      )}>
      <CircleStackIcon width={16} height={16} />
      Show History
    </Link>
  )
}
