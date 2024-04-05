'use client'
import { TableElement } from '@/typings/Shared/Table/Types'
import Link from 'next/link'
import { twMerge } from 'tailwind-merge'
import { CircleStackIcon } from '@heroicons/react/24/outline'

export default function CustomerHistoryButton<T>({ item }: { item: TableElement<T> }) {
  return (
    <Link
      href={`/customer-history/${item.id}/`}
      className={twMerge(
        'flex cursor-pointer items-center gap-2 rounded-md bg-blue-400/25 px-3 py-1.5 text-sm ring-1 ring-blue-400 hover:bg-blue-400/40 active:bg-blue-400/60 dark:bg-blue-600/25 dark:ring-blue-600 dark:hover:bg-blue-600/40 dark:active:bg-blue-600/60',
      )}>
      <CircleStackIcon width={16} height={16} />
      Show History
    </Link>
  )
}
