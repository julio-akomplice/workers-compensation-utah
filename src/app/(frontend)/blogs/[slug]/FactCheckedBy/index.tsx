import React from 'react'

import type { Template } from '@/payload-types'
import { Media } from '@/components/Media'

type Props = {
  data?: Template['blogPost']
}

export const FactCheckedBy: React.FC<Props> = ({ data }) => {
  const factCheckedBy = data?.factCheckedBy
  if (!factCheckedBy?.title) return null

  return (
    <div className="mt-[40px] flex items-center rounded-[10px] bg-off-white">
      {factCheckedBy.image && typeof factCheckedBy.image !== 'string' && (
        <div className="relative hidden w-[240px] shrink-0 self-stretch overflow-hidden rounded-l-[10px] sm:block">
          <Media resource={factCheckedBy.image} fill imgClassName="!h-full object-cover" />
        </div>
      )}
      <div className="flex flex-1 flex-col gap-4 p-6 sm:p-[30px]">
        <h3 className="text-[20px] font-semibold leading-[24px] tracking-[-0.6px] text-black">
          {factCheckedBy.title}
        </h3>
        {factCheckedBy.description && (
          <p className="text-[16px] font-normal leading-[24px] tracking-[-0.32px] text-deep-blue-900">
            {factCheckedBy.description}
          </p>
        )}
      </div>
    </div>
  )
}
