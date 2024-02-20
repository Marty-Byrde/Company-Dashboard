'use client'
import { useEffect } from 'react'
import useManipulation from '../Shared/Manipulation/useManipulation'
import { useSlideOver } from '../Shared/Slideover/SlideoverProvider'
import { useCustomerSlideOverContext } from './RegistrationProvider'
import orderConversionUtils, { hasDifferentAddresses } from '@/lib/orders/OrderConversionUtils'
import { twMerge } from 'tailwind-merge'
import { ExclamationCircleIcon } from '@heroicons/react/24/outline'

export default function CustomerRegistrationMenu() {
  const { close } = useSlideOver()
  const { order, baseInformation } = useCustomerSlideOverContext()

  return (
    <form>
      <WarningMenu shown={hasDifferentAddresses({ order })} />

      <div className='flex flex-1 flex-col gap-4 overflow-y-auto px-4 pb-4'>
        <CustomerProps key={order?.id + baseInformation} />
      </div>
      <div className='mt-4 flex justify-center gap-4 border-t-2 border-t-neutral-500 px-4 py-4 dark:border-t-neutral-700'>
        <button className='rounded-md px-4 py-2 text-gray-600 ring-1 ring-gray-400 dark:text-gray-300/90 dark:ring-gray-400/60' onClick={close} type='button'>
          Close Menu
        </button>
        <button
          className='rounded-md bg-green-500/40 px-4 py-2 text-gray-600 hover:bg-green-500/50 active:bg-green-500/70 dark:bg-green-500/40 dark:text-gray-300 dark:hover:bg-green-500/60 dark:hover:text-gray-200 dark:active:bg-green-500/70'
          type='submit'>
          Kunde Anlegen
        </button>
      </div>
    </form>
  )
}

/**
 * Displays a warning if the billing and shipping addresses are different. The user can then select which address he wants to use.
 * @param shown If the warning should be shown
 */
function WarningMenu({ shown }: { shown: boolean }) {
  const { baseInformation, setBaseInformation, order, setCustomer } = useCustomerSlideOverContext()

  return (
    <div className={twMerge('-mt-4 hidden pt-2', shown && 'mb-4 flex flex-col gap-4')}>
      <div className='flex items-center justify-center gap-2 font-semibold dark:text-orange-400'>
        <ExclamationCircleIcon height={28} className='stroke-2' width={28} />
        <span className='text-xs xs:text-sm md:text-base'>Rechnungsanschrift ungleich Lieferanschrift</span>
      </div>
      <div className='flex items-center justify-evenly'>
        <button
          type='button'
          className={twMerge('rounded-md px-4 py-2', baseInformation === 'billing' ? 'dark:bg-blue-500/60' : 'border dark:border-gray-500')}
          onClick={() => {
            setBaseInformation('billing')
            setCustomer(orderConversionUtils(order!.billing))
          }}>
          Rechnungsanschrift
        </button>
        <button
          type='button'
          className={twMerge('rounded-md px-4 py-2', baseInformation === 'shipping' ? 'dark:bg-blue-500/60' : 'border dark:border-gray-500')}
          onClick={() => {
            setBaseInformation('shipping')
            setCustomer(orderConversionUtils(order!.shipping))
          }}>
          Liefersanschrift
        </button>
      </div>
      <hr className='border-dashed border-neutral-400' />
    </div>
  )
}

function CustomerProps() {
  const { customer, setCustomer } = useCustomerSlideOverContext()
  const { Container, Input, containerProps } = useManipulation<typeof customer>({ object: customer, setObject: setCustomer })

  useEffect(() => {
    console.log(customer)
  }, [customer])

  if (!customer) return null

  return (
    <Container {...containerProps} className='flex-col flex-nowrap '>
      <div className='flex justify-evenly'>
        <Input label='Herr' required path='salutation' type='radio' name='salutation' defaultChecked={customer.salutation === 'Herr'} value='Herr' />
        <Input label='Frau' required path='salutation' type='radio' name='salutation' defaultChecked={customer.salutation === 'Frau'} value='Frau' />
      </div>
      <Input label='Vorname' path='firstName' required />
      <Input label='Nachname' path='lastName' required />
      <Input label='Tel' path='phone' type='tel' />
      <Input label='Email' path='email' type='email' />

      <hr className='my-2 border-dashed border-neutral-600 dark:border-neutral-400' />
      <h2 className='text-center text-lg font-semibold text-gray-700 dark:text-gray-200'>Anschrift</h2>

      <Input label='Land' path='country' required />
      <Input label='Stadt' path='city' required />
      <Input label='PLZ' path='postCode' required />
      <Input label='Adresse' path='street' required />
      <Input label='Hausnummer' path='houseNumber' required inputClassName='min-w-1' />

      <hr className='my-2 border-dashed border-neutral-600 dark:border-neutral-400' />
      <h2 className='text-center text-lg font-semibold text-gray-700 dark:text-gray-200'>Optional</h2>
      <Input label='Firma' path='company' />
      <Input label='ATU Nr.' path='uid_number' />
    </Container>
  )
}
