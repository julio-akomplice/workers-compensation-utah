/**
 * Spam rules for contact-form submissions.
 * ---------------------------------------------------------------------------
 * THIS FILE IS MEANT TO BE EDITED BY NON-DEVELOPERS.
 *
 * Everything below is a plain list of words and phrases. To catch a new spam
 * campaign, add a lowercase string to the right list and redeploy. You do not
 * need to touch any other file.
 *
 * IMPORTANT — how these rules age:
 *   The sender names ("Ximena Dominguez") and the domains (vettedvas.com,
 *   goeasybee.com...) ROTATE, often monthly. The same pitch reappears next
 *   month under a brand new name and a brand new domain, so DOMAINS and
 *   PERSONAS will go stale and quietly stop catching anything.
 *   The PHRASES hold up far longer, because the sales copy gets reused almost
 *   word for word across every rotation. When adding a new campaign, spend
 *   your effort on a distinctive SENTENCE from the pitch, not on the domain.
 *
 * How scoring works:
 *   STRONG signals score 10 and flag on their own. Only put something here if
 *   a genuine injured worker would never write it.
 *   WEAK signals score 5. Two of them together reach the threshold of 10.
 *   A message that describes a real injury earns credit that cancels out WEAK
 *   signals, but never cancels a STRONG one.
 *
 * Flagging is never a rejection. A flagged submission is still saved and can
 * be un-flagged by hand in the admin panel.
 */

/** Score at or above which a submission is flagged as spam. */
export const SPAM_THRESHOLD = 10

export const STRONG_SCORE = 10
export const WEAK_SCORE = 5

/** Anything submitted faster than this is almost certainly automated. */
export const MIN_SUBMIT_MS = 3000

/**
 * STRONG — signature sentences lifted from the actual campaigns hitting us.
 * These are close to verbatim and are the single most reliable signal we have.
 */
export const STRONG_PHRASES: string[] = [
  // AI / virtual-assistant staffing — the largest campaign by volume.
  // Nearly every one of these opens with a variant of this sentence.
  'i tried emailing you',
  "it seems it didn't go through",
  'it seems it did not go through',
  'so i am reaching out here instead',
  "so i'm reaching out here instead",
  'reaching out here instead',
  'virtual assistant',
  'virtual assistants',
  'vas 4 hire',
  'vas4hire',
  'vas direct',
  'vasdirect',
  'vetted vas',
  'vettedvas',
  'virtual hand support',
  'virtualhandsupport',
  'business coach vas',
  'businesscoachvas',
  'mavis',

  // Legal answering / intake services (Easybee and its rotations).
  'easybee',
  'goeasybee',
  'legaleasybee',
  'within three rings',
  'pick up calls within',
  // Scoped to the vendor pitch — a client saying "I got your answering
  // service" must not match.
  'legal answering service',
  'answering service for law firms',
  'answering service for your',
  'intake services for law firms',
  'intake service for your',
  '24/7 answering',

  // Commercial cleaning bids — a byte-identical template under rotating names.
  'complimentary cleaning bid',
  'cleaning bid',
  'i work in holladay',
  'help many local companies',
  'janitorial',
  'commercial cleaning',

  // Opt-out footers. No injured worker ends a message asking to be unsubscribed.
  'respond with stop to optout',
  'respond with stop to opt out',
  'reply stop to unsubscribe',
  'to unsubscribe',
  'opt out of future emails',
  'remove me from your list',

  // SEO / guest-post / link-building pitches.
  'guest post',
  'guest posting',
  'editorial placement',
  'missed seo opportunit',
  'link building',
  'backlink',
  'domain authority',
  'digitalbeanstalk',
  'digital beanstalk',
  'scrapeking',
  'scrape king',
  'toplawfirms',
  'top law firms',
  // Found by auditing real traffic: the URL form has no space in it.
  'guestposts',
  'editorial blogs',
  'contextual articles',

  // Vendors selling software or services to the firm.
  'ediscovery',
  'e-discovery',
  'litigation firms',
  'assist litigation',
  'legal marketing',
  'outsourcing firm',
  'we generate cases',
  'generate cases for',

  // People offering the firm their own services.
  'freelance writer',
  'content writer',
  'thought leadership',
  'press releases',
]

/**
 * STRONG — domains seen in the sender's email address or pasted in the body.
 * NOTE: this list goes stale fastest. Expect to add to it, and do not rely on
 * it as the primary defence — the PHRASES above are what actually endure.
 */
export const STRONG_DOMAINS: string[] = [
  'vettedvas.com',
  'businesscoachvas.com',
  'virtualhandsupport.com',
  'vasdirect.com',
  'vas4hire.com',
  'goeasybee.com',
  'legaleasybee.com',
  'digitalbeanstalk.com',
  'scrapeking.com',
  'toplawfirms.com',
]

/**
 * STRONG — recurring fake personas. Same pitch, same name, new domain each time.
 * Stale quickly for the same reason the domains do.
 */
export const STRONG_PERSONAS: string[] = ['ximena dominguez']

/**
 * WEAK — sales language. Common in pitches, but occasionally appears in a
 * genuine message, so two of these are required before anything is flagged.
 */
export const WEAK_PHRASES: string[] = [
  // Every phrase here must be one where the SENDER is positioning themselves
  // as a vendor selling to the firm. Before adding one, ask: "could an injured
  // worker write this?" If there is any doubt, leave it out.
  //
  // Deliberately NOT in this list, because real clients write them all the
  // time: "your website", "your firm", "free consultation", "schedule a call",
  // "I wanted to reach out", "let me know if you", "per month" (wage details),
  // "quick question", "I work in ..." (their industry), "expert witness".

  // Talking about the firm's own marketing rather than the sender's situation.
  'your competitors',
  'your rankings',
  'your search ranking',
  'your online presence',
  'your online visibility',
  'your seo',
  "your firm's website",
  'your firms website',
  'more clients for your',
  'more leads for your',
  'more cases for your',
  'grow your firm',
  'grow your practice',
  'grow your caseload',
  'scale your firm',
  'scale your practice',
  'boost your ranking',
  'increase your caseload',
  'increase your revenue',

  // The sender describes a company selling a service.
  'we specialize in',
  'we help law firms',
  'we help firms',
  'we work with law firms',
  'we work with attorneys',
  'our services include',
  'our team can help your',
  'partner with your firm',
  'partner with your practice',

  // Offer language typical of cold outreach.
  'no obligation',
  'complimentary',
  'free trial',
  'special offer',
  'limited time offer',
  'cost-effective solution',
  'affordable rates for',

  // Fake prospective-client scam — fact-free requests for representation.
  'seeking legal representation for a personal injury matter',
  'sales and purchase agreement',
  'draft an agreement',
  'i need a lawyer for a business',

  // Misc B2B vendors.
  'medical evaluation services',
  'request for proposal',
]

/**
 * A message containing these reads like a real person describing what happened
 * to them. Each one cancels out some WEAK score. Never cancels a STRONG hit.
 */
export const GENUINE_PHRASES: string[] = [
  'i was injured',
  'i got hurt',
  'i was hurt',
  'my injury',
  'my accident',
  'i fell',
  'i slipped',
  'my back',
  'my neck',
  'my shoulder',
  'my knee',
  'my hand',
  'my employer',
  'my boss',
  'my supervisor',
  'my claim',
  'my doctor',
  'my job',
  'at work',
  'on the job',
  'workers comp',
  "worker's comp",
  'workers compensation',
  'work comp',
  'light duty',
  'denied my',
  'fired me',
  'terminated me',
  'i have been off work',
  'surgery',
  'physical therapy',
  'mri',
  'i need help',
  'can you help me',
  'i would like to speak',
  'please call me',
]

/**
 * Internal QA submissions. Flagged as spam so reporting stays clean, but with
 * a distinct reason so they can be told apart from real spam.
 */
export const INTERNAL_TEST_EMAILS: string[] = [
  'julio@akomplice.ai',
  'test@test.com',
  'test@example.com',
]

/**
 * Any address at these domains is one of ours, never a real enquiry. This
 * catches plus-addressing (julio+test@akomplice.ai) and colleagues' addresses
 * without needing each one listed individually.
 *
 * Only add domains you own or control. A public mailbox provider must NEVER
 * go in here — putting "gmail.com" in this list would silently suppress the
 * notification for most real clients.
 */
export const INTERNAL_TEST_DOMAINS: string[] = [
  'akomplice.ai',
  'fusion360agency.com',
  'example.com',
  'test.com',
]

export const INTERNAL_TEST_PHONES: string[] = ['9999999999', '1234567890', '0000000000']

export const INTERNAL_TEST_NAMES: string[] = ['test test', 'asdf', 'qwerty']
