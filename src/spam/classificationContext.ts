/**
 * How the spam verdict reaches the afterChange hooks (attorney email, Akomplice).
 *
 * isSpam / isInternalTest are staff-only fields, so Payload removes them from
 * the `doc` an afterChange hook receives when an anonymous visitor creates a
 * submission. classifyOnCreate (beforeChange) therefore also puts the verdict
 * on `req.context`, which the same request's later hooks can read.
 */
export const CLASSIFICATION_CONTEXT_KEY = 'submissionClassification'

export type SubmissionClassification = { isSpam: boolean; isInternalTest: boolean }

/**
 * The doc with the classifier's verdict applied. Falls back to the doc's own
 * fields (present when staff create a record) when the context has none.
 */
export const withClassification = <T extends { isSpam?: boolean | null; isInternalTest?: boolean | null }>(
  doc: T,
  context: Record<string, unknown> | undefined,
): T => {
  const verdict = context?.[CLASSIFICATION_CONTEXT_KEY] as SubmissionClassification | undefined
  return verdict ? { ...doc, isSpam: verdict.isSpam, isInternalTest: verdict.isInternalTest } : doc
}
