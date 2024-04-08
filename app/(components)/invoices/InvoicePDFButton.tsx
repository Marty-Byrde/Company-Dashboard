'use client'

import Link from 'next/link'
import { twMerge } from 'tailwind-merge'
import { TableElement } from '@/typings/Shared/Table/Types'
import { Invoice } from 'hellocash-api/typings/Invoice'
import 'primeicons/primeicons.css'

/**
 * Item-Button that redirects the user to the /invoices/pdf/:id route to display the pdf of the given item (invoice).
 */
export default function InvoicePDFButton<T extends Invoice>({ item: invoice }: { item: TableElement<T> }) {
  return (
    <div className='inline-block'>
      <Link
        href={'/invoices/pdf/' + invoice._id}
        className={twMerge(
          'flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-md bg-red-400/15 px-3 py-1.5 text-sm opacity-90 ring-1 ring-red-400 hover:bg-red-400/30 active:bg-red-400/45 dark:bg-red-600/15 dark:ring-red-600 dark:hover:bg-red-600/25 dark:active:bg-red-600/45',
        )}>
        <i className='pi pi-file-pdf' />
        <span className='hidden @3xl:block'>Open PDF</span>
      </Link>
    </div>
  )
}
