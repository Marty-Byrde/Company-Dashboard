'use server'
import { Customer, RawCustomers } from 'hellocash-api/typings/Customer'
import getHellocashAPI from '@/lib/Shared/HelloCash'
import { logVerbose, logWarning } from '@/lib/Shared/Logs/Logger'

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
    logWarning(`[CreateCustomerAction]: Customer (${firstName} ${lastName}) already exists ${duplicates.length} duplicates found.`)
    return {
      status: 'error',
      duplicates: duplicates,
    }
  }

  customer.notes?.push(`Automatisch erstellt am ${getCurrentDate()}`)
  customer.notes?.push(`Erstellt von Company-Dashboard`)

  return await createUser(customer)
    .then((response) => {
      logVerbose(`[CreateCustomerAction]: Customer (${firstName} ${lastName}) created successfully`)
      return { status: 'sucess', response: response } satisfies SuccessReponse
    })
    .catch((err) => {
      logWarning(`[CreateCustomerAction]: Customer (${firstName} ${lastName}) could not be created`, err)
      return { status: 'error', error: err } satisfies ErrorResponse
    })
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
