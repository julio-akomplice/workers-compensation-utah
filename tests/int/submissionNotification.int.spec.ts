import { describe, expect, it, vi } from 'vitest'

import { formRecipients, internalTestRecipients } from '@/constants/formRecipients'
import { buildLeadPayload, forwardToAkomplice, isMarkedTest, WEBHOOK_URL_ENV } from '@/integrations/akompliceLeadWebhook'
import {
  buildNotificationEmail,
  notifyOnCreate,
  sendSubmissionNotification,
  type NotifyDeps,
} from '@/notifications/submissionNotification'
import { classifySubmission, hasTestMarker } from '@/spam/classify'

const entries = (fields: Record<string, string>) =>
  Object.entries(fields).map(([field, value]) => ({ field, value }))

const contactForm = {
  title: 'Contact',
  fields: [
    { name: 'name', label: 'Full name' },
    { name: 'email', label: 'Email address' },
    { name: 'message', label: 'How can we help?' },
  ],
}

const logger = () => ({ info: vi.fn(), error: vi.fn() })

const fakePayload = (form: unknown = contactForm) => {
  const updates: Array<{ id: string; data: Record<string, unknown> }> = []
  return {
    updates,
    findByID: vi.fn().mockResolvedValue(form),
    update: vi.fn(async ({ id, data }: { id: string; data: Record<string, unknown> }) => {
      updates.push({ id, data })
      return {}
    }),
  }
}

const fakeDeps = (sendMail = vi.fn().mockResolvedValue({})) => {
  const autoReply = vi.fn().mockResolvedValue(true)
  const deps: NotifyDeps = {
    createTransport: () => ({ sendMail }) as never,
    sendAutoReply: autoReply,
    retryDelayMs: 0,
  }
  return { deps, sendMail, autoReply }
}

describe('buildNotificationEmail: built from the stored submission only', () => {
  it('uses the form labels and title, escapes values, and leaves out spam meta fields', () => {
    const email = buildNotificationEmail(
      {
        id: 'sub1',
        submissionData: entries({
          name: 'Jane <b>Roe</b>',
          email: 'jane@example.org',
          message: 'Hurt my back',
          sourceUrl: 'https://workerscompensationutah.com/contact',
          website: 'should-not-appear',
          renderedAt: '123',
        }),
      },
      contactForm,
      false,
    )
    expect(email.subject).toBe('New inquiry — Contact [#sub1]')
    expect(email.html).toContain('Full name')
    expect(email.html).toContain('Jane &lt;b&gt;Roe&lt;/b&gt;')
    expect(email.html).not.toContain('<b>Roe</b>')
    expect(email.html).not.toContain('should-not-appear')
    expect(email.html).toContain('Submitted from:')
    expect(email.submitterName).toBe('Jane <b>Roe</b>')
    expect(email.submitterEmail).toBe('jane@example.org')
  })

  it('drops a javascript: source URL instead of linking it', () => {
    const email = buildNotificationEmail(
      { id: 's', submissionData: entries({ name: 'A', sourceUrl: 'javascript:alert(1)' }) },
      contactForm,
      false,
    )
    expect(email.html).not.toContain('javascript:')
  })

  it('formats the case questionnaire with its own labels and display values', () => {
    const email = buildNotificationEmail(
      {
        id: 'q1',
        submissionData: entries({
          firstName: 'Ana',
          lastName: 'Ruiz',
          email: 'ana@example.org',
          howInjuryOccurred: 'Fell from a ladder',
          responsibleParties: 'employer, co-employee',
          requireInterpreter: 'yes',
        }),
      },
      { title: 'Case Questionnaire', fields: [] },
      false,
    )
    expect(email.subject).toBe('Case Questionnaire [#q1]')
    expect(email.html).toContain('New Case Questionnaire')
    expect(email.html).toContain('Employer, Co-Employee')
    expect(email.html).toContain('Requires Interpreter')
    expect(email.submitterName).toBe('Ana Ruiz')
  })

  it('marks internal tests in the subject', () => {
    const email = buildNotificationEmail({ id: 't', submissionData: entries({ name: 'A' }) }, contactForm, true)
    expect(email.subject.startsWith('[INTERNAL TEST] ')).toBe(true)
  })
})

describe('sendSubmissionNotification', () => {
  const real = { id: 'sub1', form: 'form1', submissionData: entries({ name: 'Jane', email: 'jane@example.org', message: 'Help' }), isSpam: false, isInternalTest: false }

  it('emails the attorney, sends the auto-reply and records "sent"', async () => {
    const payload = fakePayload()
    const { deps, sendMail, autoReply } = fakeDeps()
    const outcome = await sendSubmissionNotification(real, payload as never, logger(), deps)

    expect(outcome).toEqual({ status: 'sent', autoReplySent: true })
    expect(sendMail).toHaveBeenCalledTimes(1)
    expect(sendMail.mock.calls[0][0].to).toEqual(formRecipients)
    expect(autoReply).toHaveBeenCalledWith(expect.anything(), 'jane@example.org', 'Jane', undefined)
    expect(payload.updates).toEqual([
      { id: 'sub1', data: expect.objectContaining({ emailStatus: 'sent', emailSent: true, autoReplySent: true }) },
    ])
  })

  it('sends an internal test to the developer only, never the attorney or the submitter', async () => {
    const payload = fakePayload()
    const { deps, sendMail, autoReply } = fakeDeps()
    await sendSubmissionNotification({ ...real, isSpam: true, isInternalTest: true }, payload as never, logger(), deps)

    expect(sendMail.mock.calls[0][0].to).toEqual(internalTestRecipients)
    expect(sendMail.mock.calls[0][0].bcc).toBeUndefined()
    expect(autoReply.mock.calls[0][3]).toBe(internalTestRecipients[0])
  })

  it('never emails real spam', async () => {
    const payload = fakePayload()
    const { deps, sendMail } = fakeDeps()
    expect(await sendSubmissionNotification({ ...real, isSpam: true }, payload as never, logger(), deps)).toBeNull()
    expect(sendMail).not.toHaveBeenCalled()
    expect(payload.updates).toEqual([])
  })

  it('records "failed" with the error when the mail server rejects it, without throwing', async () => {
    const payload = fakePayload()
    const { deps } = fakeDeps(vi.fn().mockRejectedValue(new Error('535 auth failed')))
    const outcome = await sendSubmissionNotification(real, payload as never, logger(), deps)
    expect(outcome).toEqual({ status: 'failed', error: '535 auth failed' })
    expect(payload.updates[0].data).toMatchObject({ emailStatus: 'failed', emailError: '535 auth failed' })
  })

  it('retries the outcome write once (the create may not be committed yet)', async () => {
    const payload = fakePayload()
    payload.update.mockRejectedValueOnce(new Error('not found'))
    const { deps } = fakeDeps()
    await sendSubmissionNotification(real, payload as never, logger(), deps)
    expect(payload.update).toHaveBeenCalledTimes(2)
    expect(payload.updates).toHaveLength(1)
  })

  it('still emails when the form lookup fails, using raw field names', async () => {
    const payload = fakePayload()
    payload.findByID.mockRejectedValue(new Error('gone'))
    const { deps, sendMail } = fakeDeps()
    await sendSubmissionNotification(real, payload as never, logger(), deps)
    expect(sendMail).toHaveBeenCalledTimes(1)
  })
})

describe('notifyOnCreate hook', () => {
  const req = () => ({ payload: { ...fakePayload(), logger: { info: vi.fn(), error: vi.fn() } } })

  it('returns the doc straight away and does nothing on update or for spam', () => {
    const doc = { id: 'x', isSpam: false }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const run = (args: any) => (notifyOnCreate as any)(args)
    expect(run({ doc, operation: 'update', req: req() })).toBe(doc)
    const r = req()
    expect(run({ doc: { id: 'y', isSpam: true }, operation: 'create', req: r })).toEqual({ id: 'y', isSpam: true })
    expect(r.payload.findByID).not.toHaveBeenCalled()
  })
})

describe('[THIS IS A TEST] marker', () => {
  it('is recognised at the start of the message or name, ignoring case and spaces', () => {
    expect(hasTestMarker({ message: '  [this is a test] checking intake' })).toBe(true)
    expect(hasTestMarker({ name: '[THIS IS A TEST] Julio' })).toBe(true)
    expect(hasTestMarker({ howInjuryOccurred: '[THIS IS A TEST] ladder' })).toBe(true)
    expect(hasTestMarker({ message: 'please note [THIS IS A TEST] in the middle' })).toBe(false)
    expect(hasTestMarker({ message: 'I was hurt at work' })).toBe(false)
  })

  it('makes the classifier treat the submission as an internal test', () => {
    const r = classifySubmission({
      fields: { name: 'Real Looking Name', email: 'someone@gmail.com', message: '[THIS IS A TEST] intake check' },
    })
    expect(r).toMatchObject({ isSpam: true, isInternalTest: true })
    expect(r.reasons).toContain('test-marker')
  })

  it('a marked test is still forwarded to Akomplice, labelled [TEST]; other internal tests are not', () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response('{}', { status: 200 }))
    vi.stubGlobal('fetch', fetchMock)
    process.env[WEBHOOK_URL_ENV] = 'https://app-api.example.test/api/v2/webhooks/forms/TOKEN'
    const log = { info: vi.fn(), warn: vi.fn(), error: vi.fn() }
    const marked = {
      id: 'm1',
      form: 'f',
      isSpam: true,
      isInternalTest: true,
      submissionData: entries({ name: 'Julio', email: 'a@gmail.com', message: '[THIS IS A TEST] hi' }),
    }
    const otherTest = { ...marked, id: 'm2', submissionData: entries({ name: 'test test', email: 'test@test.com', message: 'hi' }) }
    try {
      expect(isMarkedTest(marked)).toBe(true)
      expect(isMarkedTest(otherTest)).toBe(false)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(forwardToAkomplice as any)({ doc: marked, operation: 'create', req: { payload: { logger: log } } })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(forwardToAkomplice as any)({ doc: otherTest, operation: 'create', req: { payload: { logger: log } } })
      expect(fetchMock).toHaveBeenCalledTimes(1)
      expect(JSON.parse(fetchMock.mock.calls[0][1].body).name).toBe('[TEST] Julio')
      expect(buildLeadPayload(marked).name).toBe('Julio')
    } finally {
      vi.unstubAllGlobals()
      delete process.env[WEBHOOK_URL_ENV]
    }
  })
})

describe('anonymous visitors: the spam verdict arrives through req.context', () => {
  // For an anonymous create, Payload strips the staff-only spam fields from the
  // doc that afterChange hooks get. This is what went wrong on the first live
  // test (2026-11-03): the hooks saw a test as a clean enquiry.
  const docWithoutSpamFields: {
    id: string
    form: string
    submissionData: Array<{ field: string; value: string }>
    isSpam?: boolean
    isInternalTest?: boolean
  } = {
    id: 'anon1',
    form: 'f',
    submissionData: entries({ name: 'Julio', email: 'a@gmail.com', message: '[THIS IS A TEST] hi' }),
  }

  const anonReq = (verdict: { isSpam: boolean; isInternalTest: boolean }) => {
    const p = fakePayload()
    return {
      p,
      req: { context: { submissionClassification: verdict }, payload: { ...p, logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn() } } },
    }
  }

  it('does not email or forward real spam even though the doc looks clean', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response('{}', { status: 200 }))
    vi.stubGlobal('fetch', fetchMock)
    process.env[WEBHOOK_URL_ENV] = 'https://app-api.example.test/api/v2/webhooks/forms/TOKEN'
    try {
      const { p, req } = anonReq({ isSpam: true, isInternalTest: false })
      const spamDoc = { ...docWithoutSpamFields, submissionData: entries({ name: 'Bot', message: 'buy now' }) }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(notifyOnCreate as any)({ doc: spamDoc, operation: 'create', req })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(forwardToAkomplice as any)({ doc: spamDoc, operation: 'create', req })
      await new Promise((r) => setTimeout(r, 0))
      expect(p.findByID).not.toHaveBeenCalled()
      expect(fetchMock).not.toHaveBeenCalled()
    } finally {
      vi.unstubAllGlobals()
      delete process.env[WEBHOOK_URL_ENV]
    }
  })

  it('treats a marked test as internal: forwarded as [TEST]', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response('{}', { status: 200 }))
    vi.stubGlobal('fetch', fetchMock)
    process.env[WEBHOOK_URL_ENV] = 'https://app-api.example.test/api/v2/webhooks/forms/TOKEN'
    try {
      const { req } = anonReq({ isSpam: true, isInternalTest: true })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(forwardToAkomplice as any)({ doc: docWithoutSpamFields, operation: 'create', req })
      expect(fetchMock).toHaveBeenCalledTimes(1)
      expect(JSON.parse(fetchMock.mock.calls[0][1].body).name).toBe('[TEST] Julio')
    } finally {
      vi.unstubAllGlobals()
      delete process.env[WEBHOOK_URL_ENV]
    }
  })

  it('routes the email for a marked test to the developer only', async () => {
    const { withClassification } = await import('@/spam/classificationContext')
    const submission = withClassification(docWithoutSpamFields, {
      submissionClassification: { isSpam: true, isInternalTest: true },
    })
    const payload = fakePayload()
    const { deps, sendMail } = fakeDeps()
    await sendSubmissionNotification(submission, payload as never, logger(), deps)
    expect(sendMail.mock.calls[0][0].to).toEqual(internalTestRecipients)
  })
})
