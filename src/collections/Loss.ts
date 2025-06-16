import { CollectionConfig } from 'payload';

export const Loss: CollectionConfig = {
  slug: 'loss',
  access: { read: () => true },
  fields: [
    {
      name: 'machine',
      relationTo: 'machine',
      type: 'relationship',
      required: true,
    },
    {
      name: 'datePublish',
      type: 'date',
      required: true,
      label: 'Дата публикации в телеграме рубрики',
    },
    {
      name: 'dateEvent',
      type: 'date',
      required: false,
      label: 'Дата потери',
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
      label: 'Ссылки на источники',
      type: 'array',
      fields: [{ type: 'text', name: 'href', required: true }],
    },
  ],
};
