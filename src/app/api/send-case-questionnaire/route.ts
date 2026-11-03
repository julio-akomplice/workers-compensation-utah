import { NextResponse } from 'next/server'

/**
 * Retired 2026-11-03. The attorney email is now sent by the server when the
 * submission is saved (notifyOnCreate in src/notifications/submissionNotification.ts),
 * so it can no longer be skipped or forged by the caller.
 *
 * Kept as a no-op so a browser still running the previous page code (an open
 * tab during the deploy) gets a success instead of an error, and is never
 * emailed twice. Safe to delete after a few weeks.
 */
export async function POST() {
  return NextResponse.json({ success: true })
}
