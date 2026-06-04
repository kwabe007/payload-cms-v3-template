import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      admin: {
        description:
          'The alt attribute is a short text description of an image that helps screen readers convey its meaning and appears if the image fails to load.',
      },
    },
  ],
  upload: {
    staticDir: 'media',
    imageSizes: [
      {
        name: 'thumbnail_256',
        width: 256,
      },
      {
        name: 'tablet_768',
        width: 768,
      },
      {
        name: 'large_1280',
        width: 1280,
      },
      {
        name: 'desktop_1920',
        width: 1920,
      },
    ],
    adminThumbnail: 'thumbnail',
    mimeTypes: ['image/*', 'video/*'],
  },
}
