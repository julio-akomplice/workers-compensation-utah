/**
 * Field names the spam guard adds to every form.
 *
 * These ride along inside the existing `submissionData` array as ordinary
 * `{ field, value }` entries, so the shape of `submissionData` is unchanged —
 * there are simply two more rows, and they are stripped before the submission
 * is stored and before any notification email is rendered.
 */

/**
 * The honeypot. Named to look like a field a bot wants to fill. Rendered
 * off-screen with aria-hidden and tabindex="-1", never `type="hidden"`, so
 * that a real user can neither see it nor tab into it.
 */
export const HONEYPOT_FIELD = 'website'

/** Millisecond timestamp captured when the form first rendered. */
export const RENDERED_AT_FIELD = 'renderedAt'

/** Every field the guard injects. Never shown to the client. */
export const SPAM_META_FIELDS: string[] = [HONEYPOT_FIELD, RENDERED_AT_FIELD]

export type SubmissionEntry = { field: string; value: string }

/** Remove the guard's own fields from a submissionData array. */
export const stripSpamMetaFields = <T extends { field: string }>(entries: T[]): T[] =>
  entries.filter((entry) => !SPAM_META_FIELDS.includes(entry.field))

/** Pull the guard's values out of a submissionData array. */
export const extractSpamMeta = (
  entries: SubmissionEntry[],
): { honeypot?: string; elapsedMs?: number } => {
  const honeypot = entries.find((e) => e.field === HONEYPOT_FIELD)?.value
  const renderedAtRaw = entries.find((e) => e.field === RENDERED_AT_FIELD)?.value

  let elapsedMs: number | undefined
  const renderedAt = Number(renderedAtRaw)

  if (Number.isFinite(renderedAt) && renderedAt > 0) {
    const delta = Date.now() - renderedAt
    // Ignore nonsense values (clock skew, a forged future timestamp) rather
    // than treating them as an instant submission.
    if (delta >= 0 && delta < 1000 * 60 * 60 * 24) {
      elapsedMs = delta
    }
  }

  return { honeypot, elapsedMs }
}

/** Turn a submissionData array into the flat map the classifier expects. */
export const entriesToFieldMap = (entries: SubmissionEntry[]): Record<string, string> => {
  const map: Record<string, string> = {}
  for (const { field, value } of entries) {
    if (SPAM_META_FIELDS.includes(field) || field === 'sourceUrl') continue
    map[field] = typeof value === 'string' ? value : String(value ?? '')
  }
  return map
}
