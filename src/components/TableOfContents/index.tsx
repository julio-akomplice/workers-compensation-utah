'use client'

import React, { useEffect, useState } from 'react'

type TOCItem = {
  id: string
  label: string
}

type Props = {
  items: TOCItem[]
  className?: string
}

export const TableOfContents: React.FC<Props> = ({ items, className }) => {
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    if (items.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        }
      },
      { rootMargin: '-100px 0px -60% 0px', threshold: 0 },
    )

    for (const item of items) {
      const el = document.getElementById(item.id)
      if (el) observer.observe(el)
    }

    return () => observer.disconnect()
  }, [items])

  if (items.length === 0) return null

  return (
    <nav className={className}>
      <p className="text-h5 font-semibold tracking-[-0.72px] text-off-black">On This Page</p>
      <div className="mt-5 flex flex-col gap-3">
        {items.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            onClick={(e) => {
              e.preventDefault()
              const el = document.getElementById(item.id)
              if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'start' })
                setActiveId(item.id)
              }
            }}
            className={`text-body font-semibold tracking-[-0.32px] transition-colors ${
              activeId === item.id ? 'text-orange' : 'text-navy-800 hover:text-orange'
            }`}
          >
            {item.label}
          </a>
        ))}
      </div>
    </nav>
  )
}
