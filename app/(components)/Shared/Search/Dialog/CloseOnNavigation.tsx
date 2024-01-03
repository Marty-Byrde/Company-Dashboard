import { usePathname, useSearchParams } from 'next/navigation'
import { useContext, useEffect } from 'react'
import { SearchDialogContext } from '@/components/Shared/Search/SearchDialog'

export default function CloseOnNavigation() {
  const { close, autocomplete } = useContext(SearchDialogContext)
  let pathname = usePathname()
  let searchParams = useSearchParams()

  useEffect(() => {
    close()
  }, [pathname, searchParams, close, autocomplete])

  return null
}
