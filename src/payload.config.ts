// storage-adapter-import-placeholder
import { postgresAdapter } from '@payloadcms/db-postgres';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import path from 'path';
import { buildConfig } from 'payload';
import { fileURLToPath } from 'url';
import { ru } from '@payloadcms/translations/languages/ru';
import sharp from 'sharp';

import { Users } from './collections/Users';
import { Media } from './collections/Media';
import { MachineCategory } from '@/collections/MachineCategory';
import { en } from '@payloadcms/translations/languages/en';
import { Machine } from '@/collections/Machine';
import { Loss } from '@/collections/Loss';
import { Location } from '@/collections/Location';
import { Region } from '@/collections/Region';
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, MachineCategory, Machine, Loss, Location, Region],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URI || '' },
  }),
  sharp,
  i18n: {
    supportedLanguages: {
      ru,
      en,
    },
    fallbackLanguage: 'ru',
  },
  plugins: [
    vercelBlobStorage({
      enabled: true,
      collections: {
        media: true,
      },
      token: process.env.BLOB_READ_WRITE_TOKEN,
    }),
  ],
});
