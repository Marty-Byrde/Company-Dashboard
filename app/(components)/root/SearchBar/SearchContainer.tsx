'use client'

import { GlobalColorSettings } from '@/lib/root/ColorSettings'
import SearchBox, { SearchItem } from '@/components/Shared/Search/SearchBox'
import { twMerge } from 'tailwind-merge'

const { lightBackground, darkBackground } = GlobalColorSettings

export default function SearchContainer({ title, className, items }: { title?: string; items: SearchItem[]; className?: string }) {
  return (
    <div
      className={twMerge('-mx-4 -mt-4 hidden h-16 items-center justify-between border-b px-4 lg:flex dark:border-b-neutral-600', lightBackground, darkBackground, title ?? 'justify-end')}
      key={lightBackground + darkBackground}>
      <span className={twMerge('flex-1 text-lg', className, title ?? 'hidden')}>{title}</span>
      <div className='flex max-w-md flex-1 items-center gap-4'>
        <SearchBox items={items} shortCutKey='i' />
      </div>
    </div>
  )
}
