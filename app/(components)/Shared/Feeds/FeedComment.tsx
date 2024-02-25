import { twMerge } from 'tailwind-merge'
import Image from 'next/image'
import FeedDate from '@/components/Shared/Feeds/Partial/FeedDate'

interface FeedCommentProps {
  avatar?: string
  name: string
  comment?: string
  date: string
}
/**
 * Displays a comment as a Feed.
 * @param avatar The image of the person who commented
 * @param name The name of the person who commented
 * @param comment The comment of the person
 * @param date The date of the comment
 *
 */
export default function FeedComment({ avatar, name, date, comment }: FeedCommentProps) {
  const defaultIMG = 'https://images.unsplash.com/photo-1552058544-f2b08422138a?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8cGVyc29ufGVufDB8fDB8fHww'

  return (
    <>
      <li key={name + date + comment} className='group relative flex gap-x-3'>
        <div className={twMerge('-bottom-6', 'absolute left-0 top-0 flex w-6 justify-center group-first:top-3 group-last:h-4')}>
          <div className='w-px bg-gray-300 dark:bg-gray-400' />
        </div>

        <Image width={24} height={24} src={avatar ?? defaultIMG} alt='' className='relative mt-3 h-6 w-6 flex-none rounded-full bg-gray-50' />

        <div className='flex-auto rounded-md p-3 ring-1 ring-inset ring-gray-200'>
          <div className='flex justify-between gap-x-4'>
            <div className='py-0.5 text-xs leading-5 text-gray-500 dark:text-gray-400'>
              <span className='font-medium text-gray-900 dark:text-gray-100'>{name}</span> commented
            </div>

            <FeedDate dateString={date} />
          </div>

          <p className='text-sm leading-6 text-gray-500 dark:text-gray-400'>{comment}</p>
        </div>
      </li>
    </>
  )
}
