import { CollectionConfig } from 'payload';
import countries from 'i18n-iso-countries';

export const Machine: CollectionConfig = {
  slug: 'machine',
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
      name: 'category',
      relationTo: 'machineCategory',
      type: 'relationship',
    },
    {
      name: 'country',
      type: 'select',
      required: true,
      options: Object.keys(countries.getAlpha2Codes()).map((value) => ({
        value,
        label: countries.getName(value, 'ru') || value,
      })),
    },
  ],
};
