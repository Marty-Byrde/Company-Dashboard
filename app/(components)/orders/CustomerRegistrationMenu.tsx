'use client'
import { useEffect } from 'react'
import useManipulation from '../Shared/Manipulation/useManipulation'
import { useSlideOver } from '../Shared/Slideover/SlideoverProvider'
import { useCustomerSlideOverContext } from './RegistrationProvider'

export default function CustomerRegistrationMenu() {
  const { close } = useSlideOver()

  return (
    <form>
      <div className='flex flex-1 flex-col gap-4 overflow-y-auto px-4 pb-4'>
        <CustomerProps />
      </div>
      <div className='mt-4 flex justify-center gap-4 border-t-2 px-4 py-4 dark:border-t-neutral-700'>
        <button className='rounded-md px-4 py-2 ring-1 dark:text-gray-300/90 dark:ring-gray-400/60' onClick={close} type='button'>
          Close Menu
        </button>
        <button className='rounded-md px-4 py-2 dark:bg-green-500/40 dark:text-gray-300 dark:hover:bg-green-500/60 dark:hover:text-gray-200 dark:active:bg-green-500/70' type='submit'>
          Kunde Anlegen
        </button>
      </div>
    </form>
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

      <hr className='my-2 border-dashed border-neutral-400' />
      <h2 className='text-center text-lg font-semibold dark:text-gray-200'>Anschrift</h2>

      <Input label='Land' path='country' required />
      <Input label='Stadt' path='city' required />
      <Input label='PLZ' path='postCode' required />
      <Input label='Adresse' path='street' required />
      <Input label='Hausnummer' path='houseNumber' required inputClassName='min-w-1' />

      <hr className='my-2 border-dashed border-neutral-400' />
      <h2 className='text-center text-lg font-semibold dark:text-gray-200'>Optional</h2>
      <Input label='Firma' path='company' />
      <Input label='ATU Nr.' path='uid_number' />
    </Container>
  )
}
