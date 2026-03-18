import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import type { Core } from '@strapi/strapi';
import { BLOG_CATEGORY_SEED, BLOG_LOCALES, BLOG_POST_SEED } from './data/blog';
import {
  COUNTRY_SEED,
  DEFAULT_WAR_CONFLICT_SLUG,
  EQUIPMENT_TYPE_SEED,
  STATUS_SEED,
  WAR_CONFLICT_SEED,
} from './data/lookups';

type SeededDocument = {
  documentId: string;
  id?: number;
  slug?: string | null;
  name?: string | null;
  code?: string | null;
  sourceRecordId?: number | null;
};

type CsvRow = {
  sourceRecordId: number;
  reportId: number;
  reportedAt: string;
  eventDate: string | null;
  eventDateRaw: string | null;
  equipmentLabel: string;
  equipmentName: string;
  equipmentModification: string | null;
  quantity: number;
  statusName: string;
  regionName: string | null;
  latitude: string | null;
  longitude: string | null;
  sourceUrls: string[];
  sourceFlag: boolean;
  countryCode: string;
  distanceKm: string | null;
  destroyedByNames: string[];
};

type SeedExecutionOptions = {
  allowProduction?: boolean;
  force?: boolean;
  source?: 'bootstrap' | 'command';
};

type SeedExecutionResult = {
  changed: boolean;
  seedVersion: string;
};

const APPLICATION_SEED_KEY = 'application-data';
const APPLICATION_SEED_REVISION = 'v4';
const CSV_FILE_NAME = 'baseNew.csv';
const BASE_LOCALE = 'en';

const CYRILLIC_MAP: Record<string, string> = {
  а: 'a',
  б: 'b',
  в: 'v',
  г: 'g',
  д: 'd',
  е: 'e',
  ё: 'e',
  ж: 'zh',
  з: 'z',
  и: 'i',
  й: 'y',
  к: 'k',
  л: 'l',
  м: 'm',
  н: 'n',
  о: 'o',
  п: 'p',
  р: 'r',
  с: 's',
  т: 't',
  у: 'u',
  ф: 'f',
  х: 'kh',
  ц: 'ts',
  ч: 'ch',
  ш: 'sh',
  щ: 'sch',
  ы: 'y',
  э: 'e',
  ю: 'yu',
  я: 'ya',
  ь: '',
  ъ: '',
};

const EQUIPMENT_CANONICAL_OVERRIDES: Record<string, string> = {
  '2s1': '2С1 Гвоздика',
};

function slugify(value: string) {
  const transliterated = value
    .trim()
    .toLowerCase()
    .replace(/[а-яё]/g, (char) => CYRILLIC_MAP[char] ?? char);

  return transliterated
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
}

function stableSlug(value: string, fallback = 'item') {
  const base = slugify(value) || fallback;
  const hash = crypto.createHash('sha1').update(value).digest('hex').slice(0, 6);

  return `${base}-${hash}`;
}

function cleanEquipmentLabel(value: string) {
  return value
    .replace(/["«»“”„‟']/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function equipmentCanonicalKey(value: string) {
  return latinize(cleanEquipmentLabel(value)).replace(/\s+/g, ' ').trim();
}

function resolveEquipmentCanonicalName(value: string) {
  return EQUIPMENT_CANONICAL_OVERRIDES[equipmentCanonicalKey(value)] ?? null;
}

function splitEquipmentName(rawValue: string) {
  const label = cleanEquipmentLabel(rawValue) || 'Unknown equipment';
  const variantMatch = label.match(
    /\s+(на базе|на шасси|based on|on chassis)\s+(.+)$/i
  );

  if (!variantMatch || typeof variantMatch.index !== 'number') {
    return {
      equipmentLabel: label,
      equipmentName: resolveEquipmentCanonicalName(label) ?? label,
      equipmentModification: null,
    };
  }

  const canonicalName = label.slice(0, variantMatch.index).trim();

  return {
    equipmentLabel: label,
    equipmentName:
      resolveEquipmentCanonicalName(canonicalName || label) ??
      canonicalName ??
      label,
    equipmentModification: variantMatch[0].trim(),
  };
}

function latinize(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[а-яё]/g, (char) => CYRILLIC_MAP[char] ?? char);
}

function equipmentSearchText(value: string) {
  const normalized = latinize(value);
  return `${value.toLowerCase()} ${normalized}`;
}

function includesAny(value: string, patterns: string[]) {
  return patterns.some((pattern) => value.includes(pattern));
}

function hasWord(value: string, word: string) {
  return new RegExp(`\\b${word}\\b`, 'i').test(value);
}

function inferEquipmentTypeSlug(name: string) {
  const text = equipmentSearchText(name);

  if (
    includesAny(text, [
      'fpv',
      'uav',
      'drone',
      'orlan',
      'leleka',
      'bayraktar',
      'shark',
      'furiya',
      'furia',
      'pd-2',
      'r18',
      'switchblade',
      'вепр',
      'бпла',
    ])
  ) {
    return 'uav';
  }

  if (
    includesAny(text, [
      'mi-8',
      'mi-17',
      'mi-24',
      'mi-35',
      'ka-52',
      'uh-60',
      'helicopter',
      'vertolet',
      'вертолет',
    ])
  ) {
    return 'helicopter';
  }

  if (
    includesAny(text, [
      'su-25',
      'su-27',
      'mig-',
      'f-16',
      'aircraft',
      'samolyot',
      'самолет',
      'an-',
      'il-',
    ])
  ) {
    return 'aircraft';
  }

  if (
    includesAny(text, [
      'buk',
      'osa',
      'tor',
      's-300',
      's300',
      'patriot',
      'iris-t',
      'nasams',
      'strela',
      'pantsir',
      'зенит',
      'sam',
      'hawk',
      'gepard',
      'p-18',
      'p-19',
    ])
  ) {
    return 'air-defense';
  }

  if (
    includesAny(text, [
      'grad',
      'uragan',
      'smerch',
      'himars',
      'mlrs',
      'tornado-s',
      'bm-21',
      'rm-70',
    ])
  ) {
    return 'multiple-launch-rocket-system';
  }

  if (
    includesAny(text, [
      '2s',
      '2a',
      '2b',
      'm777',
      'krab',
      'pzh',
      'caesar',
      'fh70',
      'd-20',
      'rapira',
      'gvozdika',
      'akatsiya',
      'msta',
      'm109',
      'howitzer',
      'gun',
      'mortar',
      'гаубиц',
      'пушка',
      'миномет',
      'lyagushka',
      'лягушка',
    ])
  ) {
    return 'artillery';
  }

  if (
    includesAny(text, [
      't-64',
      't-72',
      't-80',
      't-90',
      'tank',
      'танк',
      'abrams',
      'leopard',
      'challenger',
      'pt-91',
    ])
  ) {
    return 'tank';
  }

  if (
    includesAny(text, [
      'bmp',
      'bradley',
      'marder',
      'cv90',
      'bmd',
      'warrior',
    ])
  ) {
    return 'infantry-fighting-vehicle';
  }

  if (
    includesAny(text, [
      'btr',
      'm113',
      'stryker',
      'maxxpro',
      'cougar',
      'kirpi',
      'kozak',
      'kozak',
      'mrap',
      'mt-lb',
      'ypr-765',
      'rosomak',
    ])
  ) {
    return 'armored-personnel-carrier';
  }

  if (
    includesAny(text, [
      'radar',
      'counterbattery',
      'counter-battery',
      'контрбатар',
      'locating station',
      'rls',
    ])
  ) {
    return 'radar';
  }

  if (
    includesAny(text, [
      'zhitel',
      'electronic warfare',
      'ew',
      'pole-21',
      'repellent',
      'нота',
      'nota',
      'рэб',
    ])
  ) {
    return 'electronic-warfare';
  }

  if (
    includesAny(text, [
      'bat-2',
      'imr',
      'брэм',
      'bridge',
      'engineering',
      'эвакуац',
      'recovery',
    ])
  ) {
    return 'engineering-vehicle';
  }

  if (
    includesAny(text, [
      'ural',
      'gaz',
      'kamaz',
      'kraz',
      'maz',
      'truck',
      'тягач',
      'трал',
      'ks-',
      'кс-',
    ])
  ) {
    return 'truck';
  }

  if (
    includesAny(text, [
      'pickup',
      'пикап',
      'vehicle',
      'внедорожник',
      'humvee',
      'hmmwv',
      'm1151',
      'm998',
      'jeep',
      'buggy',
      'квадроцикл',
      'suv',
    ])
  ) {
    return 'utility-vehicle';
  }

  if (includesAny(text, ['boat', 'катер', 'rhib'])) {
    return 'boat';
  }

  return 'other';
}

function inferOriginCountryCode(name: string) {
  const text = equipmentSearchText(name);

  if (includesAny(text, ['kozak', 'leleka', 'bogdana', 'чаклун'])) {
    return 'UA';
  }

  if (includesAny(text, ['kirpi', 'bmc', 'bayraktar'])) {
    return 'TR';
  }

  if (includesAny(text, ['leopard', 'pzh', 'marder', 'gepard'])) {
    return 'DE';
  }

  if (includesAny(text, ['challenger', 'as90'])) {
    return 'GB';
  }

  if (includesAny(text, ['caesar', 'amx'])) {
    return 'FR';
  }

  if (includesAny(text, ['krab', 'rosomak'])) {
    return 'PL';
  }

  if (text.includes('rm-70') || hasWord(text, 'dana')) {
    return 'CZ';
  }

  if (includesAny(text, ['cv90', 'archer'])) {
    return 'SE';
  }

  if (includesAny(text, ['ypr-765'])) {
    return 'NL';
  }

  if (
    includesAny(text, [
      'bradley',
      'm113',
      'm777',
      'm109',
      'm1151',
      'm998',
      'stryker',
      'maxxpro',
      'cougar',
      'hmmwv',
      'humvee',
      'abrams',
      'paladin',
    ])
  ) {
    return 'US';
  }

  if (
    includesAny(text, [
      't-',
      'bmp',
      'btr',
      'bmd',
      'ural',
      'gaz',
      'kamaz',
      'mt-lb',
      '2s',
      '2a',
      '2b',
      'bm-21',
      'd-20',
      'rapira',
      'gvozdika',
      'akatsiya',
      'strela',
      'buk',
      'osa',
      's-300',
      'p-18',
      'p-19',
      'msta',
      'дунай',
    ])
  ) {
    return 'SU';
  }

  return 'UNK';
}

function toBlocks(paragraphs: string[] | undefined) {
  if (!paragraphs?.length) {
    return null;
  }

  return paragraphs.map((text) => ({
    type: 'paragraph',
    children: [
      {
        type: 'text',
        text,
      },
    ],
  }));
}

function parseCsvLine(line: string) {
  const fields: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const nextChar = line[index + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        current += '"';
        index += 1;
        continue;
      }

      inQuotes = !inQuotes;
      continue;
    }

    if (char === ';' && !inQuotes) {
      fields.push(current);
      current = '';
      continue;
    }

    current += char;
  }

  fields.push(current);
  return fields;
}

function parseJsonArray(value: string) {
  if (!value) {
    return [];
  }

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed)
      ? parsed.filter((item) => typeof item === 'string')
      : [];
  } catch {
    return [];
  }
}

function parseCoordinates(value: string) {
  if (!value) {
    return { latitude: null, longitude: null };
  }

  const [latitude, longitude] = value.split(',').map((part) => part.trim());

  return {
    latitude: latitude || null,
    longitude: longitude || null,
  };
}

function normalizeEventDate(rawValue: string) {
  if (!rawValue) {
    return {
      eventDate: null,
      eventDateRaw: null,
    };
  }

  return /^\d{4}-\d{2}-\d{2}$/.test(rawValue)
    ? { eventDate: rawValue, eventDateRaw: rawValue }
    : { eventDate: null, eventDateRaw: rawValue };
}

function mapCsvRow(fields: string[]): CsvRow {
  const normalizedFields = fields.concat(
    Array.from({ length: Math.max(0, 16 - fields.length) }, () => ''),
  );
  const { latitude, longitude } = parseCoordinates(normalizedFields[9]);
  const { eventDate, eventDateRaw } = normalizeEventDate(
    normalizedFields[3].trim(),
  );
  const equipmentIdentity = splitEquipmentName(normalizedFields[4].trim());

  return {
    sourceRecordId: Number.parseInt(normalizedFields[0], 10),
    reportId: Number.parseInt(normalizedFields[1], 10),
    reportedAt: normalizedFields[2].trim(),
    eventDate,
    eventDateRaw,
    equipmentLabel: equipmentIdentity.equipmentLabel,
    equipmentName: equipmentIdentity.equipmentName,
    equipmentModification: equipmentIdentity.equipmentModification,
    quantity: Number.parseInt(normalizedFields[5], 10) || 1,
    statusName: normalizedFields[6].trim(),
    regionName: normalizedFields[8].trim() || null,
    latitude,
    longitude,
    sourceUrls: parseJsonArray(normalizedFields[11]),
    sourceFlag: normalizedFields[12].trim() === '1',
    countryCode: normalizedFields[13].trim() || 'UA',
    distanceKm: normalizedFields[14].trim() || null,
    destroyedByNames: parseJsonArray(normalizedFields[15]),
  };
}

async function readCsvRows(csvPath: string) {
  const content = new TextDecoder('windows-1251').decode(
    await fs.readFile(csvPath),
  );

  return content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map(parseCsvLine)
    .map(mapCsvRow);
}

function getDocuments(strapi: Core.Strapi, uid: string) {
  return strapi.documents(uid as any) as any;
}

async function fetchAllDocuments(
  strapi: Core.Strapi,
  uid: string,
  fields: string[],
) {
  const documents: SeededDocument[] = [];
  let page = 1;
  const pageSize = 1000;

  while (true) {
    const batch = (await getDocuments(strapi, uid).findMany({
      fields: fields as any,
      page,
      pageSize,
    })) as SeededDocument[];

    documents.push(...batch);

    if (batch.length < pageSize) {
      break;
    }

    page += 1;
  }

  return documents;
}

async function upsertByField(
  strapi: Core.Strapi,
  uid: string,
  field: string,
  value: string | number,
  data: Record<string, unknown>,
  params?: Record<string, unknown>,
) {
  const documents = getDocuments(strapi, uid);
  const existing = (await documents.findFirst({
    ...params,
    filters: {
      [field]: {
        $eq: value,
      },
    },
    fields: ['documentId'],
  })) as SeededDocument | null;

  if (existing?.documentId) {
    return documents.update({
      ...params,
      documentId: existing.documentId,
      data,
    }) as Promise<SeededDocument>;
  }

  return documents.create({
    ...params,
    data,
  }) as Promise<SeededDocument>;
}

async function upsertLocalizedBySlug(
  strapi: Core.Strapi,
  uid: string,
  slug: string,
  enData: Record<string, unknown>,
  ruData: Record<string, unknown>,
) {
  const baseDocument = await upsertByField(
    strapi,
    uid,
    'slug',
    slug,
    {
      slug,
      ...enData,
    },
    {
      locale: BASE_LOCALE,
      status: 'published',
    },
  );

  await getDocuments(strapi, uid).update({
    documentId: baseDocument.documentId,
    locale: 'ru',
    status: 'published',
    data: {
      slug,
      ...ruData,
    },
  });

  return baseDocument;
}

async function ensureSeedLookups(strapi: Core.Strapi) {
  const countries = new Map<string, SeededDocument>();
  const equipmentTypes = new Map<string, SeededDocument>();
  const statuses = new Map<string, SeededDocument>();
  const conflicts = new Map<string, SeededDocument>();

  for (const country of COUNTRY_SEED) {
    const document = await upsertByField(
      strapi,
      'api::country.country',
      'code',
      country.code,
      country,
    );
    countries.set(country.code, document);
  }

  for (const status of STATUS_SEED) {
    const document = await upsertByField(
      strapi,
      'api::status.status',
      'slug',
      status.slug,
      status,
    );
    statuses.set(status.name, document);
  }

  for (const equipmentType of EQUIPMENT_TYPE_SEED) {
    const document = await upsertByField(
      strapi,
      'api::equipment-type.equipment-type',
      'slug',
      equipmentType.slug,
      equipmentType,
    );
    equipmentTypes.set(equipmentType.slug, document);
  }

  for (const conflict of WAR_CONFLICT_SEED) {
    const document = await upsertByField(
      strapi,
      'api::war-conflict.war-conflict',
      'slug',
      conflict.slug,
      conflict,
    );

    conflicts.set(conflict.slug, document);
  }

  return { countries, equipmentTypes, statuses, conflicts };
}

async function seedBlogContent(strapi: Core.Strapi) {
  const categories = new Map<string, SeededDocument>();

  for (const category of BLOG_CATEGORY_SEED) {
    const baseDocument = await upsertLocalizedBySlug(
      strapi,
      'api::blog-post-category.blog-post-category',
      category.slug,
      {
        name: category.translations.en.name,
        description: category.translations.en.description,
      },
      {
        name: category.translations.ru.name,
        description: category.translations.ru.description,
      },
    );

    categories.set(category.slug, baseDocument);
  }

  for (const post of BLOG_POST_SEED) {
    const category = categories.get(post.categorySlug);

    if (!category?.documentId) {
      throw new Error(`Missing blog category for slug "${post.categorySlug}"`);
    }

    await upsertLocalizedBySlug(
      strapi,
      'api::blog-post.blog-post',
      post.slug,
      {
        title: post.translations.en.title,
        slug: post.slug,
        excerpt: post.translations.en.excerpt,
        content: toBlocks(post.translations.en.content),
        author: post.author,
        readTime: post.readTime,
        category: category.documentId,
      },
      {
        title: post.translations.ru.title,
        slug: post.slug,
        excerpt: post.translations.ru.excerpt,
        content: toBlocks(post.translations.ru.content),
        author: post.author,
        readTime: post.readTime,
        category: category.documentId,
      },
    );
  }

  strapi.log.info(
    `Seeded localized blog content for locales: ${BLOG_LOCALES.join(', ')}`,
  );
}

async function resetSeededEquipmentDataset(strapi: Core.Strapi) {
  const tables = [
    'destroyed_equipments_destroyed_by_lnk',
    'destroyed_equipments_equipment_lnk',
    'destroyed_equipments_country_lnk',
    'destroyed_equipments_region_lnk',
    'destroyed_equipments_status_lnk',
    'destroyed_equipments_war_conflict_lnk',
    'destroyed_equipments_cmps',
    'destroyed_equipments',
    'equipments_origin_country_lnk',
    'equipments_type_lnk',
    'equipments',
    'regions_country_lnk',
    'regions',
    'destroyed_bies',
  ];

  for (const table of tables) {
    await strapi.db.connection(table).delete();
  }

  strapi.log.info('Cleared seeded equipment dataset tables for a fresh dev import.');
}

async function seedDestroyedEquipment(
  strapi: Core.Strapi,
  csvRows: CsvRow[],
  lookups: Awaited<ReturnType<typeof ensureSeedLookups>>,
) {
  const defaultConflict = lookups.conflicts.get(DEFAULT_WAR_CONFLICT_SLUG);

  if (!defaultConflict?.documentId) {
    throw new Error(`Missing war conflict seed "${DEFAULT_WAR_CONFLICT_SLUG}"`);
  }

  const destroyedByNames = new Set<string>();
  const equipmentNames = new Set<string>();
  const regionNames = new Set<string>();

  for (const row of csvRows) {
    row.destroyedByNames.forEach((tag) => destroyedByNames.add(tag));
    equipmentNames.add(row.equipmentName);

    if (row.regionName) {
      regionNames.add(row.regionName);
    }
  }

  const destroyedByMap = new Map<string, SeededDocument>();
  for (const name of destroyedByNames) {
    const document = await upsertByField(
      strapi,
      'api::destroyed-by.destroyed-by',
      'slug',
      slugify(name),
      {
        name,
        slug: slugify(name),
      },
    );

    destroyedByMap.set(name, document);
  }

  const regionMap = new Map<string, SeededDocument>();
  const defaultCountry = lookups.countries.get('UA');

  for (const name of regionNames) {
    const document = await upsertByField(
      strapi,
      'api::region.region',
      'slug',
      slugify(name),
      {
        name,
        slug: slugify(name),
        country: defaultCountry?.documentId ?? null,
      },
    );

    regionMap.set(name, document);
  }

  const equipmentMap = new Map<string, SeededDocument>();
  const unknownCountry = lookups.countries.get('UNK');
  const unknownType = lookups.equipmentTypes.get('unknown');

  for (const name of equipmentNames) {
    const originCountryCode = inferOriginCountryCode(name);
    const equipmentTypeSlug = inferEquipmentTypeSlug(name);
    const document = await upsertByField(
      strapi,
      'api::equipment.equipment',
      'name',
      name,
      {
        name,
        slug: stableSlug(name, 'equipment'),
        originCountry:
          lookups.countries.get(originCountryCode)?.documentId ??
          unknownCountry?.documentId ??
          null,
        type:
          lookups.equipmentTypes.get(equipmentTypeSlug)?.documentId ??
          unknownType?.documentId ??
          null,
      },
    );

    equipmentMap.set(name, document);
  }

  const existing = await fetchAllDocuments(
    strapi,
    'api::destroyed-equipment.destroyed-equipment',
    ['documentId', 'sourceRecordId'],
  );
  const existingMap = new Map<number, string>();

  existing.forEach((document) => {
    if (typeof document.sourceRecordId === 'number' && document.documentId) {
      existingMap.set(document.sourceRecordId, document.documentId);
    }
  });

  let created = 0;
  let updated = 0;

  for (const [index, row] of csvRows.entries()) {
    const status = lookups.statuses.get(row.statusName);
    const country =
      lookups.countries.get(row.countryCode) ?? lookups.countries.get('UA');
    const equipment = equipmentMap.get(row.equipmentName);
    const region = row.regionName ? regionMap.get(row.regionName) : undefined;
    const destroyedBy = row.destroyedByNames
      .map((name) => destroyedByMap.get(name)?.documentId)
      .filter(Boolean) as string[];

    const data = {
      sourceRecordId: row.sourceRecordId,
      reportId: row.reportId,
      reportedAt: row.reportedAt,
      eventDate: row.eventDate,
      eventDateRaw: row.eventDateRaw,
      equipmentLabel: row.equipmentLabel,
      equipmentModification: row.equipmentModification,
      equipment: equipment?.documentId ?? null,
      quantity: row.quantity,
      sourceFlag: row.sourceFlag,
      latitude: row.latitude,
      longitude: row.longitude,
      distanceKm: row.distanceKm,
      country: country?.documentId ?? null,
      region: region?.documentId ?? null,
      status: status?.documentId ?? null,
      warConflict: defaultConflict.documentId,
      destroyedBy,
      sourceUrls: row.sourceUrls.map((url) => ({ url })),
    };

    const existingDocumentId = existingMap.get(row.sourceRecordId);

    if (existingDocumentId) {
      await getDocuments(
        strapi,
        'api::destroyed-equipment.destroyed-equipment',
      ).update({
        documentId: existingDocumentId,
        data,
      });
      updated += 1;
    } else {
      const createdDocument = (await getDocuments(
        strapi,
        'api::destroyed-equipment.destroyed-equipment',
      ).create({
        data,
      })) as SeededDocument;

      existingMap.set(row.sourceRecordId, createdDocument.documentId);
      created += 1;
    }

    if ((index + 1) % 500 === 0) {
      strapi.log.info(
        `Seeded destroyed equipment rows: ${index + 1}/${csvRows.length}`,
      );
    }
  }

  strapi.log.info(
    `Destroyed equipment seed complete. Created ${created}, updated ${updated}, total ${csvRows.length}.`,
  );
}

async function computeSeedVersion(csvPath: string) {
  const csvBuffer = await fs.readFile(csvPath);
  const hash = crypto.createHash('sha1').update(csvBuffer).digest('hex');

  return `${APPLICATION_SEED_REVISION}:${hash}`;
}

export async function runApplicationSeed(
  strapi: Core.Strapi,
  options: SeedExecutionOptions = {},
): Promise<SeedExecutionResult> {
  const csvPath = path.resolve(strapi.dirs.app.root, '..', '..', CSV_FILE_NAME);
  const seedStore = strapi.store({
    type: 'core',
    name: 'seed',
  });
  const isProduction = process.env.NODE_ENV === 'production';

  try {
    await fs.access(csvPath);
  } catch {
    throw new Error(`Seed CSV file not found at ${csvPath}`);
  }

  if (isProduction && !options.allowProduction) {
    throw new Error(
      'Refusing to run the seed in production without --allow-production or SEED_ALLOW_PRODUCTION=true.',
    );
  }

  const seedVersion = await computeSeedVersion(csvPath);
  const existingVersion = await seedStore.get({
    key: APPLICATION_SEED_KEY,
  });

  if (!options.force && existingVersion === seedVersion) {
    strapi.log.info('Application seed is already up to date.');
    return {
      changed: false,
      seedVersion,
    };
  }

  strapi.log.info(
    `Running application seed (${options.source ?? 'command'})...`,
  );

  const csvRows = await readCsvRows(csvPath);
  const lookups = await ensureSeedLookups(strapi);

  await seedBlogContent(strapi);
  await resetSeededEquipmentDataset(strapi);
  await seedDestroyedEquipment(strapi, csvRows, lookups);

  await seedStore.set({
    key: APPLICATION_SEED_KEY,
    value: seedVersion,
  });

  strapi.log.info('Application seed finished.');

  return {
    changed: true,
    seedVersion,
  };
}

export async function seedDevelopmentData(strapi: Core.Strapi) {
  if (process.env.STRAPI_SKIP_BOOTSTRAP_SEED === 'true') {
    return;
  }

  if (process.env.NODE_ENV !== 'development') {
    return;
  }

  await runApplicationSeed(strapi, {
    source: 'bootstrap',
  });
}
