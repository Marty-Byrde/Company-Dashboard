import PDFViewer from '@/components/Shared/Pdf/PDFViewer'
import getHellocashAPI from '@/lib/Shared/HelloCash'
import { notFound } from 'next/navigation'

export default async function InvoicePDFPage({ params }: { params: { _id?: string } }) {
  const { getInvoiceBase64 } = getHellocashAPI()
  if (!params._id) return notFound()

  const base64 = await getInvoiceBase64(params._id)
  return (
    <>
      <h1 className='mb-4 text-xl font-semibold'>
        Invoice PDF for: <span className='pl-2'>{params._id}</span>
      </h1>

      <PDFViewer base64={base64} className='mx-auto h-[94%] w-[95%]' />
    </>
  )
}
