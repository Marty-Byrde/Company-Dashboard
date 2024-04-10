'use server'
import { twMerge } from 'tailwind-merge'

export default async function PDFViewer({ base64, className }: { base64: string; className?: string }) {
  if (!base64) return null
  return <embed className={twMerge('h-full w-full', className)} src={`data:application/pdf;base64,${base64}`} />
}
