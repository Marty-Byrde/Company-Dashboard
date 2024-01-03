'use client'

import { Context, createContext, MutableRefObject, useContext, useRef, useState } from 'react'

import SearchIcon from '@/components/Shared/Filtering/DialogSubcomponents/SearchIcon'
import SearchDialog from '@/components/Shared/Filtering/SearchDialog'
import DisplayKBD from '@/components/Shared/Filtering/ExternalizedFC/DisplayKBD'
import { twMerge } from 'tailwind-merge'
import ReactState from '@/typings/ReactState'
// import SearchButton from "@/components/Shared/Filtering/SearchButton"
import BaseProps from '@/typings/BaseProps'
import { BaseItem } from '@algolia/autocomplete-core'

// @ts-ignore
export const SearchContext: Context<SearchContextProps> = createContext(null)

export interface SearchItem extends BaseItem {
  title: string
  name: string
  description?: string
  href?: string
}

interface SearchContextProps {
  shortCutKey?: string
  iconOnly?: boolean
  open: ReactState<boolean>['state']
  setOpen: ReactState<boolean>['setState']

  items: {
    filter: ReactState<SearchItem[]>['state']
    setFilter: ReactState<SearchItem[]>['setState']
    items: SearchItem[]
  }
  refs: {
    button: MutableRefObject<HTMLButtonElement | null>
  }
}

export interface SearchProps {
  shortCutKey: string
  placeHolder?: string
  iconOnly?: boolean
  items: SearchItem[]
}

/**
 * This component features a search-box that can be either opened by clicking into
 * it or by pressing the displayed-shortcut in case one has been set.
 * When the search-box was clicked or opened by pressing the shortcut, then the
 * Search-Dialog will open. This Search-Dialog features an input field,
 * where the user can filter the Array of SearchItems. The filtered results are
 * then listed below the dialog-search-input field.
 * @param shortCutKey Key + (CTRL | ⌘) that openes the Search-Box
 * @param placeHolder Placeholder that is displayed inside the search-box
 * @param iconOnly Whether the search-box only displays the search icon
 * @param item The array of SearchItems that are available for filtering by the user
 * @constructor
 */
export default function Search({ shortCutKey, placeHolder, iconOnly, items }: SearchProps) {
  const [filter, setFilter] = useState<SearchItem[]>(items)
  const [isOpen, setOpen] = useState<boolean>(false)
  const buttonRef = useRef(null)

  return (
    <SearchContext.Provider value={{ shortCutKey, items: { items: items, filter, setFilter }, iconOnly, refs: { button: buttonRef }, open: isOpen, setOpen }}>
      <SearchButton>
        <SearchIcon className={twMerge('h-5 w-5 flex-none fill-slate-400 group-hover:fill-slate-500 md:group-hover:fill-slate-400 dark:fill-slate-500')} />

        <span className={twMerge('ml-2 hidden text-slate-500 @[110px]:block dark:text-gray-300/70', iconOnly ? 'hidden @[110px]:hidden' : '')}>{placeHolder ?? 'Search'}</span>

        <DisplayKBD shortCut={shortCutKey} className={twMerge('hidden @[50px]:flex', iconOnly ? 'hidden @[50px]:hidden' : '')} key={shortCutKey} />
      </SearchButton>

      <SearchDialog />
    </SearchContext.Provider>
  )
}

function SearchButton({ children }: { children: BaseProps['children'] }) {
  const {
    iconOnly,
    refs: { button },
    setOpen,
  } = useContext(SearchContext)

  return (
    <button
      ref={button}
      onClick={() => setOpen(true)}
      className={twMerge(
        'group flex flex-1 items-center justify-center @container @[80px]:justify-start',
        'h-auto min-w-[40px] rounded-lg px-2.5 py-2.5 @[60px]:px-4',
        'ring-1 ring-slate-200 hover:ring-slate-300 dark:ring-inset dark:ring-white/5 dark:hover:ring-slate-500',
        'dark:bg-neutral-700/40 dark:hover:bg-neutral-600',
        iconOnly ? 'w-min max-w-[40px] justify-center px-3 py-3 sm:w-auto sm:justify-start' : '',
      )}>
      {children}
    </button>
  )
}
