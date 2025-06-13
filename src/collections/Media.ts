import type { CollectionConfig } from 'payload'
import { setAccessRole } from '@/lib/setAccessRole'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    update: setAccessRole('admin'),
    delete: setAccessRole('admin'),
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
  upload: true,
}
