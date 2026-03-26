import { mongooseAdapter } from '@payloadcms/db-mongodb'
import sharp from 'sharp'
import path from 'path'
import { buildConfig, PayloadRequest } from 'payload'
import { fileURLToPath } from 'url'

import { CaseStudies } from './collections/CaseStudies'
import { FAQ } from './collections/FAQ'
import { Categories } from './collections/Categories'
import { PracticeAreaCategories } from './collections/PracticeAreaCategories'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Posts } from './collections/Posts'
import { PracticeAreas } from './collections/PracticeAreas'
import { AreasServed } from './collections/AreasServed'
import { Testimonials } from './collections/Testimonials'
import { Users } from './collections/Users'
import { CtaBanners } from './collections/CtaBanners'
import { CaseQuestionnaireCTA } from './globals/CaseQuestionnaireCTA/config'
import { ContactSection } from './globals/ContactSection/config'
import { FAQSectionGlobal } from './globals/FAQSection/config'
import { ArticlesSectionGlobal } from './globals/ArticlesSection/config'
import { ShortSideFormGlobal } from './globals/ShortSideForm/config'
import { Footer } from './Footer/config'
import { Header } from './Header/config'
import { plugins } from './plugins'
import { defaultLexical } from '@/fields/defaultLexical'
import { getServerSideURL } from './utilities/getURL'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    components: {
      // The `BeforeLogin` component renders a message that you see while logging into your admin panel.
      // Feel free to delete this at any time. Simply remove the line below.
      beforeLogin: ['@/components/BeforeLogin'],
      // The `BeforeDashboard` component renders the 'welcome' block that you see after logging into your admin panel.
      // Feel free to delete this at any time. Simply remove the line below.
      beforeDashboard: ['@/components/BeforeDashboard'],
    },
    autoLogin:
      process.env.NODE_ENV === 'development'
        ? {
            email: process.env.USER_EMAIL,
            password: process.env.USER_PASSWORD,
          }
        : undefined,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    user: Users.slug,
    livePreview: {
      breakpoints: [
        {
          label: 'Mobile',
          name: 'mobile',
          width: 375,
          height: 667,
        },
        {
          label: 'Tablet',
          name: 'tablet',
          width: 768,
          height: 1024,
        },
        {
          label: 'Desktop',
          name: 'desktop',
          width: 1440,
          height: 900,
        },
      ],
    },
  },
  // This config helps us configure global or default features that the other editors can inherit
  editor: defaultLexical,
  db: mongooseAdapter({
    url: process.env.DATABASE_URL || '',
  }),
  collections: [
    Pages,
    Posts,
    PracticeAreas,
    PracticeAreaCategories,
    AreasServed,
    CaseStudies,
    Testimonials,
    FAQ,
    Media,
    Categories,
    Users,
    CtaBanners,
  ],
  cors: [getServerSideURL()].filter(Boolean),
  globals: [
    Header,
    Footer,
    CaseQuestionnaireCTA,
    ContactSection,
    FAQSectionGlobal,
    ArticlesSectionGlobal,
    ShortSideFormGlobal,
  ],
  plugins,
  secret: process.env.PAYLOAD_SECRET,
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  jobs: {
    access: {
      run: ({ req }: { req: PayloadRequest }): boolean => {
        // Allow logged in users to execute this endpoint (default)
        if (req.user) return true

        const secret = process.env.CRON_SECRET
        if (!secret) return false

        // If there is no logged in user, then check
        // for the Vercel Cron secret to be present as an
        // Authorization header:
        const authHeader = req.headers.get('authorization')
        return authHeader === `Bearer ${secret}`
      },
    },
    tasks: [],
  },
})
