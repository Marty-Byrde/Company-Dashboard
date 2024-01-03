import SearchResult from '@/components/Shared/Filtering/DialogSubcomponents/SearchResult'
import { useContext } from 'react'
import { SearchDialogContext } from '@/components/Shared/Filtering/SearchDialog'

export default function SearchResults() {
  const { autocomplete, autocompleteState } = useContext(SearchDialogContext)

  const collection = autocompleteState?.collections?.at(0)
  const query = autocompleteState?.query ?? ''

  if (!collection || collection?.items?.length === 0) {
    return (
      <p className='px-4 py-8 text-center text-sm text-slate-700 dark:text-gray-400'>
        No results for &ldquo;
        <span className='break-words text-slate-900 dark:text-white'>{query}</span>
        &rdquo;
      </p>
    )
  }

  return (
    <ul {...autocomplete.getListProps()}>
      {collection.items.map((item) => (
        <SearchResult key={Object.values(item).join('')} item={item} query={query} />
      ))}
    </ul>
  )
}
