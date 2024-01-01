import { ComponentType } from 'react'
import IconProps from '@/typings/Icon'
import { AdjustmentsVerticalIcon, BuildingStorefrontIcon, CursorArrowRaysIcon, FolderIcon, HomeIcon, LockOpenIcon, ShoppingBagIcon } from "@heroicons/react/24/outline"
// import FolderIcon from '@/public/next.svg'
// import BuildingStoreFrontIcon from '@/public/next.svg'
// import CursorArrowRaysIcon from '@/public/next.svg'
// import ShoppingBagIcon from '@/public/next.svg'
// import HomeIcon from '@/public/next.svg'
// import AdjustmentsVerticalIcon from '@/public/next.svg'
// import LockOpenIcon from '@/public/next.svg'

export interface useIconProps {
  iconName: 'FolderIcon' | 'AdjustmentsVerticalIcon' | 'BuildingStoreFrontIcon' | 'CursorArrowRaysIcon' | 'HomeIcon' | 'ShoppingBagIcon' | 'LockOpenIcon' | undefined
}

export default function useIcon(iconName: useIconProps['iconName']) {
  let Icon = (): ComponentType<IconProps> => {
    switch (iconName) {
      case 'FolderIcon':
        return FolderIcon

      case 'AdjustmentsVerticalIcon':
        return AdjustmentsVerticalIcon

      case 'HomeIcon':
        return HomeIcon

      case 'BuildingStoreFrontIcon':
        return BuildingStorefrontIcon

      case 'CursorArrowRaysIcon':
        return CursorArrowRaysIcon

      case 'ShoppingBagIcon':
        return ShoppingBagIcon

      case 'LockOpenIcon':
        return LockOpenIcon

      default:
        return () => null
    }
  }

  return Icon()
}
