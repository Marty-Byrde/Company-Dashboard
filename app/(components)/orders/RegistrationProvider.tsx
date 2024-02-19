'use client'
import useContextHandler from '@/hooks/Shared/Context/useContextHandler'
import ReactState from '@/typings/ReactState'
import { Customer } from 'hellocash-api/typings/Customer'
import { createContext, ReactNode, useState } from 'react'

interface CustomerRegistrationContextProps {
  customer: Omit<Customer, 'id' | 'timestamp'> | null
  setCustomer: ReactState<CustomerRegistrationContextProps['customer']>['setState']
}

const Context = createContext<CustomerRegistrationContextProps | null>(null)

// eslint-disable-next-line react-hooks/rules-of-hooks
export const useCustomerSlideOverContext = () => useContextHandler<CustomerRegistrationContextProps>(Context)

/**
 * Keeps track of the customer data that is being rendered to the user for the registration process
 * @returns
 */
export default function RegistrationProvider({ children }: { children: ReactNode }) {
  const [customer, setCustomer] = useState<Omit<Customer, 'id' | 'timestamp'> | null>(null)

  return <Context.Provider value={{ customer, setCustomer }}>{children}</Context.Provider>
}
