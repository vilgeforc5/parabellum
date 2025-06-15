import { CollectionConfig } from 'payload';

export const Location: CollectionConfig = {
  slug: 'location',
  admin: { useAsTitle: 'name' },
  access: { read: () => true },
  fields: [
    {
      name: 'name',
      unique: true,
      type: 'text',
      required: true,
    },
    {
      name: 'region',
      type: 'relationship',
      required: true,
      relationTo: 'region',
    },
    {
      name: 'coordinates',
      type: 'text',
      required: true,
    },
  ],
};
