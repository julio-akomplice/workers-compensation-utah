import type { Payload } from 'payload'

const areas = [
  {
    title: 'Areas Served',
    slug: 'areas-served',
  },
  {
    title: 'Draper',
    slug: 'draper',
  },
  {
    title: 'Ogden',
    slug: 'ogden',
  },
  {
    title: 'Orem',
    slug: 'orem',
  },
  {
    title: 'Provo',
    slug: 'provo',
  },
  {
    title: 'Salt Lake City',
    slug: 'salt-lake-city',
  },
  {
    title: 'West Jordan',
    slug: 'west-jordan',
  },
  {
    title: 'West Valley City',
    slug: 'west-valley-city',
  },
]

export const seedAreasServed = async (payload: Payload): Promise<void> => {
  payload.logger.info('— Seeding areas served...')

  for (const area of areas) {
    await payload.create({
      collection: 'areas-served',
      draft: true,
      depth: 0,
      context: {
        disableRevalidate: true,
      },
      data: {
        hero: { type: 'none' },
        title: area.title,
        slug: area.slug,
        _status: 'published',
        general: {
          shortDescription: `Workers' compensation attorney serving ${area.title}, Utah.`,
        },
        contentSection: {
          content: {
            root: {
              type: 'root',
              children: [],
              direction: 'ltr',
              format: '',
              indent: 0,
              version: 1,
            },
          },
        },
        layout: [
          {
            blockType: 'content',
            columns: [
              {
                size: 'full',
                richText: {
                  root: {
                    type: 'root',
                    children: [
                      {
                        type: 'paragraph',
                        children: [
                          {
                            type: 'text',
                            text: `Workers' compensation attorney serving ${area.title}, Utah. If you've been injured on the job, our experienced legal team can help you get the compensation you deserve.`,
                          },
                        ],
                        version: 1,
                      },
                    ],
                    direction: 'ltr',
                    format: '',
                    indent: 0,
                    version: 1,
                  },
                },
              },
            ],
          },
        ],
      },
    })
  }

  payload.logger.info('— Areas served seeded successfully!')
}
