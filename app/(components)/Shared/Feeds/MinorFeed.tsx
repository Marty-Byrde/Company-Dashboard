import { twMerge } from 'tailwind-merge'
import FeedTitle from '@/components/Shared/Feeds/Partial/FeedTitle'
import FeedDate from '@/components/Shared/Feeds/Partial/FeedDate'
import { BasicFeedProps } from '@/components/Shared/Feeds/Feed'

/**
 * Displays a basic feed that has a title that is highlighted and a description that comes right after. The date is displayed at the end.
 * @param title The title of the feed that is highlighted
 * @param description The description of the feed
 * @param icon The icon that is displayed in front of the title
 * @param date The time that has passed since that feed was created
 * @param link The link that is opened when the title is clicked
 * @param single Whether the feed is the only child of the parent-feed
 * @param last Whether the feed is the last child of the parent-feed-container
 * @constructor
 */
export default function MinorFeed({ title, description, icon, date, link, single, last }: BasicFeedProps & { single?: boolean; last?: boolean }) {
  return (
    <>
      <li key={title + description + date + Math.random()} className='group relative ml-12 flex gap-x-3'>
        <div className={twMerge('-bottom-6', 'absolute left-0 top-0 flex w-6 justify-center group-first:top-2 group-last:h-4')}>
          {/* Vertical Connect at the top*/}
          <div className={twMerge('absolute -top-3 right-[3.72rem] hidden h-4 w-px bg-gray-300 group-first:block dark:bg-gray-400')} />
          {/* Horizontal Connecter at the top*/}
          <div className='absolute right-4 top-[0.21rem] hidden h-px w-[2.78rem] bg-gray-300 group-first:block dark:bg-gray-400' />

          {!single && <div className='w-px bg-gray-300 dark:bg-gray-400' />}

          {/* Horizontal Connecter at the bottom*/}
          <div className={twMerge('absolute bottom-[0.22rem] right-4 hidden h-px w-[2.78rem] bg-gray-300 group-last:block dark:bg-gray-400', (single || last) && 'hidden group-last:hidden')} />
          {/* Vertical Connect at the bottom*/}
          <div className={twMerge('absolute -bottom-8 right-[3.72rem] hidden h-9 w-px bg-gray-300 group-last:block dark:bg-gray-400', single && 'h-11', last && 'hidden group-last:hidden')} />
        </div>

        <FeedTitle title={title} description={description} icon={icon} link={link} />
        <FeedDate dateString={date} className='pr-3' />
      </li>
    </>
  )
}
