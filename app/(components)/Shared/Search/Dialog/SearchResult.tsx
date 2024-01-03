import { Fragment, useContext, useId } from 'react'
import HighlightQuery from '@/components/Shared/Search/Dialog/HighlightQuery'
import { SearchItem } from '@/components/Shared/Search/SearchBox'
import { SearchDialogContext } from '@/components/Shared/Search/SearchDialog'

export default function SearchResult({ item, query }: { item: SearchItem; query: string }) {
  const { autocomplete, autocompleteState } = useContext(SearchDialogContext)
  const { onMouseMove, onMouseDown, onClick, ...compatibleProps } = autocomplete.getItemProps({ item, source: autocompleteState!.collections!.at(0)!.source })
  const id = useId()

  return (
    <li
      aria-labelledby={`${item.title}-title-li-${id}`}
      onClick={(e: any) => onClick(e)}
      onMouseDown={(e: any) => onMouseDown(e)}
      onMouseMove={(e: any) => onMouseMove(e)}
      {...compatibleProps}
      className='group block cursor-default rounded-lg px-3 py-2 aria-selected:bg-neutral-300 dark:aria-selected:bg-neutral-500/30'>
      <div aria-hidden='true' className='text-sm text-gray-800/90 group-aria-selected:text-sky-600 dark:text-neutral-200 dark:group-aria-selected:text-sky-400'>
        <HighlightQuery text={item.title} query={query} />
      </div>

      <div aria-hidden='true' className='mt-0.5 truncate whitespace-nowrap text-xs text-gray-500 dark:text-neutral-300/80'>
        <Fragment key={'SearchResultFragment' + id + item.title}>
          {item?.description && <HighlightQuery text={item?.description} query={query} />}
          <span className={!item?.href ? 'sr-only' : 'mx-2 text-gray-400 group-aria-selected:text-gray-500 dark:text-neutral-400/60 dark:group-aria-selected:text-neutral-400'}>{item?.href}</span>
        </Fragment>
      </div>
    </li>
  )
}
