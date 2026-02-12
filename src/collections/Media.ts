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
      required: true,
    },
  ],
  upload: {
    staticDir: 'media',
    imageSizes: [
      {
        name: 'thumbnail',
        width: 320,
        height: 320,
      },
      {
        name: 'w600',
        width: 600,
        // When height is undefined, it is calculated automatically based on width while maintaining
        // the original aspect ratio.
      },
      {
        name: 'w1080',
        width: 1080,
        // When height is undefined, it is calculated automatically based on width while maintaining
        // the original aspect ratio.
      },
      {
        name: 'w1920',
        width: 1920,
        // When height is undefined, it is calculated automatically based on width while maintaining
        // the original aspect ratio.
      },
    ],
    adminThumbnail: 'thumbnail',
    mimeTypes: ['image/*'],
  },
}
