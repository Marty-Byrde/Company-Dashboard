import { SideElementProps } from '@/app/(components)/root/NavigationBar/SideElement'
import DesktopSidebar from '@/app/(components)/root/NavigationBar/DesktopSidebar'
import MobileSidebar from '@/app/(components)/root/NavigationBar/MobileSidebar'
import getSessionData from '@/lib/Shared/getSessionData'

export interface SideBarProps {
  title: string
  elements: SideElementProps[]
}

export default async function SideBar() {
  const { data } = await getSessionData()
  const props: SideBarProps = {
    title: 'Dashboard',
    elements: [
      { name: 'Home', icon: 'HomeIcon', href: '/' },
      {
        name: 'Orders',
        icon: 'FolderIcon',
        href: '/orders',
      },
    ],
  }
  const managementElements: SideElementProps[] = [
    {
      icon: 'LockOpenIcon',
      name: 'Management',
      href: '/manage',
    },
  ]

  if (data?.managementAccess) props.elements.push(...managementElements)

  return (
    <>
      <MobileSidebar {...props} />
      <DesktopSidebar {...props} />
    </>
  )
}
