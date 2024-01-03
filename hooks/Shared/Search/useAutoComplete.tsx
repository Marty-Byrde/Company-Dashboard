import { AutocompleteState, createAutocomplete } from '@algolia/autocomplete-core'
import { useCallback, useContext, useId, useState } from 'react'
import { useRouter } from 'next/navigation'
import { SearchContext, SearchItem } from '@/components/Shared/Search/SearchBox'

export function useAutocomplete() {
  const {
    items: { items, setFilter },
    setOpen,
  } = useContext(SearchContext)

  const [autocompleteState, setAutocompleteState] = useState<AutocompleteState<SearchItem> | null>()
  const router = useRouter()
  const close = useCallback(() => {
    setOpen(false)
    autocomplete.setQuery('')
  }, [setOpen])

  const id = useId()

  function navigate({ itemUrl }: { itemUrl?: string }) {
    if (!itemUrl) return

    router.push(itemUrl)

    if (itemUrl === window.location.pathname + window.location.search + window.location.hash) {
      close()
    }
  }

  let [autocomplete] = useState(() =>
    createAutocomplete({
      id,
      placeholder: 'Find something...',
      defaultActiveItemId: 0,
      navigator: {
        navigate,
      },
      onStateChange({ state }: { state: AutocompleteState<SearchItem> }) {
        setAutocompleteState(state)
      },
      shouldPanelOpen({ state }) {
        console.log(`Panel should ${state?.query !== '' ? '' : 'not'} be open!`)
        return state?.query !== ''
      },
      // @ts-ignore
      getSources({ query }) {
        return [
          {
            sourceId: 'searchId',
            getItemInputValue({ item }: { item: SearchItem }): string {
              return item.title
            },
            getItems({ query }): SearchItem[] {
              console.log(`Looing for items that contain ${query}`)
              return items.filter((item) => (query.length > 0 ? item.name.includes(query) || item.title.includes(query) || item?.description?.includes(query) : items)) ?? []
            },
            onSelect({ item }: { item: SearchItem }) {
              setFilter(items?.filter((item) => item.name.includes(query)) ?? [])
              navigate({ itemUrl: item?.href?.toString() })
              close()
            },
          },
        ]
      },
    }),
  )

  return { autocomplete, autocompleteState, close }
}
