'use client'
import React, { useEffect, useState } from 'react'
import { ArrayField, useFormFields } from '@payloadcms/ui'
import type { ArrayFieldClientProps } from 'payload'

const VariablesArray: React.FC<ArrayFieldClientProps> = (props) => {
  const [hasVariables, setHasVariables] = useState(false)

  const ctaBannerField = useFormFields(([fields]) => fields['ctaBanner'])
  const ctaBannerId =
    typeof ctaBannerField?.value === 'string'
      ? ctaBannerField.value
      : typeof ctaBannerField?.value === 'object' && ctaBannerField?.value !== null
        ? (ctaBannerField.value as { id?: string })?.id
        : null

  useEffect(() => {
    if (!ctaBannerId) {
      setHasVariables(false)
      return
    }

    const check = async () => {
      try {
        const res = await fetch(`/api/cta-banners/${ctaBannerId}?depth=0`)
        if (!res.ok) {
          setHasVariables(false)
          return
        }
        const data = await res.json()
        setHasVariables(data?.variables && data.variables.length > 0)
      } catch {
        setHasVariables(false)
      }
    }

    check()
  }, [ctaBannerId])

  if (!hasVariables) return null

  return <ArrayField {...props} />
}

export default VariablesArray
