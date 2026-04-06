import type { BlockquoteBlock as BlockquoteBlockProps } from '@/payload-types'
import { cn } from '@/utilities/ui'
import React from 'react'

type Props = {
  className?: string
} & BlockquoteBlockProps

export const BlockquoteBlock: React.FC<Props> = ({ className, quote, author }) => {
  return (
    <blockquote className={cn('my-[40px] flex gap-[30px] items-center', className)}>
      <div className="w-[3px] shrink-0 self-stretch bg-orange" />
      <div className="flex-1">
        <p className="text-[18px] font-semibold leading-[25px] tracking-[-0.36px] text-deep-blue-900">
          {quote}
        </p>
        {author && (
          <p className="mt-2 text-[17px] font-normal leading-[28px] tracking-[-0.34px] text-[#667380]">
            – {author}
          </p>
        )}
      </div>
    </blockquote>
  )
}
