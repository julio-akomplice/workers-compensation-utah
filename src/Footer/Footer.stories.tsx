import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { FooterContent } from './FooterContent'
import { createMockMedia } from '@/utilities/createMockMedia'
import type { PracticeArea, Page } from '@/payload-types'

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
      { city: 'Draper', id: '1' },
      { city: 'Ogden', id: '2' },
      { city: 'Orem', id: '3' },
      { city: 'Provo', id: '4' },
      { city: 'Salt Lake City', id: '5' },
      { city: 'West Jordan', id: '6' },
      { city: 'West Valley City', id: '7' },
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
    phone: '(801) 424-9675',
    fax: '(801) 683-7575',
    address: '2046 E Murray Holladay Rd # 108, Holladay, UT 84117',
    addressMapUrl: 'https://maps.google.com/?q=2046+E+Murray+Holladay+Rd+108+Holladay+UT+84117',
    socialLinks: [
      { platform: 'linkedin', url: 'https://linkedin.com', id: '1' },
      { platform: 'google', url: 'https://google.com', id: '2' },
    ],
    copyrightYear: '2026',
    companyName: "Workers' Compensation Utah",
    allRightsReservedText: 'All Rights Reserved',
    privacyPolicyPage: mockPage('20', 'Privacy Policy', 'privacy-policy'),
    privacyPolicyLabel: 'Privacy Policy',
    legalMarketingText: 'Website and Legal Marketing by Legal Akomplice',
    legalMarketingUrl: 'https://LegalAkomplice.ai/internet-marketing',
  },
}
