import React from 'react'

type SchemaItem = {
  data:
    | {
        [k: string]: unknown
      }
    | unknown[]
    | string
    | number
    | boolean
    | null
  id?: string | null
}

type Props = {
  schema?: SchemaItem[] | null
}

export const SchemaMarkup: React.FC<Props> = ({ schema }) => {
  if (!schema || schema.length === 0) return null

  return (
    <>
      {schema.map((item, index) => {
        if (!item.data) return null
        return (
          <script
            key={index}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(item.data) }}
          />
        )
      })}
    </>
  )
}
