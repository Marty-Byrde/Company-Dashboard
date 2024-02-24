'use client'
import useContextHandler from '@/hooks/Shared/Context/useContextHandler'
import ReactState from '@/typings/ReactState'
import { Customer } from 'hellocash-api/typings/Customer'
import { createContext, ReactNode, useId, useState } from 'react'
import Order from 'woocommerce-utils/helper/typings/Order'

interface CustomerRegistrationContextProps {
  order: Order | null
  setOrder: ReactState<CustomerRegistrationContextProps['order']>['setState']

  baseInformation: 'billing' | 'shipping'
  setBaseInformation: ReactState<CustomerRegistrationContextProps['baseInformation']>['setState']

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
  const [order, setOrder] = useState<CustomerRegistrationContextProps['order']>(null)
  const [baseInformation, setBaseInformation] = useState<CustomerRegistrationContextProps['baseInformation']>('billing')

  return (
    <Context.Provider key={useId()} value={{ customer, setCustomer, baseInformation, setBaseInformation, order, setOrder }}>
      {children}
    </Context.Provider>
  )
}
