// const productionFormRecipients: string[] = ['attorney@kingburkelaw.com']
const productionFormRecipients: string[] = ['alea@fusion360studios.com', 'julio@akomplice.ai']
const developmentFormRecipients: string[] = ['julio@akomplice.ai']

// const productionFormBcc: string[] = ['alea@fusion360studios.com', 'julio@akomplice.ai']
const productionFormBcc: string[] = []
const developmentFormBcc: string[] = []

const isProduction = process.env.NODE_ENV === 'production'

export const formRecipients = isProduction ? productionFormRecipients : developmentFormRecipients
export const formBcc = isProduction ? productionFormBcc : developmentFormBcc
