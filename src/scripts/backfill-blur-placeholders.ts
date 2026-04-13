/**
 * Backfill blur placeholders for existing media documents via the Payload REST API.
 *
 * Run with:
 *   PRODUCTION_URL=https://... npx tsx src/scripts/backfill-blur-placeholders.ts
 * Or set NEXT_PUBLIC_SERVER_URL in .env to the production URL.
 */

import 'dotenv/config'
import sharp from 'sharp'

const SERVER_URL = (
  process.env.PRODUCTION_URL || process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
).replace(/\/$/, '')

const API_KEY = process.env.PAYLOAD_API_KEY

if (!API_KEY) {
  console.error('Missing PAYLOAD_API_KEY in environment')
  process.exit(1)
}

const headers = {
  Authorization: `users API-Key ${API_KEY}`,
  'Content-Type': 'application/json',
}

async function generateBlurDataURL(imageUrl: string): Promise<string> {
  const response = await fetch(imageUrl)
  if (!response.ok) throw new Error(`HTTP ${response.status} fetching ${imageUrl}`)
  const arrayBuffer = await response.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)
  const blurBuffer = await sharp(buffer)
    .resize(32, 32, { fit: 'inside' })
    .blur(1)
    .webp({ quality: 30 })
    .toBuffer()
  return `data:image/webp;base64,${blurBuffer.toString('base64')}`
}

async function findMediaBatch(where: object, page: number, limit = 50) {
  const url = `${SERVER_URL}/api/media?limit=${limit}&page=${page}&depth=0&where=${encodeURIComponent(JSON.stringify(where))}&select[id]=true&select[filename]=true&select[url]=true&select[mimeType]=true`
  const res = await fetch(url, { headers })
  if (!res.ok) throw new Error(`Failed to query media: HTTP ${res.status}`)
  return res.json() as Promise<{ docs: any[]; hasNextPage: boolean; totalDocs: number }>
}

async function updateMedia(id: string, data: Record<string, unknown>) {
  const res = await fetch(`${SERVER_URL}/api/media/${id}`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`PATCH failed (${res.status}): ${text}`)
  }
}

async function processImages(where: object, label: string, extraData?: (doc: any) => object) {
  let page = 1
  let processed = 0
  let skipped = 0
  let failed = 0

  while (true) {
    const { docs, totalDocs, hasNextPage } = await findMediaBatch(where, page)
    if (docs.length === 0) break

    console.log(`\n[${label}] Page ${page} — ${docs.length} docs (${totalDocs} total)\n`)

    for (const doc of docs) {
      if (!doc.url) {
        console.log(`  [SKIP] ${doc.filename} — no URL`)
        skipped++
        continue
      }

      const imageUrl = doc.url.startsWith('http') ? doc.url : `${SERVER_URL}${doc.url}`

      try {
        const blurDataURL = await generateBlurDataURL(imageUrl)
        const updateData: Record<string, unknown> = { blurDataURL, ...extraData?.(doc) }
        await updateMedia(doc.id, updateData)
        console.log(`  [OK]   ${doc.filename}`)
        processed++
      } catch (err) {
        console.error(`  [FAIL] ${doc.filename} — ${err instanceof Error ? err.message : err}`)
        failed++
      }
    }

    if (!hasNextPage) break
    page++
  }

  return { processed, skipped, failed }
}

async function main() {
  console.log(`Server: ${SERVER_URL}\n`)
  console.log('=== Starting blur placeholder backfill ===\n')

  // 1. Images with no blurDataURL and proper image/* mimeType (excluding SVGs)
  const r1 = await processImages(
    {
      and: [
        { blurDataURL: { exists: false } },
        { mimeType: { contains: 'image/' } },
        { mimeType: { not_equals: 'image/svg+xml' } },
      ],
    },
    'image/* missing blur',
  )

  // 2. application/octet-stream files with .webp extension — fix mimeType + add blur
  const r2 = await processImages(
    { mimeType: { equals: 'application/octet-stream' } },
    'octet-stream webp fix',
    (doc) => {
      const lowerName = (doc.filename || '').toLowerCase()
      if (lowerName.endsWith('.webp')) return { mimeType: 'image/webp' }
      if (lowerName.endsWith('.jpg') || lowerName.endsWith('.jpeg')) return { mimeType: 'image/jpeg' }
      if (lowerName.endsWith('.png')) return { mimeType: 'image/png' }
      return {}
    },
  )

  const total = {
    processed: r1.processed + r2.processed,
    skipped: r1.skipped + r2.skipped,
    failed: r1.failed + r2.failed,
  }

  console.log(`\n=== Done ===`)
  console.log(`Updated: ${total.processed}  |  Skipped: ${total.skipped}  |  Failed: ${total.failed}`)
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
