'use client'

import React, { useEffect, useRef, useState } from 'react'

import type { FAQContentBlock as FAQContentBlockProps } from 'src/payload-types'

import { CMSLink } from '@/components/Link'
import RichText from '@/components/RichText'

type Props = {
  className?: string
} & FAQContentBlockProps

const PlusIcon: React.FC<{ isOpen: boolean }> = ({ isOpen }) => (
  <svg
    width="27"
    height="27"
    viewBox="0 0 27 27"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`}
  >
    <line x1="13.5" y1="0" x2="13.5" y2="27" stroke="#FFB94A" strokeWidth="2" />
    <line x1="0" y1="13.5" x2="27" y2="13.5" stroke="#FFB94A" strokeWidth="2" />
  </svg>
)

const FAQItem: React.FC<{
  question: string
  answer: any
  isOpen: boolean
  onToggle: () => void
}> = ({ question, answer, isOpen, onToggle }) => {
  const contentRef = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState(0)

  useEffect(() => {
    const el = contentRef.current
    if (!el) return
    if (isOpen) {
      setHeight(el.scrollHeight)
      const onResize = () => setHeight(el.scrollHeight)
      window.addEventListener('resize', onResize)
      return () => window.removeEventListener('resize', onResize)
    } else {
      setHeight(0)
    }
  }, [isOpen])

  return (
    <div className="flex flex-col">
      <button
        onClick={onToggle}
        className="flex w-full cursor-pointer items-center justify-between py-5 text-left"
      >
        <p className="pr-4 text-[16px] font-medium leading-normal tracking-[-0.32px] text-off-white md:text-[17px] md:tracking-[-0.34px]">
          {question}
        </p>
        <div className="flex size-[38px] shrink-0 items-center justify-center [&_svg]:size-5">
          <PlusIcon isOpen={isOpen} />
        </div>
      </button>

      <div
        ref={contentRef}
        className="overflow-hidden transition-[height] duration-300 ease-in-out"
        style={{ height }}
      >
        <div className="pb-5 text-[15px] leading-[24px] tracking-[-0.3px] text-navy-200 md:text-[16px] md:leading-[25px] [&_p+p]:mt-4 [&_a]:text-gold [&_a]:underline [&_a:hover]:text-gold/80">
          <RichText data={answer} enableGutter={false} enableProse={false} />
        </div>
      </div>

      <div className="h-px w-full bg-navy-700" />
    </div>
  )
}

export const FAQContentBlockComponent: React.FC<Props> = ({ sectionHeader, faqs, link }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section
      className="w-full py-[60px] md:py-20 lg:py-[100px]"
      style={{
        background: 'linear-gradient(180deg, #001F3E 0%, #002E5D 100%)',
      }}
    >
      <div className="container mx-auto px-5 md:px-8">
        {sectionHeader && 'root' in sectionHeader && (
          <div className="section-header section-header--dark mb-10 text-center md:mb-[50px] lg:mb-[60px]">
            <RichText data={sectionHeader} enableGutter={false} enableProse={false} />
          </div>
        )}

        <div className="mx-auto flex max-w-[793px] flex-col gap-5">
          {faqs?.map((faq, index) => (
            <FAQItem
              key={faq.id}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === index}
              onToggle={() => setOpenIndex(openIndex === index ? null : index)}
            />
          ))}
        </div>

        {link && (
          <div className="mt-10 flex justify-center md:mt-[50px] lg:mt-[60px]">
            <CMSLink {...link} />
          </div>
        )}
      </div>
    </section>
  )
}
