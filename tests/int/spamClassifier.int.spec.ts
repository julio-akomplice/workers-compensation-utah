import { describe, expect, it } from 'vitest'

import { sendAutoReply } from '@/emails/autoReplyEmail'
import { classifySubmission } from '@/spam/classify'
import { entriesToFieldMap, extractSpamMeta } from '@/spam/fields'
import { MIN_SUBMIT_MS } from '@/spam/rules'

/**
 * Samples below are drawn from the campaigns that actually hit the site
 * between June and August 2026, lightly trimmed. The genuine cases are the
 * important half of this file: a false positive means a real injured worker's
 * enquiry is silently withheld from the client, which costs far more than
 * letting a spam message through.
 */

const submit = (fields: Record<string, string>, extra = {}) =>
  classifySubmission({ fields, ...extra })

describe('spam classifier — AI / virtual assistant staffing', () => {
  it('flags the "I tried emailing you" opener', () => {
    const result = submit({
      name: 'Mavis R',
      email: 'mavis@vettedvas.com',
      message:
        "Hi, I tried emailing you, but it seems it didn't go through, so I'm reaching out here instead. We provide trained virtual assistants for law firms at a fraction of the cost.",
    })
    expect(result.isSpam).toBe(true)
    expect(result.reasons).toContain('strong-phrase:i tried emailing you')
  })

  it('flags on the sender domain alone', () => {
    expect(submit({ email: 'hello@virtualhandsupport.com', message: 'Quick note.' }).isSpam).toBe(
      true,
    )
  })

  it('flags VAs 4 Hire branding', () => {
    expect(submit({ message: 'VAs 4 Hire can staff your intake desk.' }).isSpam).toBe(true)
  })
})

describe('spam classifier — legal answering services', () => {
  it('flags the Easybee three-rings pitch', () => {
    const result = submit({
      name: 'Ximena Dominguez',
      email: 'ximena@goeasybee.com',
      message:
        'Firms that pick up calls within three rings sign at nearly double the rate. Easybee answers every call.',
    })
    expect(result.isSpam).toBe(true)
  })

  it('flags the recurring persona on an unknown domain', () => {
    const result = submit({
      name: 'Ximena Dominguez',
      email: 'ximena@some-brand-new-domain-2026.com',
      message: 'Just following up on my note about call coverage.',
    })
    expect(result.isSpam).toBe(true)
    expect(result.reasons).toContain('known-persona:ximena dominguez')
  })
})

describe('spam classifier — commercial cleaning bids', () => {
  it('flags the rotating cleaning template', () => {
    const result = submit({
      name: 'Derek',
      email: 'derek@cleanco-utah.net',
      message:
        'I work in Holladay, and help many local companies. I was hoping I could come by and offer a complimentary cleaning bid? Respond with stop to optout.',
    })
    expect(result.isSpam).toBe(true)
  })
})

describe('spam classifier — SEO / guest post / lead gen', () => {
  it('flags guest post pitches', () => {
    expect(
      submit({ message: 'We would like to publish a guest post with editorial placements.' }).isSpam,
    ).toBe(true)
  })

  it('flags missed-SEO-opportunity pitches', () => {
    expect(
      submit({
        email: 'sales@digitalbeanstalk.com',
        message: 'I found several missed SEO opportunities on your site.',
      }).isSpam,
    ).toBe(true)
  })
})

describe('spam classifier — fake prospective client', () => {
  it('flags the fact-free representation request', () => {
    const result = submit({
      name: 'James Cooper',
      email: 'jamescooper8823@gmail.com',
      message:
        'I am seeking legal representation for a personal injury matter and need help with a Sales and Purchase Agreement.',
    })
    expect(result.isSpam).toBe(true)
  })
})

describe('spam classifier — generic signals', () => {
  it('flags an opt-out footer on its own', () => {
    expect(submit({ message: 'Great site. Reply stop to unsubscribe.' }).isSpam).toBe(true)
  })

  it('needs two weak signals, not one', () => {
    const one = submit({ message: 'We specialize in this area.' })
    expect(one.isSpam).toBe(false)

    const two = submit({
      message: 'We specialize in digital marketing and can grow your firm. No obligation.',
    })
    expect(two.isSpam).toBe(true)
  })
})

describe('spam classifier — honeypot and timing', () => {
  it('flags a filled honeypot', () => {
    const result = submit({ message: 'hello' }, { honeypot: 'http://spam.example' })
    expect(result.isSpam).toBe(true)
    expect(result.reasons).toContain('honeypot-filled')
  })

  it('ignores an empty honeypot', () => {
    expect(submit({ message: 'I hurt my back at work.' }, { honeypot: '' }).isSpam).toBe(false)
  })

  it('flags a sub-3-second submission', () => {
    expect(submit({ message: 'hello' }, { elapsedMs: 900 }).isSpam).toBe(true)
  })

  it('allows a normal-speed submission', () => {
    expect(submit({ message: 'I hurt my back at work.' }, { elapsedMs: MIN_SUBMIT_MS + 1 }).isSpam).toBe(
      false,
    )
  })

  it('treats a missing timestamp as no signal', () => {
    expect(submit({ message: 'I hurt my back at work.' }, { elapsedMs: undefined }).isSpam).toBe(
      false,
    )
  })
})

describe('spam classifier — internal QA submissions', () => {
  it('flags internal test emails with a distinct reason', () => {
    const result = submit({ email: 'julio@akomplice.ai', message: 'testing' })
    expect(result.isSpam).toBe(true)
    expect(result.reasons).toEqual(['internal-test'])
    expect(result.spamReason).toMatch(/not real spam/i)
  })

  it('flags the 999 test phone number', () => {
    const result = submit({ phone: '(999) 999-9999', message: 'test' })
    expect(result.reasons).toEqual(['internal-test'])
  })

  it('marks internal tests distinctly from real spam', () => {
    const internal = submit({ email: 'julio@akomplice.ai', message: 'testing' })
    expect(internal.isInternalTest).toBe(true)

    // Real spam must NOT be treated as internal, or it would be emailed to us
    // instead of being suppressed.
    const spam = submit({ email: 'm@vettedvas.com', message: 'I tried emailing you' })
    expect(spam.isSpam).toBe(true)
    expect(spam.isInternalTest).toBe(false)
  })

  it('recognises plus-addressed internal emails', () => {
    const result = submit({ email: 'julio+contactform@akomplice.ai', message: 'testing' })
    expect(result.isInternalTest).toBe(true)
  })

  it('recognises any address on an internal domain', () => {
    for (const email of ['someone.else@akomplice.ai', 'alea@fusion360agency.com']) {
      expect(submit({ email, message: 'checking the form' }).isInternalTest).toBe(true)
    }
  })

  it('does not treat a real client as internal', () => {
    const result = submit({
      email: 'maria.g.slc@gmail.com',
      message: 'I hurt my back at work.',
    })
    expect(result.isInternalTest).toBe(false)
    expect(result.isSpam).toBe(false)
  })
})

describe('spam classifier — genuine submissions must never be flagged', () => {
  const genuine: { label: string; fields: Record<string, string> }[] = [
    {
      label: 'detailed injury narrative',
      fields: {
        name: 'Maria Gonzalez',
        email: 'maria.g.slc@gmail.com',
        phone: '(801) 555-0143',
        message:
          'I was injured at work in March when a pallet fell on my shoulder. My employer told me to file a claim but the insurance company denied my claim last week. I have been off work for six weeks and I need help.',
      },
    },
    {
      label: 'terse enquiry',
      fields: {
        name: 'Dave R',
        email: 'dave.r@outlook.com',
        message: 'Hurt my back on the job. Can you help me?',
      },
    },
    {
      label: 'mentions the firm website and a consultation',
      fields: {
        name: 'Karen Whitfield',
        email: 'kwhitfield@yahoo.com',
        message:
          'I saw on your website that you offer a free consultation. Can we schedule a call? I wanted to reach out about my workers comp claim after I fell at work.',
      },
    },
    {
      label: 'wage details with "per month"',
      fields: {
        name: 'Luis Ortega',
        email: 'lortega88@gmail.com',
        message:
          'I was making about $3,200 per month before my accident. My supervisor sent me home and now they say I was terminated. I need a lawyer.',
      },
    },
    {
      label: 'mentions their own industry with "I work in"',
      fields: {
        name: 'Tyler B',
        email: 'tylerb.construction@gmail.com',
        message:
          'I work in construction and I slipped on a wet surface. My knee required surgery and physical therapy. Please call me.',
      },
    },
    {
      label: 'landing page short form, no message field',
      fields: {
        firstName: 'Angela',
        lastName: 'Reyes',
        email: 'angela.reyes@gmail.com',
        phone: '(385) 555-0199',
      },
    },
    {
      label: 'asks about an answering service they reached',
      fields: {
        name: 'Robert Kim',
        email: 'rkim@gmail.com',
        message:
          'I called earlier and got your answering service. I got hurt at work and would like to speak with someone about my claim.',
      },
    },
  ]

  /**
   * The hardest cases to get right. These are real people writing two or three
   * words with no injury story at all, so they earn ZERO genuine-narrative
   * credit — nothing offsets a stray keyword match. If a rule is too loose,
   * this is where it shows up.
   */
  const terse: { label: string; message: string }[] = [
    { label: 'bare request for info', message: 'I want info' },
    { label: 'info about services', message: 'I need information about your services.' },
    { label: 'price question', message: 'How much do you charge?' },
    { label: 'availability', message: 'Are you taking new clients?' },
    { label: 'consultation ask', message: 'Do you offer a free consultation? No obligation?' },
    { label: 'call request', message: 'Please call me to schedule a call.' },
    { label: 'website reference', message: 'I saw your website. Can you help?' },
    { label: 'firm reference', message: 'Is your firm able to take my case?' },
    { label: 'one word', message: 'Help' },
    { label: 'question mark only', message: '?' },
    { label: 'spanish enquiry', message: 'Necesito ayuda con mi caso.' },
    { label: 'referral mention', message: 'My cousin recommended your practice to me.' },
    { label: 'no message field at all', message: '' },
  ]

  it.each(terse)('does not flag terse enquiry: $label', ({ message }) => {
    const result = classifySubmission({
      fields: { name: 'Chris Nolan', email: 'chris.nolan@gmail.com', message },
      honeypot: '',
      elapsedMs: 30_000,
    })
    expect(
      result.isSpam,
      `unexpectedly flagged (score ${result.score}): ${result.reasons.join(', ')}`,
    ).toBe(false)
  })

  it.each(genuine)('does not flag: $label', ({ fields }) => {
    const result = classifySubmission({ fields, honeypot: '', elapsedMs: 45_000 })
    expect(
      result.isSpam,
      `unexpectedly flagged (score ${result.score}): ${result.reasons.join(', ')}`,
    ).toBe(false)
  })
})

describe('auto-reply recipient', () => {
  const fakeTransport = () => {
    const sent: { to: string }[] = []
    return {
      sent,
      transport: {
        sendMail: async (opts: { to: string }) => {
          sent.push(opts)
          return true
        },
      },
    }
  }

  it('redirects an internal test confirmation to us, not the address in the form', async () => {
    const { sent, transport } = fakeTransport()

    // A test recognised by phone number, where the email field holds an
    // unrelated third party. They must never receive a confirmation.
    await sendAutoReply(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      transport as any,
      'someone.unrelated@example.org',
      'Tester',
      'julio@akomplice.ai',
    )

    expect(sent).toHaveLength(1)
    expect(sent[0].to).toContain('julio@akomplice.ai')
    expect(sent[0].to).not.toContain('someone.unrelated@example.org')
  })
})

describe('submissionData helpers', () => {
  it('extracts honeypot and elapsed time and keeps them out of the field map', () => {
    const entries = [
      { field: 'name', value: 'Ana' },
      { field: 'sourceUrl', value: 'https://example.com/contact' },
      { field: 'website', value: 'http://bot.example' },
      { field: 'renderedAt', value: String(Date.now() - 5000) },
    ]

    const meta = extractSpamMeta(entries)
    expect(meta.honeypot).toBe('http://bot.example')
    expect(meta.elapsedMs).toBeGreaterThanOrEqual(4900)

    expect(entriesToFieldMap(entries)).toEqual({ name: 'Ana' })
  })

  it('ignores a forged future timestamp rather than treating it as instant', () => {
    const meta = extractSpamMeta([
      { field: 'renderedAt', value: String(Date.now() + 60_000) },
    ])
    expect(meta.elapsedMs).toBeUndefined()
  })
})
