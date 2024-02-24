import { twMerge } from 'tailwind-merge'

/**
 * Displays the date of a Feed.
 * @param date The time that has passed since that feed was created
 * @param className Additional classes that are applied to the date
 * @internal Partial component that is used to build a Feed
 */
export default function FeedDate({ dateString, className }: { dateString: string; className?: string }) {
  return <span className={twMerge('flex-none py-0.5 text-xs leading-5 text-gray-500 dark:text-gray-400', className)}>{dateString}</span>
}
