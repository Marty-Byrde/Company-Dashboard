import ReactState from '@/typings/ReactState'
import ManipulationContainter from './ManipulationContainer'
import { ManipulationInput } from './ManipulationInput'

/**
 * This hook returns the container and input components that are used to manipulate an object and unifies the type of object between these components
 * @param object The useState-object that should be manipulated
 * @param setObject The setState-function that should be used to update the object
 * @returns The container and input components that are used to manipulate the given object
 */
export default function useManipulation<T>({ object, setObject }: { object: ReactState<T>['state']; setObject: ReactState<T>['setState'] }) {
  return {
    containerProps: { object, setObject },
    Container: ManipulationContainter<T>,
    Input: ManipulationInput<T>,
  }
}
