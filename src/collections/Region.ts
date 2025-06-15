import { CollectionConfig } from 'payload';

export const Region: CollectionConfig = {
  slug: 'region',
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
      name: 'longname',
      unique: true,
      type: 'text',
      required: false,
    },
  ],
};
