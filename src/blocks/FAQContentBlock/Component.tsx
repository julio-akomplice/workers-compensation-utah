'use client'

import React, { useState } from 'react'

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
  return (
    <div className="flex flex-col gap-5">
      <button
        onClick={onToggle}
        className="flex w-full cursor-pointer items-center justify-between text-left"
      >
        <p className="pr-4 text-[16px] font-medium leading-normal tracking-[-0.32px] text-off-white md:text-[17px] md:tracking-[-0.34px]">
          {question}
        </p>
        <div className="flex size-[38px] shrink-0 items-center justify-center">
          <PlusIcon isOpen={isOpen} />
        </div>
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="pb-2 text-[15px] leading-[24px] tracking-[-0.3px] text-navy-200 md:text-[16px] md:leading-[25px] [&_p+p]:mt-4 [&_a]:text-gold [&_a]:underline [&_a:hover]:text-gold/80">
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
