export const TEMPLATE_TYPES = {
  FAQ: 'faq',
  CASE_STUDY: 'case-study',
  BLOG_POST: 'blog-post',
  PRACTICE_AREA: 'practice-area',
  AREAS_SERVED: 'areas-served',
} as const

export type TemplateType = (typeof TEMPLATE_TYPES)[keyof typeof TEMPLATE_TYPES]

export const templateTypeOptions = [
  { label: 'FAQ', value: TEMPLATE_TYPES.FAQ },
  { label: 'Case Study', value: TEMPLATE_TYPES.CASE_STUDY },
  { label: 'Blog Post', value: TEMPLATE_TYPES.BLOG_POST },
  { label: 'Practice Area', value: TEMPLATE_TYPES.PRACTICE_AREA },
  { label: 'Areas Served', value: TEMPLATE_TYPES.AREAS_SERVED },
] as const
