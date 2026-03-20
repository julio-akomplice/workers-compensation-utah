import React from 'react'

import logoPlaceholder from '@/assets/placeholder/logo-placeholder.svg'
import Image from 'next/image'

const awards = [
  'LexisNexis Martindale-Hubbell Peer Review Rated',
  'Super Lawyers',
  'Utah Business Elite Personal Injury Attorney',
  'National Trial Lawyers',
]

export const Awards: React.FC = () => {
  return (
    <section className="w-full border-t-4 border-navy-1000 bg-white py-10">
      <div className="container mx-auto flex flex-col items-center gap-8 md:flex-row md:justify-center md:gap-16">
        <h2 className="text-h5 font-medium text-navy-1000 whitespace-nowrap">Our Awards</h2>
        <div className="flex flex-wrap items-center justify-center gap-10 md:gap-14">
          {awards.map((name) => (
            <Image key={name} src={logoPlaceholder} alt={name} className="h-10 w-auto grayscale" />
          ))}
        </div>
      </div>
    </section>
  )
}
