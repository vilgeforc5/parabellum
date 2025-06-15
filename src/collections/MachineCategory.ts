import type { CollectionConfig } from 'payload';

export const MachineCategory: CollectionConfig = {
  slug: 'machineCategory',
  admin: {
    useAsTitle: 'name',
  },
  access: { read: () => true },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'icon',
      label: 'SVG Icon',
      type: 'upload',
      required: true,
      relationTo: 'media',
    },
  ],
};
