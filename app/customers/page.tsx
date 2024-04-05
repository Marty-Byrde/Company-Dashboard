import Table from '@/components/Shared/Table/Table'
import { Customer } from 'hellocash-api/typings/Customer'
import CustomerHistoryButton from '@/components/customers/CustomerHistoryButton'
import useBackend from '@/hooks/Shared/Fetch/useBackend'

export default async function CustomerPage() {
  let baseCustomers = await useBackend<Customer[]>('/customers?limit=-1', { next: { revalidate: 60, tags: ['customers'] } })

  type ExtendedCustomer = Customer & { name: string }
  const modifiedCustomers = baseCustomers.map((c: Customer): ExtendedCustomer => {
    const company = !!c.company && c.company !== 'null' ? c.company : ''

    return { ...c, name: `${c.firstName} ${c.lastName} ${company}`.trim() }
  })

  return (
    <div>
      <h1 className='mb-6 text-2xl font-semibold'>Customers</h1>

      <Table<ExtendedCustomer>
        itemButtons={CustomerHistoryButton}
        items={modifiedCustomers}
        noDefaultLabels
        searchFilter={['name', 'postCode', 'street', 'phone', 'email', 'city', 'company', 'country']}
        labels={{ salutation: 'Anrede', name: 'Name', street: 'Straße', postCode: 'Postleitzahl' }}
        visibilities={{
          salutation: 'min-w-24 hidden @md:table-cell',
          name: 'w-full text-sm @xs:text-base',
          street: 'hidden @xl:table-cell',
          postCode: 'text-center hidden @3xl:table-cell',
          itemButtons: 'min-w-36 text-center',
        }}
      />
    </div>
  )
}
