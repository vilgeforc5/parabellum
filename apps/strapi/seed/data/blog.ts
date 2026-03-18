type SeedLocale = 'en' | 'ru';

export interface SeedTranslation {
  title?: string;
  excerpt?: string;
  description?: string;
  content?: string[];
  name?: string;
}

export interface SeedTranslations {
  en: SeedTranslation;
  ru: SeedTranslation;
}

export const BLOG_CATEGORY_SEED: Array<{
  slug: string;
  translations: SeedTranslations;
}> = [
  {
    slug: 'analysis',
    translations: {
      en: {
        name: 'Analysis',
        description: 'Context, patterns, and implications behind verified losses.',
      },
      ru: {
        name: 'Аналитика',
        description: 'Контекст, паттерны и выводы на основе подтвержденных потерь.',
      },
    },
  },
  {
    slug: 'frontline-notes',
    translations: {
      en: {
        name: 'Frontline Notes',
        description: 'Short battlefield updates grounded in verified evidence.',
      },
      ru: {
        name: 'Сводки фронта',
        description:
          'Короткие сводки по фронту, основанные на подтвержденных материалах.',
      },
    },
  },
  {
    slug: 'methodology',
    translations: {
      en: {
        name: 'Methodology',
        description: 'How the project structures evidence, dates, and locations.',
      },
      ru: {
        name: 'Методология',
        description: 'Как проект структурирует источники, даты и географию.',
      },
    },
  },
];

export const BLOG_POST_SEED: Array<{
  slug: string;
  author: string;
  readTime: number;
  categorySlug: string;
  translations: SeedTranslations;
}> = [
  {
    slug: 'building-a-loss-dataset',
    author: 'Parabellum Editorial',
    readTime: 6,
    categorySlug: 'methodology',
    translations: {
      en: {
        title: 'Building a Loss Dataset That Survives Real Evidence',
        excerpt:
          'Why source links, fuzzy dates, and geocoding quality matter more than a clean CSV.',
        content: [
          'A military loss dataset gets messy the moment you move from screenshots into structured evidence.',
          'The same report can reference multiple assets, dates are often approximate, and locations may range from exact coordinates to vague regional labels.',
          'Our seed keeps the raw source context so editors can refine records in Strapi instead of losing fidelity during import.',
        ],
      },
      ru: {
        title: 'Как собрать базу потерь, которая выдерживает реальную доказательную базу',
        excerpt:
          'Почему ссылки на источники, неточные даты и качество геокодирования важнее красивого CSV.',
        content: [
          'База потерь становится сложной сразу, как только вы переходите от скриншотов к структурированным доказательствам.',
          'Один и тот же отчет может содержать несколько единиц техники, даты часто указаны приблизительно, а локации варьируются от точных координат до общих регионов.',
          'Поэтому seed сохраняет исходный контекст, чтобы редакторы могли дорабатывать записи в Strapi без потери деталей.',
        ],
      },
    },
  },
  {
    slug: 'why-filters-matter-for-osint',
    author: 'Field Desk',
    readTime: 4,
    categorySlug: 'analysis',
    translations: {
      en: {
        title: 'Why Filterable OSINT Data Changes the Product',
        excerpt:
          'Once statuses, conflicts, and strike methods become structured, the frontend can do more than render a list.',
        content: [
          'Structured relations turn a pile of reports into something queryable.',
          'With explicit statuses, strike methods, and conflict links, the same dataset supports cards, filters, charts, and map layers.',
          'That is why the Strapi model is built around relations first and presentation second.',
        ],
      },
      ru: {
        title: 'Почему фильтруемые OSINT-данные меняют продукт',
        excerpt:
          'Когда статусы, конфликты и способы поражения становятся структурированными, фронтенд может делать больше, чем просто список.',
        content: [
          'Структурированные связи превращают набор отчетов в реально запрашиваемую систему.',
          'Когда статусы, способы поражения и конфликты явно описаны, одна и та же база поддерживает карточки, фильтры, графики и карту.',
          'Поэтому модель Strapi строится сначала вокруг связей, а уже потом вокруг отображения.',
        ],
      },
    },
  },
  {
    slug: 'reading-frontline-signals',
    author: 'Operations Review',
    readTime: 5,
    categorySlug: 'frontline-notes',
    translations: {
      en: {
        title: 'Reading Frontline Signals From Verified Loss Records',
        excerpt:
          'Recent losses are not the whole picture, but they are a powerful public signal when the data is clean.',
        content: [
          'A timeline of verified losses can highlight shifts in pressure, tempo, or strike methods.',
          'It is still incomplete by nature, which is why provenance and update cadence must stay visible.',
          'The seed data is intentionally opinionated enough to power a homepage while leaving room for a richer model later.',
        ],
      },
      ru: {
        title: 'Как читать сигналы фронта по подтвержденным потерям',
        excerpt:
          'Недавние потери не показывают всю картину, но при чистых данных это сильный публичный сигнал.',
        content: [
          'Хронология подтвержденных потерь помогает увидеть изменение давления, темпа и способов поражения.',
          'Но данные по определению неполны, поэтому происхождение записей и частота обновлений должны быть прозрачны.',
          'Seed-данные специально сделаны достаточно полезными для главной страницы, но без ограничения для будущей модели.',
        ],
      },
    },
  },
];

export const BLOG_LOCALES: SeedLocale[] = ['en', 'ru'];
