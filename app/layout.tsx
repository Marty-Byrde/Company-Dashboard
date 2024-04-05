import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import SideBar from '@/app/(components)/root/NavigationBar/SideBar'
import structureClasses from '@/lib/Shared/structureClasses'
import { useColorModeValue } from '@/lib/Shared/ColorModeHandler'
import AuthProvider from '@/app/(components)/root/AuthProvider'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

const ColorSettings = {
  lightBackground: 'bg-neutral-100',
  raw_darkBackground: 'bg-neutral-800',
  darkBackground: 'dark:bg-neutral-800',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const { lightBackground, darkBackground, raw_darkBackground } = ColorSettings

  return (
    <html lang='en' className={structureClasses(useColorModeValue(lightBackground, `dark ${raw_darkBackground}`), '')}>
      <body className={inter.className}>
        <AuthProvider>
          <SideBar />
          {/*  Children Container takes up the full height and width of the remaining space*/}
          <div className={structureClasses('fixed inset-0 top-14 flex flex-col px-4 py-4 text-gray-700 dark:text-gray-200 lg:inset-y-0 lg:ml-72', lightBackground, darkBackground)}>
            <div className='relative h-full w-full'>{children}</div>
          </div>
        </AuthProvider>
        <ToastContainer position='top-right' autoClose={3000} stacked />
      </body>
    </html>
  )
}
