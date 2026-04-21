import React from 'react'
import Link from 'next/link'

type RelatedPage = {
  title: string
  href: string
}

type Props = {
  title?: string
  pages: RelatedPage[]
}

export const RelatedPages: React.FC<Props> = ({ title = 'Related Pages', pages }) => {
  if (pages.length === 0) return null

  return (
    <div className="rounded-[15px] bg-deep-blue-1000 px-5 pb-5 pt-6">
      <h3 className="mb-5 text-center text-[24px] font-semibold leading-[28px] tracking-[-0.72px] text-white">
        {title}
      </h3>
      <div className="flex flex-col">
        {pages.map((page, index) => (
          <React.Fragment key={page.href}>
            <Link
              href={page.href}
              className="py-2 text-center text-[16px] font-normal leading-normal tracking-[-0.32px] text-navy-100 transition-colors hover:text-white"
            >
              {page.title}
            </Link>
            {index < pages.length - 1 && <hr className="border-navy-700" />}
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}
