import type { CollectionConfig } from 'payload';
import { setAccessRole } from '@/lib/setAccessRole';

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
  access: {
    update: setAccessRole('owner'),
    delete: setAccessRole('owner'),
    create: setAccessRole('owner'),
    read: setAccessRole('admin'),
    admin: () => true,
  },
  fields: [
    {
      name: 'role',
      type: 'select',
      options: ['admin', 'owner', 'manager'],
      defaultValue: 'manager',
      required: true,
      access: {
        update: setAccessRole('owner'),
        create: setAccessRole('owner'),
      },
    },
  ],
};
