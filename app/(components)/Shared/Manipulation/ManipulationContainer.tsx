import useContextHandler from '@/hooks/Shared/Context/useContextHandler'
import BaseProps from '@/typings/BaseProps'
import ReactState from '@/typings/ReactState'
import { createContext } from 'react'
import { twMerge } from 'tailwind-merge'

interface ContextProps<T> {
  object: ReactState<T>['state']
  setObject: ReactState<T>['setState']
  debounce: number
}
const Context = createContext<ContextProps<any> | null>(null)

/**
 *
 * @returns The context of the ManipulationContainer that holds the object and its setState-function
 */
export let useManipulationProvider = <T,>() => useContextHandler<ContextProps<T>>(Context)

/**
 * Accepts the state of an object that is then used by its children (Input) to manipulate the object
 * @param object The useState-object that should be manipulated
 * @param setObeject The setState-function that should be used to update the object
 * @param className The className that should be applied to the container
 * @param debounce The time in ms that the input elements should wait before updating the object
 * @returns The container that holds the Input-elements that manipulate the given object
 */
export default function ManipulationContainter<T>({
  object,
  setObject,
  children,
  className,
  debounce,
}: {
  object: ReactState<T>['state']
  setObject: ReactState<T>['setState']
  children?: BaseProps['children']
  className?: string
  debounce?: number
}) {
  return (
    <Context.Provider value={{ object, setObject, debounce: debounce ?? 0 }}>
      <div className={twMerge('flex flex-wrap gap-2', className)}>{children}</div>
    </Context.Provider>
  )
}
