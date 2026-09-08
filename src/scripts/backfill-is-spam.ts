/**
 * One-off backfill: set `isSpam: false` on every pre-existing form submission.
 *
 * Why this is needed at all: Mongo stores no column for a field that was never
 * written, and a Payload `where: { isSpam: { equals: false } }` filter compiles
 * to `{ isSpam: false }`, which does NOT match documents where the key is
 * absent. Without this, the admin "not spam" filter would hide every
 * submission taken before the spam guard shipped.
 *
 * Deliberately talks to the Mongo driver directly rather than going through
 * Payload's local API. `payload.update()` fires collection hooks, and this
 * collection has an afterChange hook — running it across the existing
 * submissions would re-send a notification email for every one of them.
 *
 * Usage:  npx tsx src/scripts/backfill-is-spam.ts [--dry-run]
 */
import 'dotenv/config'
import mongoose from 'mongoose'

const DRY_RUN = process.argv.includes('--dry-run')

async function main() {
  const url = process.env.DATABASE_URL

  if (!url) {
    console.error('DATABASE_URL is not set. Aborting.')
    process.exit(1)
  }

  await mongoose.connect(url, { dbName: 'workers-compensation' })

  const db = mongoose.connection.db
  if (!db) throw new Error('Failed to open database connection')

  const collection = db.collection('form-submissions')

  const total = await collection.countDocuments({})
  const missing = await collection.countDocuments({ isSpam: { $exists: false } })

  console.log(`form-submissions: ${total} total, ${missing} without an isSpam field.`)

  if (missing === 0) {
    console.log('Nothing to backfill.')
  } else if (DRY_RUN) {
    console.log(`[dry run] would set isSpam:false on ${missing} document(s).`)
  } else {
    const result = await collection.updateMany(
      { isSpam: { $exists: false } },
      { $set: { isSpam: false } },
    )
    console.log(`Backfilled ${result.modifiedCount} document(s) to isSpam:false.`)
  }

  await mongoose.disconnect()
}

main().catch(async (err) => {
  console.error('Backfill failed:', err)
  await mongoose.disconnect().catch(() => {})
  process.exit(1)
})
