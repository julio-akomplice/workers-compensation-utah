import type { Media } from '@/payload-types'

/**
 * Creates a mock Media object matching the Payload CMS Media shape.
 * Useful for Storybook stories and tests.
 */
let mockIdCounter = 0

export function createMockMedia(
  overrides?: Partial<Media> & { filename?: string },
): { image: Media; id: string } {
  const filename = overrides?.filename ?? 'placeholder.webp'
  const name = filename.replace(/\.[^.]+$/, '')
  const ext = filename.split('.').pop() ?? 'webp'
  const mimeType = `image/${ext}`
  const basePath = `http://localhost:3000/api/media/file`
  const now = new Date().toISOString()

  const width = 1200
  const height = 564

  const makeSizeEntry = (w: number | null, h: number | null) => {
    if (w === null || h === null) {
      return { url: null, width: null, height: null, mimeType: null, filesize: null, filename: null }
    }
    return {
      url: `${basePath}/${filename}`,
      width: w,
      height: h,
      mimeType,
      filesize: Math.round((w * h * 8) / 100),
      filename,
    }
  }

  const aspectRatio = height / width

  const id = String(++mockIdCounter)

  const image: Media = {
    id: Math.random().toString(36).slice(2, 26),
    alt: name,
    createdAt: now,
    updatedAt: now,
    url: `${basePath}/${filename}`,
    filename,
    mimeType,
    filesize: Math.round((width * height * 8) / 100),
    width,
    height,
    focalX: 50,
    focalY: 50,
    thumbnailURL: `${basePath}/${name}-300x${Math.round(300 * aspectRatio)}.${ext}`,
    sizes: {
      thumbnail: makeSizeEntry(300, Math.round(300 * aspectRatio)),
      square: makeSizeEntry(500, 500),
      small: makeSizeEntry(600, Math.round(600 * aspectRatio)),
      medium: makeSizeEntry(900, Math.round(900 * aspectRatio)),
      large: makeSizeEntry(null, null),
      xlarge: makeSizeEntry(null, null),
      og: makeSizeEntry(1200, 630),
    },
    ...overrides,
  }

  return { image, id }
}
