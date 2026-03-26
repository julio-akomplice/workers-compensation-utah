import React from 'react'
import Link from 'next/link'

import { cn } from '@/utilities/ui'

export type BreadcrumbItem = {
  label: string
  href?: string
}

type Props = {
  items: BreadcrumbItem[]
  theme?: 'white' | 'offWhite'
  className?: string
}

const HomeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="22"
    height="22"
    viewBox="0 0 22 22"
    fill="none"
  >
    <mask
      id="mask0_breadcrumb_home"
      style={{ maskType: 'alpha' }}
      maskUnits="userSpaceOnUse"
      x="0"
      y="0"
      width="22"
      height="22"
    >
      <rect width="22" height="22" fill="#D9D9D9" />
    </mask>
    <g mask="url(#mask0_breadcrumb_home)">
      <path
        d="M3.66797 17.4163V9.16634C3.66797 8.87606 3.7329 8.60106 3.86276 8.34134C3.99262 8.08162 4.17214 7.86773 4.4013 7.69967L9.9013 3.57467C10.2221 3.33023 10.5888 3.20801 11.0013 3.20801C11.4138 3.20801 11.7805 3.33023 12.1013 3.57467L17.6013 7.69967C17.8305 7.86773 18.01 8.08162 18.1398 8.34134C18.2697 8.60106 18.3346 8.87606 18.3346 9.16634V17.4163C18.3346 17.9205 18.1551 18.3521 17.7961 18.7111C17.4371 19.0702 17.0055 19.2497 16.5013 19.2497H13.7513C13.4916 19.2497 13.2739 19.1618 13.0982 18.9861C12.9225 18.8104 12.8346 18.5927 12.8346 18.333V13.7497C12.8346 13.49 12.7468 13.2722 12.5711 13.0965C12.3954 12.9209 12.1777 12.833 11.918 12.833H10.0846C9.82491 12.833 9.6072 12.9209 9.43151 13.0965C9.25582 13.2722 9.16797 13.49 9.16797 13.7497V18.333C9.16797 18.5927 9.08012 18.8104 8.90443 18.9861C8.72873 19.1618 8.51102 19.2497 8.2513 19.2497H5.5013C4.99714 19.2497 4.56554 19.0702 4.20651 18.7111C3.84748 18.3521 3.66797 17.9205 3.66797 17.4163Z"
        fill="#FA681C"
      />
    </g>
  </svg>
)

export const ChevronSeparator = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="22"
    height="22"
    viewBox="0 0 22 22"
    fill="none"
    aria-hidden="true"
  >
    <mask
      id="mask0_breadcrumb_sep"
      style={{ maskType: 'alpha' }}
      maskUnits="userSpaceOnUse"
      x="0"
      y="0"
      width="22"
      height="22"
    >
      <rect width="22" height="22" fill="#D9D9D9" />
    </mask>
    <g mask="url(#mask0_breadcrumb_sep)">
      <path
        d="M8.77702 11.0001L5.22494 7.42507C5.05688 7.25701 4.96903 7.04694 4.9614 6.79486C4.95376 6.54277 5.0416 6.32507 5.22494 6.14173C5.39299 5.97368 5.60688 5.88965 5.8666 5.88965C6.12633 5.88965 6.34022 5.97368 6.50827 6.14173L10.7249 10.3584C10.8166 10.4501 10.8815 10.5494 10.9197 10.6563C10.9579 10.7633 10.977 10.8778 10.977 11.0001C10.977 11.1223 10.9579 11.2369 10.9197 11.3438C10.8815 11.4508 10.8166 11.5501 10.7249 11.6417L6.50827 15.8584C6.34022 16.0265 6.13015 16.1143 5.87806 16.1219C5.62598 16.1296 5.40827 16.0417 5.22494 15.8584C5.05688 15.6903 4.97285 15.4765 4.97285 15.2167C4.97285 14.957 5.05688 14.7431 5.22494 14.5751L8.77702 11.0001ZM14.827 11.0001L11.2749 7.42507C11.1069 7.25701 11.019 7.04694 11.0114 6.79486C11.0038 6.54277 11.0916 6.32507 11.2749 6.14173C11.443 5.97368 11.6569 5.88965 11.9166 5.88965C12.1763 5.88965 12.3902 5.97368 12.5583 6.14173L16.7749 10.3584C16.8666 10.4501 16.9315 10.5494 16.9697 10.6563C17.0079 10.7633 17.027 10.8778 17.027 11.0001C17.027 11.1223 17.0079 11.2369 16.9697 11.3438C16.9315 11.4508 16.8666 11.5501 16.7749 11.6417L12.5583 15.8584C12.3902 16.0265 12.1801 16.1143 11.9281 16.1219C11.676 16.1296 11.4583 16.0417 11.2749 15.8584C11.1069 15.6903 11.0229 15.4765 11.0229 15.2167C11.0229 14.957 11.1069 14.7431 11.2749 14.5751L14.827 11.0001Z"
        fill="#CCD5DF"
      />
    </g>
  </svg>
)

export const Breadcrumbs: React.FC<Props> = ({ items, theme = 'white', className }) => {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn('w-full bg-white', theme === 'offWhite' && 'bg-off-white', className)}
    >
      <div className="container mx-auto px-5 md:px-8 lg:px-4">
        <ol className="flex items-center gap-1.5 py-4 border-b border-navy-30">
          {/* Home */}
          <li className="flex items-center gap-1.5">
            <Link href="/" aria-label="Home">
              <HomeIcon />
            </Link>
          </li>

          {/* Breadcrumb items */}
          {items.map((item, index) => {
            const isLast = index === items.length - 1

            return (
              <li key={index} className="flex items-center gap-1.5">
                <ChevronSeparator />
                {isLast || !item.href ? (
                  <span className="text-[14px] font-medium leading-[22px] tracking-[-0.28px] text-navy-500 line-clamp-1">
                    {item.label}
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    className="text-[14px] font-medium leading-[22px] tracking-[-0.28px] text-orange hover:text-navy-1000 transition-colors whitespace-nowrap"
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            )
          })}
        </ol>
      </div>
    </nav>
  )
}
