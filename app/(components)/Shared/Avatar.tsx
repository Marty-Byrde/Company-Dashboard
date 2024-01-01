import Image from "next/image"
import { twMerge } from "tailwind-merge"

interface AvatarProps {
  img: any
  alt?: string
  width: number
  height: number
  className?: string
}

export default function Avatar(props: AvatarProps) {
  if(!props.img) return null

  return (
    <Image className={twMerge('h-6 w-auto rounded-full', props.className)} src={props.img} alt={props.alt ?? ''} width={props.width} height={props.height} />
  )
}