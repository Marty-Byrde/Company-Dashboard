import { ReactNode } from 'react'
import Link from 'next/link'
import { twMerge } from 'tailwind-merge'

/**
 * Displays the title and description of a Feed.
 * @param title The title of the feed that is highlighted
 * @param description The description of the feed
 * @param icon The icon that is displayed in front of the title
 * @param link The link that is opened when the title is clicked
 * @internal Partial component that is used to build a Feed
 */
export default function FeedTitle({ title, description, icon, link }: { title: string; description: string; icon?: ReactNode; link?: string }) {
  const Container = ({ children, className }: { children: ReactNode; className?: string }) =>
    link ? (
      <Link href={link} className={className}>
        {children}
      </Link>
    ) : (
      <span className={className}>{children}</span>
    )

  return (
    <>
      <div className='relative flex h-6 w-6 flex-none items-center justify-center rounded-full bg-gray-300 dark:bg-white/15'>
        {icon ? icon : <div className='h-1.5 w-1.5 rounded-full bg-white ring-1 ring-gray-300 dark:bg-gray-300' />}
      </div>

      <p className='line-clamp-1 flex-auto py-0.5 text-xs leading-5 text-gray-500 dark:text-gray-400'>
        <Container className={twMerge('font-medium text-gray-900 dark:text-gray-100', link && 'hover:underline')}>{title}</Container> {description}
      </p>
    </>
  )
}
