/**
 * Dry-run the spam classifier against a LIVE Payload instance over the REST
 * API, instead of connecting to the database directly. Read-only — it never
 * writes anything.
 *
 * Use this to measure the false-positive rate against real traffic before or
 * after deploying a rules change:
 *
 *   PAYLOAD_URL=https://workerscompensationutah.com \
 *   PAYLOAD_API_KEY=... \
 *   npx tsx src/scripts/audit-spam-remote.ts
 *
 * Every line marked SPAM is a submission the client would NOT have been
 * emailed about. Read them all. Any real enquiry in that list is a false
 * positive, and the rule named beside it should be narrowed or removed.
 */
import 'dotenv/config'

import { classifySubmission } from '../spam/classify'
import { entriesToFieldMap } from '../spam/fields'

type Entry = { field: string; value: string }
type Doc = { id: string; createdAt?: string; submissionData?: Entry[] }

const BASE = (process.env.PAYLOAD_URL || process.env.NEXT_PUBLIC_SERVER_URL || '').replace(
  /\/$/,
  '',
)
const KEY = process.env.PAYLOAD_API_KEY

async function fetchAll(): Promise<Doc[]> {
  const docs: Doc[] = []
  let page = 1

  for (;;) {
    const res = await fetch(
      `${BASE}/api/form-submissions?limit=100&depth=0&sort=createdAt&page=${page}`,
      { headers: { Authorization: `users API-Key ${KEY}` } },
    )

    if (!res.ok) throw new Error(`HTTP ${res.status} fetching page ${page}`)

    const json = (await res.json()) as { docs: Doc[]; hasNextPage?: boolean }
    docs.push(...json.docs)

    if (!json.hasNextPage) break
    page += 1
  }

  return docs
}

async function main() {
  if (!BASE || !KEY) {
    console.error('Set PAYLOAD_URL and PAYLOAD_API_KEY.')
    process.exit(1)
  }

  const docs = await fetchAll()

  let spam = 0
  let internal = 0
  const flagged: { date: string; preview: string; reasons: string[] }[] = []

  for (const doc of docs) {
    const entries = Array.isArray(doc.submissionData) ? doc.submissionData : []
    const result = classifySubmission({ fields: entriesToFieldMap(entries) })

    const isInternal = result.reasons.includes('internal-test')
    if (isInternal) internal++
    else if (result.isSpam) spam++

    if (result.isSpam) {
      const fields = entriesToFieldMap(entries)
      const preview = (fields.message || Object.values(fields).join(' | '))
        .replace(/\s+/g, ' ')
        .slice(0, 100)

      flagged.push({
        date: (doc.createdAt || '').slice(0, 10),
        preview: `${isInternal ? '[internal] ' : ''}${preview}`,
        reasons: result.reasons,
      })
    }
  }

  console.log(`\nSubmissions analysed: ${docs.length}`)
  console.log(`  would be flagged as SPAM : ${spam}`)
  console.log(`  recognised as internal QA: ${internal}`)
  console.log(`  delivered normally       : ${docs.length - spam - internal}`)

  console.log('\n─── every submission that would be WITHHELD from the client ───')
  for (const f of flagged) {
    console.log(`\n${f.date}  ${f.preview}`)
    console.log(`          rules: ${f.reasons.slice(0, 5).join(', ')}`)
  }
  console.log('\nAnything above that is a real injured worker is a false positive.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
