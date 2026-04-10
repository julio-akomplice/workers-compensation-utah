import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { FooterContent } from './FooterContent'
import { createMockMedia } from '@/utilities/createMockMedia'
import type { PracticeArea, Page, AreasServed } from '@/payload-types'

const meta: Meta<typeof FooterContent> = {
  title: 'Globals/Footer',
  component: FooterContent,
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta
type Story = StoryObj<typeof FooterContent>

const mockPracticeArea = (id: string, title: string, slug: string): PracticeArea => ({
  id,
  title,
  slug,
  hero: { type: 'none' },
  general: { alternativeTitle: null, icon: 'mock-icon', shortDescription: '' },
  contentSection: {
    content: {
      root: { type: 'root', children: [], direction: null, format: '', indent: 0, version: 1 },
    },
  },
  layout: [],
  createdAt: '',
  updatedAt: '',
})

const mockPage = (id: string, title: string, slug: string): Page => ({
  id,
  title,
  slug,
  hero: { type: 'none' },
  layout: [],
  createdAt: '',
  updatedAt: '',
})

const mockAreasServed = (id: string, title: string): AreasServed => ({
  id,
  title,
  slug: title.toLowerCase().replace(/\s+/g, '-'),
  hero: { type: 'none' },
  general: { shortDescription: '' },
  contentSection: {
    content: {
      root: { type: 'root', children: [], direction: 'ltr', format: '', indent: 0, version: 1 },
    },
  },
  layout: [],
  createdAt: '',
  updatedAt: '',
})

export const Default: Story = {
  args: {
    id: '1',
    logo: createMockMedia({ filename: 'wcu-logo.svg', mimeType: 'image/svg+xml' }).image,
    practiceAreaLinks: [
      mockPracticeArea('1', "Workers' Compensation", 'workers-compensation'),
      mockPracticeArea('2', 'Permanent Wage Loss', 'permanent-wage-loss'),
      mockPracticeArea('3', 'Construction Accident', 'construction-accident'),
      mockPracticeArea('4', 'Slip and Fall Accident', 'slip-and-fall-accident'),
      mockPracticeArea('5', 'Catastrophic Injury', 'catastrophic-injury'),
      mockPracticeArea('6', 'Wrongful Death', 'wrongful-death'),
    ],
    areasServed: [
      mockAreasServed('1', 'Draper'),
      mockAreasServed('2', 'Ogden'),
      mockAreasServed('3', 'Orem'),
      mockAreasServed('4', 'Provo'),
      mockAreasServed('5', 'Salt Lake City'),
      mockAreasServed('6', 'West Jordan'),
      mockAreasServed('7', 'West Valley City'),
    ],
    quickLinks: [
      mockPage('10', 'About', 'about'),
      mockPage('11', 'Practice Areas', 'practice-areas'),
      mockPage('12', 'Areas We Serve', 'areas-we-serve'),
      mockPage('13', 'Case Results', 'case-results'),
      mockPage('14', 'Case Questionnaire', 'case-questionnaire'),
      mockPage('15', 'Blog', 'blog'),
      mockPage('16', 'FAQS', 'faqs'),
    ],
    phone: { label: '(801) 424-9675', url: 'tel:+18014249675' },
    fax: { label: '(801) 683-7575', url: 'fax:+18016837575' },
    address: { text: '2046 E Murray Holladay Rd # 108, Holladay, UT 84117', mapUrl: 'https://maps.google.com/?q=2046+E+Murray+Holladay+Rd+108+Holladay+UT+84117' },
    socialLinks: [
      { name: 'LinkedIn', url: 'https://linkedin.com', image: 'mock-image', id: '1' },
      { name: 'Google', url: 'https://google.com', image: 'mock-image', id: '2' },
    ],
    copyrightText: "Workers' Compensation Utah",
    allRightsReservedText: 'All Rights Reserved',
    privacyPolicyPage: mockPage('20', 'Privacy Policy', 'privacy-policy'),
    privacyPolicyLabel: 'Privacy Policy',
    legalMarketingText: 'Website and Legal Marketing by Legal Akomplice',
    legalMarketingUrl: 'https://LegalAkomplice.ai/internet-marketing',
  },
}
