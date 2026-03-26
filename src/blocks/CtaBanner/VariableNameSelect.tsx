'use client'
import React, { useEffect, useState } from 'react'
import { SelectInput, useField, useFormFields } from '@payloadcms/ui'

type Option = { label: string; value: string }

const VariableNameSelect: React.FC<{
  path: string
  field: { name: string; label?: string; required?: boolean }
}> = ({ path, field }) => {
  const { value, setValue } = useField<string>({ path })
  const [options, setOptions] = useState<Option[]>([])

  // Watch the ctaBanner relationship field to get the selected banner ID
  const ctaBannerField = useFormFields(([fields]) => fields['ctaBanner'])
  const ctaBannerId =
    typeof ctaBannerField?.value === 'string'
      ? ctaBannerField.value
      : typeof ctaBannerField?.value === 'object' && ctaBannerField?.value !== null
        ? (ctaBannerField.value as { id?: string })?.id
        : null

  useEffect(() => {
    if (!ctaBannerId) {
      setOptions([])
      return
    }

    const fetchVariables = async () => {
      try {
        const res = await fetch(`/api/cta-banners/${ctaBannerId}?depth=0`)
        if (!res.ok) return
        const data = await res.json()
        const vars = data?.variables || []
        const newOptions: Option[] = vars
          .filter((v: { name?: string }) => v?.name)
          .map((v: { name: string; defaultValue?: string }) => ({
            label: v.defaultValue ? `${v.name} (default: "${v.defaultValue}")` : v.name,
            value: v.name,
          }))
        setOptions(newOptions)
      } catch {
        setOptions([])
      }
    }

    fetchVariables()
  }, [ctaBannerId])

  return (
    <SelectInput
      path={path}
      name={field.name}
      label={field.label || 'Variable Name'}
      options={options}
      value={value}
      onChange={(option) => {
        const selected = option as Option | null
        setValue(selected?.value || '')
      }}
      required={field.required}
    />
  )
}

export default VariableNameSelect
