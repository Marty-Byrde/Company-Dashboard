import { MutableRefObject, useContext } from 'react'
import LoadingIcon from '@/components/Shared/Filtering/DialogSubcomponents/LoadingIcon'
import SearchIcon from '@/components/Shared/Filtering/DialogSubcomponents/SearchIcon'
import { twMerge } from 'tailwind-merge'
import { SearchDialogContext } from '@/components/Shared/Filtering/SearchDialog'

export default function SearchInput({ onClose, inputRef }: { onClose: () => void; inputRef: MutableRefObject<null> }) {
  const { autocompleteState, autocomplete } = useContext(SearchDialogContext)
  let { onClick, onChange, onFocus, ...compatibleProps } = autocomplete.getInputProps({ inputElement: null })

  return (
    <div className='group relative flex h-12'>
      <SearchIcon className='pointer-events-none absolute left-4 top-0 h-full w-5 fill-slate-400 dark:fill-slate-500' />
      <input
        ref={inputRef}
        {...compatibleProps}
        onClick={(e: any) => onClick(e)}
        onChange={(e: any) => onChange(e)}
        onFocus={(e: any) => onFocus(e)}
        className={twMerge(
          'flex-auto appearance-none bg-transparent pl-12 text-slate-900 focus:flex-none ' +
            'outline-none placeholder:text-slate-400 focus:w-full sm:text-sm dark:text-white [&::-webkit-search-cancel-button]:hidden ' +
            '[&::-webkit-search-decoration]:hidden [&::-webkit-search-results-button]:hidden [&::-webkit-search-results-decoration]:hidden',
          autocompleteState?.status === 'stalled' ? 'pr-11' : 'pr-4',
        )}
        onKeyDown={(event: any) => {
          if (event.key === 'Escape' && !autocompleteState?.isOpen && autocompleteState?.query === '') {
            if (document.activeElement instanceof HTMLElement) {
              document.activeElement.blur()
            }

            onClose()
          } else {
            compatibleProps.onKeyDown(event)
          }
        }}
      />
      {autocompleteState?.status === 'stalled' && (
        <div className='absolute inset-y-0 right-3 flex items-center'>
          <LoadingIcon className='h-6 w-6 animate-spin stroke-slate-200 text-slate-400 dark:stroke-slate-700 dark:text-slate-500' />
        </div>
      )}
    </div>
  )
}
