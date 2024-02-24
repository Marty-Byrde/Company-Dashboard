import { ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'
import FeedTitle from '@/components/Shared/Feeds/Partial/FeedTitle'
import FeedDate from '@/components/Shared/Feeds/Partial/FeedDate'

export interface BasicFeedProps {
  title: string
  description: string
  icon?: ReactNode
  date: string
  link?: string
}

/**
 * Displays a basic feed that has a title that is highlighted and a description that comes right after. The date is displayed at the end.
 * @param title The title of the feed that is highlighted
 * @param description The description of the feed
 * @param icon The icon that is displayed in front of the title
 * @param date The time that has passed since that feed was created
 * @param link The link that is opened when the title is clicked
 * @constructor
 */
export default function Feed({ title, description, icon, date, link }: BasicFeedProps) {
  return (
    <>
      <li key={title + description + date} className='group relative flex gap-x-3'>
        <div className={twMerge('-bottom-6', 'absolute left-0 top-0 flex w-6 justify-center group-first:top-2 group-last:h-4')}>
          <div className='w-px bg-gray-300 dark:bg-gray-400' />
        </div>

        <FeedTitle title={title} description={description} icon={icon} link={link} />
        <FeedDate dateString={date} className='pr-3' />
      </li>
    </>
  )
}
