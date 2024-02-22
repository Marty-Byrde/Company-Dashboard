'use server'
import { Customer, RawCustomers } from 'hellocash-api/typings/Customer'
import getHellocashAPI from '@/lib/Shared/HelloCash'

interface SuccessReponse {
  status: 'sucess'
  response: RawCustomers['users'][number]
}

interface ErrorResponse {
  status: 'error'
  duplicates: Customer[]
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

  return {
    status: 'sucess',
    response: await createUser(customer),
  }
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
