import useBackend from '@/hooks/Shared/Fetch/useBackend'
import { Invoice } from 'hellocash-api/typings/Invoice'
import Table from '@/components/Shared/Table/Table'
import InvoicePDFButton from '@/components/invoices/InvoicePDFButton'

export default async function InvoicesPage() {
  let invoices = await useBackend<Invoice[]>('/invoices?limit=-1', { next: { revalidate: 3600 * 24, tags: ['invoices'] } })

  let tablarizedInvoices = invoices
    .map((invoice) => ({
      ...invoice,
      paymentType: invoice.paymentType.includes('-') ? invoice.paymentType.split('-')[1] : invoice.paymentType,
      _total: invoice.total.toFixed(2) + ' €',
      _customerName: invoice.customer ? `${invoice.customer.firstName} ${invoice.customer.lastName}` : ``,
      _itemCount: `${invoice.items.length} item${invoice.items.length > 1 ? 's' : ''}`,
      _date: new Date(invoice.timestamp)
        .toLocaleDateString('de')
        .split('.')
        .map((seg) => (seg.length >= 2 ? seg : '0' + seg))
        .join('.'),
    }))
    .filter((i) => i.paymentType !== 'Signatur')

  return (
    <>
      <h1 className='mb-6 text-2xl font-semibold'>Articles</h1>

      <Table<(typeof tablarizedInvoices)[number]>
        itemButtons={InvoicePDFButton}
        labels={{ id: 'ID', _customerName: 'Kunde', _date: 'Datum', paymentType: 'Payment Type', _itemCount: 'Artikel', _total: 'Total' }}
        visibilities={{
          id: 'hidden min-w-20 @xl:table-cell',
          paymentType: 'text-center min-w-48 pr-6 hidden @xl:table-cell',
          _customerName: 'w-[100%]',
          _itemCount: 'hidden pr-4 @3xl:table-cell whitespace-nowrap',
          _total: 'hidden @2xl:table-cell whitespace-nowrap',
          itemButtons: 'text-center',
        }}
        noDefaultLabels
        items={tablarizedInvoices}
        searchFilter={['id', 'paymentType', '_customerName', '_date']}
      />
    </>
  )
}
