'use client'

import React, { useCallback, useEffect, useRef } from 'react'

import { HONEYPOT_FIELD, RENDERED_AT_FIELD, type SubmissionEntry } from '@/spam/fields'

/**
 * Client-side half of the spam guard.
 *
 * Deliberately does NOT go through react-hook-form. The forms resolve with
 * `zodResolver(buildFormSchema(...))`, and that schema is built only from the
 * fields configured in the CMS — a registered honeypot would be stripped out
 * as an unknown key before `onSubmit` ever saw it, leaving the honeypot value
 * silently empty forever. Reading straight from a DOM ref sidesteps the
 * resolver entirely.
 *
 * Both values are validated again on the server; nothing here is trusted.
 */
export function useSpamGuard() {
  const honeypotRef = useRef<HTMLInputElement>(null)
  const renderedAtRef = useRef<number>(0)

  // Stamped on mount rather than at module/render time so the value reflects
  // when the visitor actually saw the form, even on a statically cached page.
  useEffect(() => {
    renderedAtRef.current = Date.now()
  }, [])

  const getSpamGuardEntries = useCallback((): SubmissionEntry[] => {
    const entries: SubmissionEntry[] = [
      { field: HONEYPOT_FIELD, value: honeypotRef.current?.value ?? '' },
    ]

    // Omit the timestamp entirely if the effect has not run; an absent value
    // means "unknown", which the server treats as no timing signal at all.
    if (renderedAtRef.current > 0) {
      entries.push({ field: RENDERED_AT_FIELD, value: String(renderedAtRef.current) })
    }

    return entries
  }, [])

  return { honeypotRef, getSpamGuardEntries }
}

/**
 * The hidden input itself. Positioned off-screen rather than `type="hidden"`,
 * because most form-filling bots skip hidden inputs but will happily fill a
 * plausible-looking text input named `website`.
 */
export const SpamGuardField: React.FC<{
  inputRef: React.RefObject<HTMLInputElement | null>
}> = ({ inputRef }) => (
  <div
    aria-hidden="true"
    style={{
      position: 'absolute',
      left: '-9999px',
      top: 'auto',
      width: '1px',
      height: '1px',
      overflow: 'hidden',
      pointerEvents: 'none',
    }}
  >
    <label htmlFor={HONEYPOT_FIELD}>Website (leave this field empty)</label>
    <input
      ref={inputRef}
      id={HONEYPOT_FIELD}
      name={HONEYPOT_FIELD}
      type="text"
      tabIndex={-1}
      autoComplete="off"
      defaultValue=""
    />
  </div>
)
