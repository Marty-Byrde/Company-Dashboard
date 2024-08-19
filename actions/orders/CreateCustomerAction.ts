'use server'
import { Customer, RawCustomers } from 'hellocash-api/typings/Customer'
import getHellocashAPI from '@/lib/Shared/HelloCash'

interface SuccessReponse {
  status: 'sucess'
  response: RawCustomers['users'][number]
}

interface ErrorResponse {
  status: 'error'
  duplicates?: Customer[]
  error?: unknown
}

export default async function CreateCustomerAction(customer: Partial<Customer>): Promise<SuccessReponse | ErrorResponse> {
  const { createUser, findExactCustomer } = getHellocashAPI()
  const { firstName, lastName, country, city, postCode, street, houseNumber } = customer

  //* Phone and Email format could differ, thus excluded from the check
  const duplicates = await findExactCustomer({ firstName, lastName, country, city, postCode, street, houseNumber })

  if (duplicates.length > 0) {
    return {
      status: 'error',
      duplicates: duplicates,
    }
  }

  customer.notes?.push(`Automatisch erstellt am ${getCurrentDate()}`)
  customer.notes?.push(`Erstellt von Company-Dashboard`)

  console.log('Going to create a new customer...')

  return await createUser(customer)
    .then((response) => ({ status: 'sucess', response: response }) satisfies SuccessReponse)
    .catch((err) => ({ status: 'error', error: err }) satisfies ErrorResponse)
}

function getCurrentDate() {
  let date = new Date().toLocaleDateString('de')
  let time = new Date().toLocaleTimeString('de')

  date = date
    .split('.')
    .map((el) => (el.length === 1 ? '0' + el : el))
    .join('.')
  time = time
    .split(':')
    .map((el) => (el.length === 1 ? '0' + el : el))
    .join(':')

  return `${date} ${time}`
}
