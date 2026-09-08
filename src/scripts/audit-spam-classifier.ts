/**
 * Dry-run the classifier over every existing form submission and print how it
 * would have scored each one. Read-only — writes nothing.
 *
 * Use this to sanity-check rule changes against real traffic before deploying:
 *   npx tsx src/scripts/audit-spam-classifier.ts
 */
import 'dotenv/config'
import mongoose from 'mongoose'

import { classifySubmission } from '../spam/classify'
import { entriesToFieldMap } from '../spam/fields'

type Entry = { field: string; value: string }

async function main() {
  const url = process.env.DATABASE_URL
  if (!url) {
    console.error('DATABASE_URL is not set.')
    process.exit(1)
  }

  await mongoose.connect(url, { dbName: 'workers-compensation' })
  const db = mongoose.connection.db
  if (!db) throw new Error('no db')

  const docs = await db
    .collection('form-submissions')
    .find({})
    .sort({ createdAt: 1 })
    .toArray()

  let flagged = 0
  let internal = 0

  for (const doc of docs) {
    const entries: Entry[] = Array.isArray(doc.submissionData) ? doc.submissionData : []
    const fields = entriesToFieldMap(entries)
    const result = classifySubmission({ fields })

    const preview = (fields.message ?? Object.values(fields).join(' | ') ?? '')
      .replace(/\s+/g, ' ')
      .slice(0, 90)

    const isInternal = result.reasons.includes('internal-test')
    if (isInternal) internal++
    else if (result.isSpam) flagged++

    const tag = isInternal ? 'INTERNAL' : result.isSpam ? 'SPAM    ' : 'clean   '
    const date = doc.createdAt ? new Date(doc.createdAt).toISOString().slice(0, 10) : '??????????'

    console.log(`${tag} ${date} score=${String(result.score).padStart(3)}  ${preview}`)
    if (result.isSpam && !isInternal) {
      console.log(`         rules: ${result.reasons.join(', ')}`)
    }
  }

  console.log('\n─────────────────────────────────────────────')
  console.log(`total:    ${docs.length}`)
  console.log(`spam:     ${flagged}`)
  console.log(`internal: ${internal}`)
  console.log(`clean:    ${docs.length - flagged - internal}`)
  console.log('\nReview every line marked SPAM. Any real enquiry in that list is')
  console.log('a false positive and the matching rule should be removed or narrowed.')

  await mongoose.disconnect()
}

main().catch(async (err) => {
  console.error(err)
  await mongoose.disconnect().catch(() => {})
  process.exit(1)
})
