'use client'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { Fragment } from 'react'
import { twMerge } from 'tailwind-merge'
import { useSlideOver } from './SlideoverProvider'

interface SlideOverProps {
  maxWidth: string | 'max-w-sm'
  title?: string
  children?: React.ReactNode
}

export default function SlideOver({ title, maxWidth, children }: SlideOverProps) {
  const { open, close } = useSlideOver()

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as='div' className='relative z-50' onClose={close}>
        <div className='fixed inset-0' />

        <div className='fixed inset-0 overflow-hidden'>
          <div className='absolute inset-0 overflow-hidden '>
            <div className='pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16'>
              <Transition.Child
                as={Fragment}
                enter='transform transition ease-in-out duration-500 sm:duration-700'
                enterFrom='translate-x-full'
                enterTo='translate-x-0'
                leave='transform transition ease-in-out duration-500 sm:duration-700'
                leaveFrom='translate-x-0'
                leaveTo='translate-x-full'>
                <Dialog.Panel className={twMerge('pointer-events-auto w-screen max-w-md', maxWidth)}>
                  <div className='flex h-full flex-col overflow-y-auto overflow-x-hidden bg-gray-100 shadow-md shadow-gray-400 dark:bg-neutral-800 dark:shadow-neutral-700'>
                    <div className='mb-4 flex w-full items-center justify-between border-b-2 border-neutral-300 px-4 py-2 pb-2 dark:border-b-neutral-700'>
                      <h2 className='text-xl font-semibold text-gray-500 dark:text-gray-200'>{title}</h2>
                      <button
                        type='button'
                        className='relative rounded-md bg-gray-100/50 text-gray-400 ring-2 ring-transparent hover:text-gray-500 hover:ring-gray-300 dark:bg-neutral-700/40 dark:hover:text-gray-300 dark:hover:ring-neutral-700 dark:active:ring-gray-400'
                        onClick={close}>
                        <span className='absolute -inset-2.5' />
                        <span className='sr-only'>Close panel</span>
                        <XMarkIcon className='h-6 w-6' aria-hidden='true' />
                      </button>
                    </div>
                    {children}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}