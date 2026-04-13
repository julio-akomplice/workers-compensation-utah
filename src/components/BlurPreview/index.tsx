'use client'

import { useFormFields } from '@payloadcms/ui'

export function BlurPreview() {
  const blurDataURL = useFormFields(([fields]) => fields.blurDataURL?.value as string | undefined)

  return (
    <div style={{ marginBottom: 16 }}>
      <label className="field-label">Blur Placeholder</label>
      <span className="btn file-field__previewSizes btn--icon-style-without-border btn--size-small btn--withoutPopup btn--no-margin btn--style-pill" style={{ height: 24, display: 'inline-flex', alignItems: 'center' }}>
        {blurDataURL ? '✓ Has placeholder' : '! No placeholder'}
      </span>
    </div>
  )
}
