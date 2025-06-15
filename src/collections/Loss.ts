import { CollectionConfig } from 'payload';

export const Loss: CollectionConfig = {
  slug: 'loss',
  access: { read: () => true },
  fields: [
    {
      name: 'machine',
      relationTo: 'machine',
      type: 'relationship',
    },
    {
      name: 'datePublish',
      type: 'date',
      required: true,
    },
    {
      name: 'dateEvent',
      type: 'date',
      required: false,
    },
    {
      name: 'location',
      relationTo: 'location',
      type: 'relationship',
    },
    {
      name: 'status',
      type: 'select',
      options: ['unknown', 'destroyed', 'damaged', 'trophy'],
      defaultValue: 'destroyed',
    },
    {
      name: 'images',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
    },
    {
      name: 'links',
      type: 'array',
      fields: [{ type: 'text', name: 'href' }],
    },
  ],
};
