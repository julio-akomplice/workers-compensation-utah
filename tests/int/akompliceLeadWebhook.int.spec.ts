import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import {
  buildLeadPayload,
  forwardToAkomplice,
  redactWebhookUrl,
  sendLead,
  WEBHOOK_URL_ENV,
} from '@/integrations/akompliceLeadWebhook'

const URL_WITH_TOKEN = 'https://app-api.akomplice.ai/api/v2/webhooks/forms/SECRET-TOKEN-123'

const entries = (fields: Record<string, string>) =>
  Object.entries(fields).map(([field, value]) => ({ field, value }))

const logger = () => ({ info: vi.fn(), warn: vi.fn(), error: vi.fn() })

describe('buildLeadPayload: one shape per production form', () => {
  it('Short Side Form / Landing Page: name, phone, email, message, page URL with UTMs', () => {
    const p = buildLeadPayload({
      id: 'sub1',
      createdAt: '2026-11-03T18:00:00.000Z',
      form: '69d6a67a43f3a285c4a374ee',
      submissionData: entries({
        name: 'Jane Roe',
        phone: '801-555-0100',
        email: 'jane@example.org',
        message: 'I hurt my back lifting boxes at work.',
        sourceUrl: 'https://workerscompensationutah.com/?utm_source=google&utm_medium=cpc&gclid=Cj0K',
      }),
    })
    expect(p).toMatchObject({
      submission_id: 'sub1',
      submitted_at: '2026-11-03T18:00:00.000Z',
      form: 'Short Side Form',
      name: 'Jane Roe',
      phone: '801-555-0100',
      email: 'jane@example.org',
      message: 'I hurt my back lifting boxes at work.',
      utm_source: 'google',
      utm_medium: 'cpc',
      gclid: 'Cj0K',
    })
    expect(p.page_url).toContain('workerscompensationutah.com')
  })

  it('Contact: joins "First Name" and lastName', () => {
    const p = buildLeadPayload({
      id: 'sub2',
      form: '69d686dc43f3a285c4a326e2',
      submissionData: entries({ 'First Name': 'John', lastName: 'Doe', email: 'j@d.org', phone: '1', message: 'm' }),
    })
    expect(p.name).toBe('John Doe')
    expect(p.form).toBe('Contact')
  })

  it('Case Questionnaire: firstName/lastName, phoneNumber, howInjuryOccurred; no page URL', () => {
    const p = buildLeadPayload({
      id: 'sub3',
      form: '69d6a75943f3a285c4a37963',
      submissionData: entries({
        firstName: 'Ana',
        lastName: 'Ruiz',
        phoneNumber: '801-555-0101',
        email: 'ana@x.org',
        howInjuryOccurred: 'Fell from a ladder',
        claimNumber: 'WC-1',
      }),
    })
    expect(p).toMatchObject({ name: 'Ana Ruiz', phone: '801-555-0101', message: 'Fell from a ladder', form: 'Case Questionnaire' })
    expect(p).not.toHaveProperty('page_url')
    expect((p.fields as Record<string, string>).claimNumber).toBe('WC-1')
  })

  it('leaves out empty values and keeps an unknown form id as-is', () => {
    const p = buildLeadPayload({ id: 'sub4', form: 'unknown-form', submissionData: entries({ email: 'a@b.org', phone: '' }) })
    expect(p.form).toBe('unknown-form')
    expect(p).not.toHaveProperty('phone')
    expect(p).not.toHaveProperty('name')
  })
})

describe('redactWebhookUrl', () => {
  it('hides the token', () => {
    expect(redactWebhookUrl(URL_WITH_TOKEN)).toBe('https://app-api.akomplice.ai/api/v2/webhooks/forms/<token>')
  })
})

describe('sendLead', () => {
  afterEach(() => vi.unstubAllGlobals())

  it('posts JSON once on success', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response('{}', { status: 200 }))
    vi.stubGlobal('fetch', fetchMock)
    const log = logger()
    expect(await sendLead(URL_WITH_TOKEN, { submission_id: 'x', email: 'a@b.org' }, log, 0)).toBe(true)
    expect(fetchMock).toHaveBeenCalledTimes(1)
    const [url, init] = fetchMock.mock.calls[0]
    expect(url).toBe(URL_WITH_TOKEN)
    expect(init.method).toBe('POST')
    expect(JSON.parse(init.body)).toEqual({ submission_id: 'x', email: 'a@b.org' })
  })

  it('retries once on a 5xx or a network error, then gives up without throwing', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response('', { status: 503 }))
      .mockRejectedValueOnce(new Error('ECONNRESET'))
    vi.stubGlobal('fetch', fetchMock)
    const log = logger()
    expect(await sendLead(URL_WITH_TOKEN, { submission_id: 'x' }, log, 0)).toBe(false)
    expect(fetchMock).toHaveBeenCalledTimes(2)
    expect(log.error).toHaveBeenCalled()
  })

  it('does not retry a 404 (wrong or revoked token) and never logs the token', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response('', { status: 404 }))
    vi.stubGlobal('fetch', fetchMock)
    const log = logger()
    expect(await sendLead(URL_WITH_TOKEN, { submission_id: 'x' }, log, 0)).toBe(false)
    expect(fetchMock).toHaveBeenCalledTimes(1)
    const logged = JSON.stringify([log.info.mock.calls, log.warn.mock.calls, log.error.mock.calls])
    expect(logged).not.toContain('SECRET-TOKEN-123')
  })
})

describe('forwardToAkomplice hook', () => {
  const doc = { id: 'sub9', form: '69d6a67a43f3a285c4a374ee', submissionData: entries({ name: 'A', email: 'a@b.org' }), isSpam: false }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const run = (args: Record<string, unknown>) => (forwardToAkomplice as any)({ doc, req: { payload: { logger: logger() } }, ...args })
  let fetchMock: ReturnType<typeof vi.fn>

  beforeEach(() => {
    fetchMock = vi.fn().mockResolvedValue(new Response('{}', { status: 200 }))
    vi.stubGlobal('fetch', fetchMock)
    process.env[WEBHOOK_URL_ENV] = URL_WITH_TOKEN
  })
  afterEach(() => {
    vi.unstubAllGlobals()
    delete process.env[WEBHOOK_URL_ENV]
  })

  it('sends on create and returns the doc straight away', () => {
    expect(run({ operation: 'create' })).toBe(doc)
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('does nothing on update (email route and admin edits save the record again)', () => {
    run({ operation: 'update' })
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('does nothing for spam or internal tests', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(forwardToAkomplice as any)({ doc: { ...doc, isSpam: true, isInternalTest: true }, operation: 'create', req: { payload: { logger: logger() } } })
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('does nothing when the URL is not configured (local, staging)', () => {
    delete process.env[WEBHOOK_URL_ENV]
    run({ operation: 'create' })
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('a webhook that hangs or fails cannot fail the submission', () => {
    fetchMock.mockRejectedValue(new Error('down'))
    expect(() => run({ operation: 'create' })).not.toThrow()
  })
})
