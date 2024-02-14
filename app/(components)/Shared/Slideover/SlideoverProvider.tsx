'use client'
import useContextHandler from '@/hooks/Shared/Context/useContextHandler'
import ReactState from '@/typings/ReactState'
import React, { createContext, useState } from 'react'

interface ContextProps {
  open: ReactState<boolean>['state']
  setOpen: ReactState<boolean>['setState']
  close: () => void
}
const Context = createContext<ContextProps | null>(null)

export const useSlideOver = () => useContextHandler(Context)

export default function SlideOverProvider({ children }: { children?: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  return <Context.Provider value={{ open, setOpen, close: () => setOpen(false) }}>{children}</Context.Provider>
}
