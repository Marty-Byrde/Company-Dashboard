import { ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

export default function FeedContainer({ children, className }: { children?: ReactNode; className?: string }) {
  return (
    <ul role='list' className={twMerge('space-y-6', className)}>
      {children}
    </ul>
  )
}
