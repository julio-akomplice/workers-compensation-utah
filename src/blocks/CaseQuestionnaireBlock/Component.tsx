import React from 'react'
import type { CaseQuestionnaireBlock as CaseQuestionnaireBlockProps } from 'src/payload-types'
import { CaseQuestionnaireForm } from './Client'

type Props = {
  className?: string
} & CaseQuestionnaireBlockProps

export const CaseQuestionnaireBlockComponent: React.FC<Props> = ({ form }) => {
  if (!form) return null

  const formID = typeof form === 'object' ? String(form.id) : String(form)

  return (
    <section className="w-full bg-white py-15 md:py-20 lg:py-25">
      <div className="container mx-auto px-5 md:px-8">
        <CaseQuestionnaireForm formID={formID} />
      </div>
    </section>
  )
}
