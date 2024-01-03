'use client'

import { Context, createContext, useState } from "react"
import ReactState from "@/typings/ReactState"
import BaseProps from "@/typings/Children"

// @ts-ignore
export const SearchProviderContext: Context<SearchProviderContextProps> = createContext(null)

interface SearchProviderContextProps {
  setEnabled: ReactState<boolean>['setState']

  title: ReactState<string>['state']
  setTitle: ReactState<string>['setState']
}

export default function SearchProvider({ children }: { children: BaseProps['children'] }) {
  const [enabled, setEnabled] = useState<boolean>(true)
  const [title, setTitle] = useState<string>('Page Breadcrumb')


  return (
    <SearchProviderContext.Provider value={{ setEnabled, title, setTitle }}>
      {enabled && children}
    </SearchProviderContext.Provider>
  )
}