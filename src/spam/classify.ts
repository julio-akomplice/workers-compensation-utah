import {
  GENUINE_PHRASES,
  INTERNAL_TEST_DOMAINS,
  INTERNAL_TEST_EMAILS,
  INTERNAL_TEST_NAMES,
  INTERNAL_TEST_PHONES,
  MIN_SUBMIT_MS,
  SPAM_THRESHOLD,
  STRONG_DOMAINS,
  STRONG_PERSONAS,
  STRONG_PHRASES,
  STRONG_SCORE,
  WEAK_PHRASES,
  WEAK_SCORE,
} from './rules'

export type ClassifierInput = {
  /** Submitted field values, keyed by field name. */
  fields: Record<string, string>
  /** Value of the hidden honeypot input. Any non-empty value means a bot. */
  honeypot?: string
  /** Milliseconds between the form rendering and the user submitting it. */
  elapsedMs?: number
}

export type Classification = {
  isSpam: boolean
  /**
   * One of our own QA submissions rather than a real spam campaign. Still
   * flagged, but the notification is routed to us instead of being dropped.
   */
  isInternalTest: boolean
  score: number
  /** Machine-readable rule ids that fired, e.g. `strong-phrase:easybee`. */
  reasons: string[]
  /** Human-readable summary stored on the submission for the client to read. */
  spamReason: string
}

const MAX_GENUINE_CREDIT = 15

const normalize = (value: string): string =>
  value
    .toLowerCase()
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/\s+/g, ' ')
    .trim()

const digitsOnly = (value: string): string => value.replace(/\D/g, '')

const findField = (fields: Record<string, string>, hints: string[]): string => {
  const entry = Object.entries(fields).find(([name]) => {
    const lower = name.toLowerCase()
    return hints.some((hint) => lower.includes(hint))
  })
  return entry?.[1] ?? ''
}

/**
 * Classify a form submission. Pure — no database, no network, no clock. Every
 * decision is derived from the arguments, so this can be unit tested directly
 * and reused by both the collection hook and the notification email routes.
 */
export function classifySubmission(input: ClassifierInput): Classification {
  const { fields, honeypot, elapsedMs } = input

  const reasons: string[] = []
  let strongScore = 0
  let weakScore = 0

  // The whole submission as one lowercase haystack. Spam pitches hide their
  // giveaway sentence in whichever field happens to be longest, so we search
  // everything rather than only the message body.
  const haystack = normalize(Object.values(fields).join(' \n '))

  const email = normalize(findField(fields, ['email']))
  const name = normalize(findField(fields, ['name']))
  const phone = digitsOnly(findField(fields, ['phone', 'tel']))

  // --- Internal QA submissions -------------------------------------------
  // Flagged so future reporting is clean, but with a reason of their own so
  // they are never counted as a real spam campaign — and so the notification
  // can still be sent to us alone rather than suppressed outright.
  const canonicalEmail = canonicalizeEmail(email)
  const emailDomain = canonicalEmail.split('@')[1] ?? ''

  const isInternal =
    INTERNAL_TEST_EMAILS.some((test) => canonicalEmail === canonicalizeEmail(test)) ||
    (emailDomain.length > 0 && INTERNAL_TEST_DOMAINS.includes(emailDomain)) ||
    (phone.length > 0 && INTERNAL_TEST_PHONES.includes(phone)) ||
    INTERNAL_TEST_NAMES.some((test) => name === test)

  if (isInternal) {
    return {
      isSpam: true,
      isInternalTest: true,
      score: STRONG_SCORE,
      reasons: ['internal-test'],
      spamReason: 'Internal test submission (not real spam).',
    }
  }

  // --- Strong signals: each one flags on its own -------------------------

  if (honeypot && honeypot.trim().length > 0) {
    strongScore += STRONG_SCORE
    reasons.push('honeypot-filled')
  }

  if (typeof elapsedMs === 'number' && elapsedMs >= 0 && elapsedMs < MIN_SUBMIT_MS) {
    strongScore += STRONG_SCORE
    reasons.push(`submitted-too-fast:${elapsedMs}ms`)
  }

  for (const phrase of STRONG_PHRASES) {
    if (haystack.includes(phrase)) {
      strongScore += STRONG_SCORE
      reasons.push(`strong-phrase:${phrase}`)
    }
  }

  for (const domain of STRONG_DOMAINS) {
    if (haystack.includes(domain)) {
      strongScore += STRONG_SCORE
      reasons.push(`known-domain:${domain}`)
    }
  }

  for (const persona of STRONG_PERSONAS) {
    if (haystack.includes(persona)) {
      strongScore += STRONG_SCORE
      reasons.push(`known-persona:${persona}`)
    }
  }

  // --- Weak signals: two are needed to reach the threshold ---------------

  for (const phrase of WEAK_PHRASES) {
    if (haystack.includes(phrase)) {
      weakScore += WEAK_SCORE
      reasons.push(`weak-phrase:${phrase}`)
    }
  }


  // --- Credit for sounding like a real person ----------------------------
  // A first-person injury narrative offsets weak sales-language matches, so a
  // genuine message that happens to say "your firm" is not flagged. Deliberately
  // cannot offset a strong signal: nobody describing an injury also writes
  // "Respond with stop to optout."
  const genuineHits = GENUINE_PHRASES.filter((phrase) => haystack.includes(phrase))
  const genuineCredit = Math.min(genuineHits.length * WEAK_SCORE, MAX_GENUINE_CREDIT)

  if (genuineHits.length > 0) {
    reasons.push(`genuine-narrative:${genuineHits.length}`)
  }

  const adjustedWeak = Math.max(0, weakScore - genuineCredit)
  const score = strongScore + adjustedWeak
  const isSpam = score >= SPAM_THRESHOLD

  return {
    isSpam,
    isInternalTest: false,
    score,
    reasons,
    spamReason: isSpam ? buildSpamReason(reasons) : '',
  }
}

/**
 * Normalize an address for comparison: lowercase, and drop any `+suffix` so
 * `julio+contactform@akomplice.ai` is recognised as `julio@akomplice.ai`.
 */
function canonicalizeEmail(value: string): string {
  const trimmed = value.trim().toLowerCase()
  const [local, domain] = trimmed.split('@')
  if (!local || !domain) return trimmed
  return `${local.split('+')[0]}@${domain}`
}

/** Turn the fired rule ids into a sentence the client can act on. */
function buildSpamReason(reasons: string[]): string {
  const parts: string[] = []

  for (const reason of reasons) {
    if (reason === 'honeypot-filled') {
      parts.push('filled a hidden field only a bot would see')
    } else if (reason.startsWith('submitted-too-fast:')) {
      parts.push(`submitted in under ${MIN_SUBMIT_MS / 1000}s`)
    } else if (reason.startsWith('strong-phrase:')) {
      parts.push(`known spam phrase "${reason.slice('strong-phrase:'.length)}"`)
    } else if (reason.startsWith('known-domain:')) {
      parts.push(`known spam domain ${reason.slice('known-domain:'.length)}`)
    } else if (reason.startsWith('known-persona:')) {
      parts.push(`known fake sender ${reason.slice('known-persona:'.length)}`)
    } else if (reason.startsWith('weak-phrase:')) {
      parts.push(`sales language "${reason.slice('weak-phrase:'.length)}"`)
    }
  }

  // Keep the stored reason readable — the full rule list lives in the logs.
  const shown = parts.slice(0, 4)
  const extra = parts.length - shown.length

  return `Flagged: ${shown.join('; ')}${extra > 0 ? `; and ${extra} more` : ''}.`
}
