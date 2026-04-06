import React from 'react'
import Link from 'next/link'

import type { Post } from '@/payload-types'
import { ArrowIcon } from '@/components/ui/ArrowIcon'

type Props = {
  previousPost?: Pick<Post, 'slug' | 'title'> | null
  nextPost?: Pick<Post, 'slug' | 'title'> | null
}

export const PostNavigation: React.FC<Props> = ({ previousPost, nextPost }) => {
  if (!previousPost && !nextPost) return null

  return (
    <nav className="mt-16 flex items-start justify-between border-t border-navy-30 pt-10">
      {/* Previous */}
      {previousPost ? (
        <Link href={`/posts/${previousPost.slug}`} className="group flex max-w-[206px] flex-col items-start gap-4">
          <span className="flex size-[44px] items-center justify-center rounded-full border border-navy-200 transition-colors group-hover:border-deep-blue-900">
            <ArrowIcon className="size-6 rotate-180 text-navy-200 transition-colors group-hover:text-deep-blue-900" />
          </span>
          <div className="flex flex-col gap-2">
            <span className="text-[16px] font-medium leading-normal tracking-[-0.32px] text-deep-blue-900">
              Previous Post
            </span>
            <span className="text-[16px] font-semibold leading-normal tracking-[-0.32px] text-deep-blue-900">
              {previousPost.title}
            </span>
          </div>
        </Link>
      ) : (
        <div />
      )}

      {/* Next */}
      {nextPost ? (
        <Link href={`/posts/${nextPost.slug}`} className="group flex max-w-[206px] flex-col items-end gap-4">
          <span className="flex size-[44px] items-center justify-center rounded-full border border-navy-200 transition-colors group-hover:border-deep-blue-900">
            <ArrowIcon className="size-6 text-navy-200 transition-colors group-hover:text-deep-blue-900" />
          </span>
          <div className="flex flex-col gap-2 text-right">
            <span className="text-[16px] font-medium leading-normal tracking-[-0.32px] text-deep-blue-900">
              Next Post
            </span>
            <span className="text-[16px] font-semibold leading-normal tracking-[-0.32px] text-deep-blue-900">
              {nextPost.title}
            </span>
          </div>
        </Link>
      ) : (
        <div />
      )}
    </nav>
  )
}
