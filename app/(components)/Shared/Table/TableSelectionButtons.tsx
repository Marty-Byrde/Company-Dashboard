'use client'

import { useTableContext } from '@/components/Shared/Table/Table'
import { twMerge } from 'tailwind-merge'

/**
 * Renders the selection-buttons inside a flex-container, that has an opacity of 25% when no items are selected and is hidden when the selection is not allowed / disabled.
 * @param className Additional classes that are applied to the flex-container.
 * @description Default classes: 'flex flex-1 flex-wrap gap-2'
 */
export default function TableSelectionButtons<T>({ className }: { className?: string }) {
  const { selection, selectionButtons, allowSelection } = useTableContext<T>()
  return <div className={twMerge('flex flex-1 flex-wrap gap-2', selection.length === 0 && 'opacity-25', !allowSelection && 'hidden', className)}>{selectionButtons}</div>
}
