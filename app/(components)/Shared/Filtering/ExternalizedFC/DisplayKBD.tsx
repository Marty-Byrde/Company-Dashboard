import { twMerge } from 'tailwind-merge'
import { useEffect, useState } from 'react'

/**
 * This components displays a given shortcut + CTRL or ⌘
 * @param className
 * @param shortCut
 * @constructor
 */
export default function DisplayKBD({ className, shortCut }: { shortCut: string; className?: string }) {
  const [modifier, setModifier] = useState<'Ctrl' | '⌘'>()

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => setModifier(/(Mac|iPhone|iPod|iPad)/i.test(navigator.platform) ? '⌘' : 'Ctrl'), [])

  if (!shortCut) return null

  return (
    <kbd key={className} className={twMerge('ml-auto flex gap-1.5 font-medium text-slate-400 dark:text-slate-500', className)}>
      <kbd className='font-sans'>{modifier}</kbd>
      <kbd className='font-sans'>{shortCut.toUpperCase()}</kbd>
    </kbd>
  )
}
