'use client'
import { ButtonHTMLAttributes } from 'react'
import { FireIcon } from '@heroicons/react/20/solid'
import Image from 'next/image'

interface CommandOption {
  name: string
  value: string
  icon: typeof FireIcon
  iconColor: string | 'text-gray-400'
  bgColor: string | 'bg-red-400'
}

interface CommendFeedProps {
  action?: ButtonHTMLAttributes<any>['formAction']
  options?: CommandOption[]
}

export default function WriteCommentFeed({ action }: CommendFeedProps) {
  return (
    <div className='mt-6 flex gap-x-3'>
      <Image
        width={24}
        height={24}
        src='https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
        alt=''
        className='h-6 w-6 flex-none rounded-full bg-gray-50'
      />

      <form className='relative flex-auto'>
        <div className='flex overflow-hidden rounded-lg pb-12 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600 dark:focus-within:ring-gray-200/90'>
          <label htmlFor='comment' className='sr-only'>
            Add your comment
          </label>

          <textarea
            rows={2}
            name='comment'
            id='comment'
            className='mr-2 mt-2 block flex-1 resize-none border-0 bg-transparent py-1.5 text-gray-900 placeholder:text-gray-400 focus:ring-0 dark:text-gray-400 sm:text-sm sm:leading-6'
            placeholder='Add your comment...'
            defaultValue={''}
          />
        </div>

        <div className='absolute inset-x-0 bottom-0 flex justify-end py-2 pl-3 pr-2'>
          <button
            formAction={action}
            className='rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-300/90 dark:hover:bg-gray-300'>
            Comment
          </button>
        </div>
      </form>
    </div>
  )
}
