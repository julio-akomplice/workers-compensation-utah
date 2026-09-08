const productionFormRecipients: string[] = ['attorney@kingburkelaw.com']
const developmentFormRecipients: string[] = ['julio@akomplice.ai']

const productionFormBcc: string[] = ['alea@fusion360agency.com', 'julio@akomplice.ai']
const developmentFormBcc: string[] = []

const isProduction = process.env.NODE_ENV === 'production'

export const formRecipients = isProduction ? productionFormRecipients : developmentFormRecipients
export const formBcc = isProduction ? productionFormBcc : developmentFormBcc

/**
 * Where notifications for internal QA submissions go.
 *
 * A submission recognised as one of our own tests (see INTERNAL_TEST_* in
 * src/spam/rules.ts) still produces a notification so we can verify the email
 * pipeline end to end — but it goes only here, never to the attorney and never
 * to the agency BCC.
 */
export const internalTestRecipients: string[] = ['julio@akomplice.ai']
