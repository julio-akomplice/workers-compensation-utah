import type { GlobalAfterChangeHook } from 'payload'

import { revalidateTag } from 'next/cache'

export const revalidateCaseQuestionnaireCTA: GlobalAfterChangeHook = ({
  doc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    payload.logger.info(`Revalidating case-questionnaire-cta`)

    revalidateTag('global_case-questionnaire-cta')
  }

  return doc
}
