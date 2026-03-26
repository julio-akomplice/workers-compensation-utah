import configPromise from '@payload-config'
import { getPayload } from 'payload'

import type { Form as FormType, ShortSideForm as ShortSideFormType } from '@/payload-types'

type ShortSideFormData = {
  form: FormType | null
  header: ShortSideFormType['header'] | undefined
}

export async function getShortSideForm(): Promise<ShortSideFormData> {
  const payload = await getPayload({ config: configPromise })

  const shortSideFormGlobal = await payload.findGlobal({
    slug: 'short-side-form',
  })

  const form =
    shortSideFormGlobal?.form && typeof shortSideFormGlobal.form === 'object'
      ? shortSideFormGlobal.form
      : null
  const header = shortSideFormGlobal?.header || undefined

  return { form, header }
}
