import Image from 'next/image'
import placeholderImage from '@/assets/placeholder/image-wcu-placeholder-cards.webp'
import { cn } from '@/utilities/ui'

type Props = {
  className?: string
}

export const PlaceholderImage: React.FC<Props> = ({ className }) => {
  return (
    <Image
      src={placeholderImage}
      alt="Placeholder"
      className={cn('h-full w-full object-cover', className)}
    />
  )
}
