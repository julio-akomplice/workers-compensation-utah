'use client'

import React from 'react'
import { useRouter } from 'next/navigation'

type Props = {
  page: number
  totalPages: number
  limit: number
}

export const BlogPageClient: React.FC<Props> = ({ page, totalPages }) => {
  const router = useRouter()
  const hasNextPage = page < totalPages
  const hasPrevPage = page > 1

  // Build visible page numbers
  const pages: (number | string)[] = []
  for (let i = 1; i <= totalPages; i++) {
    if (i <= 4 || i === totalPages) {
      pages.push(i)
    } else if (i === 5 && totalPages > 5) {
      pages.push('...')
    }
  }

  return (
    <div className="mt-[60px] flex items-center justify-center gap-[10px]">
      {/* Previous Arrow */}
      <button
        onClick={() => hasPrevPage && router.push(`/posts/page/${page - 1}`)}
        disabled={!hasPrevPage}
        className={`flex h-[44px] w-[44px] items-center justify-center rounded-full border border-navy-100 transition-colors ${
          hasPrevPage
            ? 'cursor-pointer hover:border-navy-400'
            : 'cursor-not-allowed opacity-30'
        }`}
        aria-label="Previous page"
      >
        <svg
          width="18"
          height="14"
          viewBox="0 0 18 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="rotate-180"
        >
          <path
            d="M11.15 7.99999H1C0.71667 7.99999 0.47917 7.90416 0.2875 7.71249C0.0958334 7.52083 0 7.28333 0 6.99999C0 6.71666 0.0958334 6.47916 0.2875 6.28749C0.47917 6.09583 0.71667 5.99999 1 5.99999H11.15L8.3 3.14999C8.1 2.94999 8.00417 2.71666 8.0125 2.44999C8.02084 2.18333 8.11667 1.94999 8.3 1.74999C8.5 1.54999 8.7375 1.44583 9.0125 1.43749C9.2875 1.42916 9.525 1.52499 9.725 1.72499L14.3 6.29999C14.4 6.39999 14.4708 6.50833 14.5125 6.62499C14.5542 6.74166 14.575 6.86666 14.575 6.99999C14.575 7.13333 14.5542 7.25833 14.5125 7.37499C14.4708 7.49166 14.4 7.59999 14.3 7.69999L9.725 12.275C9.525 12.475 9.2875 12.5708 9.0125 12.5625C8.7375 12.5542 8.5 12.45 8.3 12.25C8.11667 12.05 8.02084 11.8167 8.0125 11.55C8.00417 11.2833 8.1 11.05 8.3 10.85L11.15 7.99999Z"
            fill="#4D6D8E"
          />
        </svg>
      </button>

      {/* Page Numbers */}
      {pages.map((p, index) => {
        if (p === '...') {
          return (
            <span
              key={`ellipsis-${index}`}
              className="flex h-[44px] w-[20px] items-center justify-center text-[16px] font-medium tracking-[-0.32px] text-navy-200"
            >
              ...
            </span>
          )
        }

        const pageNum = p as number
        const isActive = pageNum === page

        return (
          <button
            key={pageNum}
            onClick={() => router.push(`/posts/page/${pageNum}`)}
            className={`flex h-[44px] w-[20px] items-center justify-center text-[16px] font-medium tracking-[-0.32px] transition-colors ${
              isActive ? 'text-dark-blue' : 'cursor-pointer text-navy-200 hover:text-navy-400'
            }`}
            aria-label={`Go to page ${pageNum}`}
            aria-current={isActive ? 'page' : undefined}
          >
            {pageNum}
          </button>
        )
      })}

      {/* Next Arrow */}
      <button
        onClick={() => hasNextPage && router.push(`/posts/page/${page + 1}`)}
        disabled={!hasNextPage}
        className={`flex h-[44px] w-[44px] items-center justify-center rounded-full border border-navy-100 transition-colors ${
          hasNextPage
            ? 'cursor-pointer hover:border-navy-400'
            : 'cursor-not-allowed opacity-30'
        }`}
        aria-label="Next page"
      >
        <svg
          width="18"
          height="14"
          viewBox="0 0 18 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M11.15 7.99999H1C0.71667 7.99999 0.47917 7.90416 0.2875 7.71249C0.0958334 7.52083 0 7.28333 0 6.99999C0 6.71666 0.0958334 6.47916 0.2875 6.28749C0.47917 6.09583 0.71667 5.99999 1 5.99999H11.15L8.3 3.14999C8.1 2.94999 8.00417 2.71666 8.0125 2.44999C8.02084 2.18333 8.11667 1.94999 8.3 1.74999C8.5 1.54999 8.7375 1.44583 9.0125 1.43749C9.2875 1.42916 9.525 1.52499 9.725 1.72499L14.3 6.29999C14.4 6.39999 14.4708 6.50833 14.5125 6.62499C14.5542 6.74166 14.575 6.86666 14.575 6.99999C14.575 7.13333 14.5542 7.25833 14.5125 7.37499C14.4708 7.49166 14.4 7.59999 14.3 7.69999L9.725 12.275C9.525 12.475 9.2875 12.5708 9.0125 12.5625C8.7375 12.5542 8.5 12.45 8.3 12.25C8.11667 12.05 8.02084 11.8167 8.0125 11.55C8.00417 11.2833 8.1 11.05 8.3 10.85L11.15 7.99999Z"
            fill="#4D6D8E"
          />
        </svg>
      </button>
    </div>
  )
}
