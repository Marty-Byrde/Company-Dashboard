import { NonNullable } from '@/typings/NonNullable'
import ObjectPath from '@/typings/ObjectPath'
import React, { InputHTMLAttributes, useEffect, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { useManipulationProvider } from './ManipulationContainer'

interface ManipulationInputProps<T> extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onClick' | 'className' | 'onChange' | 'id'> {
  label?: string
  path: ObjectPath<NonNullable<T>>
  hidden?: boolean
  containerClassName?: string
  inputClassName?: string
  labelClassName?: string
}

/**
 * Renders an input element that updates the given property of the object in the manipulation context
 * @param label The label that is displayed next to the input, default the property name
 * @param path The path to the property that should be updated and displayed
 * @returns
 */
export function ManipulationInput<T>({ label, path, hidden, containerClassName, labelClassName, inputClassName, ...inputProps }: ManipulationInputProps<T>) {
  const { object, setObject, debounce } = useManipulationProvider<T>()
  const [_internal, _setInteral] = useState<T>(object)

  //* Debounce the object update
  useEffect(() => {
    const timeout = setTimeout(() => {
      setObject(_internal)
    }, debounce ?? 0)

    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_internal])

  // In case the object is null or the input is hidden, then the input should not be rendered
  if (object === null || hidden) return null

  //* Get the current value of the requested property
  //@ts-ignore
  const defaultValue = path.split('.').reduce((acc, curr) => acc[curr], object)

  const onChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    let value: string | number | boolean = defaultValue!.toString()

    switch (typeof defaultValue) {
      case 'boolean':
        value = e.target.checked
        break
      case 'string':
        value = e.target.value.toString()
        break
      case 'number':
        value = parseFloat(e.target.value)
        break
      default:
        console.log('Changed property expects a non-primitve type... discarding changes.')
        return
    }

    _setInteral(updateObjectByPath(object!, path, value))
  }

  const inputType = (): InputHTMLAttributes<HTMLInputElement>['type'] => {
    switch (typeof defaultValue) {
      case 'boolean':
        return 'checkbox'
      case 'number':
        return 'number'
      default:
        return 'text'
    }
  }

  return (
    <div className={twMerge('flex items-center gap-6 rounded-md bg-neutral-700 px-3 py-1.5', containerClassName)}>
      <label className={twMerge('relative text-lg', labelClassName)} htmlFor={path.toString()}>
        {label ?? path?.split('.')?.at(-1)?.toString() ?? path}
        {inputProps.required && (
          <span className='absolute -right-2 -top-1 text-sm dark:text-red-300' title='required'>
            *
          </span>
        )}
        :
      </label>

      <input
        placeholder={label}
        type={inputType()}
        {...inputProps}
        className={twMerge(
          'min-w-4 flex-1 rounded-md dark:bg-neutral-700/40 dark:placeholder:text-gray-300/40',
          'invalid:border-red-400 invalid:ring-1 invalid:ring-red-400',
          inputProps.type === 'radio' ? 'max-w-4 checked:border-gray-700 checked:bg-blue-600 dark:checked:border-gray-400 checked:dark:bg-blue-600 ' : null,
          inputClassName,
        )}
        id={path.toString()}
        onChange={onChange}
        defaultValue={String(defaultValue)}
      />
    </div>
  )
}

function updateObjectByPath<T>(obj: object | T, path: ObjectPath<T> | string, value: any): T {
  if (path.split('.').length === 1 || !path.includes('.')) {
    return Object.assign({}, obj, { [path]: value }) as T
  } else {
    // Nested property update
    const [first, ...rest] = path.split('.')
    return {
      ...obj,
      // @ts-ignore
      [first]: updateObjectByPath(obj[first], rest.join('.'), value),
    } as T
  }
}

//
//
//
//
//
//
//
//
//
//
//
//
//

// Usage example with a nested object type
type MyObjectType = {
  isCanceled: boolean
  customer: {
    firstName: string
    lastName: string
    address: {
      street: string
      city: string
      zip: {
        house: number
        test: {
          something: string
        }
      }
    }
  }
}

// // This type will allow any valid deep path within MyObjectType
// type MyObjectPath = DeepPath<MyObjectType, keyof MyObjectType>

// Example of valid paths
const path1: ObjectPath<MyObjectType> = 'isCanceled' // Top-level property
const path2: ObjectPath<MyObjectType> = 'customer.firstName' // Nested property
const path3: ObjectPath<MyObjectType> = 'customer.address.street' // More deeply nested property

const path4: ObjectPath<MyObjectType> = 'customer.address.zip.house'
const path5: ObjectPath<MyObjectType> = 'customer.address.zip.test.something'
