import { Context, createContext, Suspense, useCallback, useContext, useEffect, useRef } from 'react'
import { useAutocomplete } from '@/hooks/Shared/Search/useAutoComplete'
import CloseOnNavigation from '@/components/Shared/Filtering/DialogSubcomponents/CloseOnNavigation'
import { Dialog } from '@headlessui/react'
import SearchInput from '@/components/Shared/Filtering/DialogSubcomponents/SearchInput'
import SearchResults from '@/components/Shared/Filtering/DialogSubcomponents/SearchResults'
import { SearchContext } from '@/components/Shared/Filtering/Search'

interface SearchDialogContextProps extends ReturnType<typeof useAutocomplete> {}

// @ts-ignore
export const SearchDialogContext: Context<SearchDialogContextProps> = createContext(null)

export default function SearchDialog() {
  const {
    shortCutKey,
    refs: { button },
    open,
    setOpen: _setOpen,
  } = useContext(SearchContext)

  const { autocomplete, autocompleteState, close } = useAutocomplete()
  const setOpen = useCallback((open: boolean) => {
    let { width = 0, height = 0 } = button.current?.getBoundingClientRect() ?? {}
    if (!open || (width !== 0 && height !== 0)) {
      _setOpen(open)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const formRef = useRef(null)
  const panelRef = useRef(null)
  const inputRef = useRef(null)

  const { onReset, onSubmit, ...compatibleProps } = autocomplete.getFormProps({ inputElement: inputRef.current })

  useEffect(() => {
    if (open) return

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === shortCutKey?.toLowerCase() && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        setOpen(true)
      }
    }

    window.addEventListener('keydown', onKeyDown)

    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, setOpen])

  return (
    <SearchDialogContext.Provider value={{ autocomplete, autocompleteState, close }}>
      <Suspense fallback={null}>
        <CloseOnNavigation />
      </Suspense>
      <Dialog open={open} onClose={() => close()} className={'fixed inset-0 z-50'}>
        <div className='fixed inset-0 bg-slate-900/50 backdrop-blur dark:bg-neutral-800/30' />

        <div className='fixed inset-0 overflow-y-auto px-4 py-4 sm:px-6 sm:py-20 md:py-32 lg:px-8 lg:py-[15vh]'>
          <Dialog.Panel className='mx-auto transform-gpu overflow-hidden rounded-xl bg-neutral-200 shadow-xl sm:max-w-xl dark:bg-neutral-700/80 dark:ring-1 dark:ring-neutral-600'>
            <div {...autocomplete.getRootProps({})}>
              <form ref={formRef} {...compatibleProps} onSubmit={(e: any) => onSubmit(e)} onReset={(e: any) => onReset(e)}>
                <SearchInput inputRef={inputRef} onClose={() => setOpen(false)} />

                <div ref={panelRef} className='border-t border-neutral-400/60 bg-neutral-200 px-2 py-3 empty:hidden dark:border-slate-400/10 dark:bg-neutral-700/80'>
                  {autocompleteState?.isOpen && <SearchResults />}
                </div>
              </form>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </SearchDialogContext.Provider>
  )
}
