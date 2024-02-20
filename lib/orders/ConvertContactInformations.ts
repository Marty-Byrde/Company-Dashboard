import { Customer } from 'hellocash-api/typings/Customer'
import Order from 'woocommerce-utils/helper/typings/Order'

export default function convertContactInformations({
  title_formatted: salutation,
  first_name: firstName,
  last_name: lastName,
  country,
  city,
  postcode: postCode,
  address_1,
  address_2,
  phone,
  company,
  email,
  state,
}: Order['shipping'] & { email?: string }): Omit<Customer, 'id' | 'timestamp'> {
  const { street, houseNumber } = convertAddress({ addess: mergeAddresses(address_1, address_2) })

  return {
    salutation,
    firstName,
    lastName,
    email: email ?? '',
    phone,
    country,
    city,
    postCode,
    street,
    houseNumber,
    birthday: null,
    notes: [],
    company,
    uid_number: '',
  }
}

/**
 * Combines the two addresses into one, as each order has to fields for the address (address_1 and address_2)
 * @param address1 Typically the main address
 * @param address2 Sometimes the address_2 is used for the housenumber or additional information
 */
function mergeAddresses(address1: string, address2: string) {
  if (address2.trim().length === 0) return address1

  const uniqueAddress2 = address2.replace(address1, '').trim()

  return address1 + ' ' + uniqueAddress2
}

/**
 * Converts the address into a street and a house number
 * @param initialAddress The address that is to be converted
 * @returns The street and the house number as a tuple
 */
function convertAddress({ addess: initialAddress }: { addess: string }) {
  let street = initialAddress
  let houseNumber: string = ''

  // if the address contains a number, then probabbly has a housenumber
  if (
    street.includes('0') ||
    street.includes('1') ||
    street.includes('2') ||
    street.includes('3') ||
    street.includes('4') ||
    street.includes('5') ||
    street.includes('6') ||
    street.includes('7') ||
    street.includes('8') ||
    street.includes('9')
  ) {
    let index = street.search(/\d/)
    houseNumber = street.slice(index)
    street = street.slice(0, index)
  }

  return { street, houseNumber }
}

/**
 * Checks if the billing and shipping addresses are different
 * @param billing
 * @param shipping
 */
export function hasDifferentAddresses({ order }: { order: Order | null }) {
  if (!order) return false
  const { billing, shipping } = order

  return (
    billing.first_name !== shipping.first_name ||
    billing.last_name !== shipping.last_name ||
    billing.address_1 !== shipping.address_1 ||
    billing.address_2 !== shipping.address_2 ||
    billing.city !== shipping.city ||
    billing.postcode !== shipping.postcode ||
    billing.country !== shipping.country
  )
}
