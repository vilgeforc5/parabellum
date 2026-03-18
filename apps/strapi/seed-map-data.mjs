/**
 * Seed script: populates Strapi with mock map data.
 * Run with: node apps/strapi/seed-map-data.mjs
 */

const BASE_URL = 'http://localhost:1337/api';
const TOKEN = '52cda3e6e52f0813fce395c509c8d959703d1ef64ce8a07bbf60d50e6fe6e95b9384af079f5489df51303dcc4e15a91472ca784705de6854da459cc0e1bc07c9b6381cddfc2358af16e028d4b2a811f8367f9b000c8330ea2a148dd098170e51211172f3b82827b1b936f82408db1dea6e5474262de66c83ba648cee26745125';

const headers = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${TOKEN}`,
};

async function post(path, data) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ data }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`POST ${path} failed (${res.status}): ${text}`);
  }
  return (await res.json()).data;
}

async function getAll(path) {
  const res = await fetch(`${BASE_URL}${path}?pagination[pageSize]=100`, { headers });
  if (!res.ok) throw new Error(`GET ${path} failed (${res.status})`);
  return (await res.json()).data ?? [];
}

async function main() {
  console.log('🌱 Starting seed...');

  // ── War Conflict ──────────────────────────────────────────────────────────
  console.log('\n📌 Creating war conflict...');
  const conflict = await post('/war-conflicts', {
    name: 'Russo-Ukrainian War',
    slug: 'russo-ukrainian-war',
    description:
      'Full-scale Russian invasion of Ukraine that began on 24 February 2022.',
    startDate: '2022-02-24',
  });
  const conflictId = conflict.documentId;
  console.log(`  ✓ Conflict: ${conflict.name} (${conflictId})`);

  // ── Countries ─────────────────────────────────────────────────────────────
  console.log('\n🌍 Creating countries...');
  const ukraine = await post('/countries', {
    name: 'Ukraine',
    slug: 'ukraine',
    code: 'UA',
  });
  const russia = await post('/countries', {
    name: 'Russia',
    slug: 'russia',
    code: 'RU',
  });
  console.log(`  ✓ Ukraine (${ukraine.documentId}), Russia (${russia.documentId})`);

  // ── Regions ───────────────────────────────────────────────────────────────
  console.log('\n📍 Creating regions...');
  const regionData = [
    { name: 'Kharkiv Oblast', slug: 'kharkiv-oblast', country: ukraine.documentId },
    { name: 'Kherson Oblast', slug: 'kherson-oblast', country: ukraine.documentId },
    { name: 'Zaporizhzhia Oblast', slug: 'zaporizhzhia-oblast', country: ukraine.documentId },
    { name: 'Donetsk Oblast', slug: 'donetsk-oblast', country: ukraine.documentId },
    { name: 'Luhansk Oblast', slug: 'luhansk-oblast', country: ukraine.documentId },
    { name: 'Mykolaiv Oblast', slug: 'mykolaiv-oblast', country: ukraine.documentId },
  ];
  const regions = {};
  for (const r of regionData) {
    const created = await post('/regions', r);
    regions[r.slug] = created.documentId;
    console.log(`  ✓ ${r.name}`);
  }

  // ── Equipment Types ───────────────────────────────────────────────────────
  console.log('\n🔧 Creating equipment types...');
  const typeData = [
    { name: 'Main Battle Tank', slug: 'main-battle-tank' },
    { name: 'Infantry Fighting Vehicle', slug: 'infantry-fighting-vehicle' },
    { name: 'Armoured Personnel Carrier', slug: 'armoured-personnel-carrier' },
    { name: 'Self-Propelled Artillery', slug: 'self-propelled-artillery' },
    { name: 'Multiple Rocket Launcher', slug: 'multiple-rocket-launcher' },
    { name: 'Helicopter', slug: 'helicopter' },
    { name: 'Anti-Aircraft System', slug: 'anti-aircraft-system' },
    { name: 'Logistics Vehicle', slug: 'logistics-vehicle' },
  ];
  const types = {};
  for (const t of typeData) {
    const created = await post('/equipment-types', t);
    types[t.slug] = created.documentId;
    console.log(`  ✓ ${t.name}`);
  }

  // ── Equipment ─────────────────────────────────────────────────────────────
  console.log('\n⚙️  Creating equipment...');
  const equipmentData = [
    { name: 'T-72B3', slug: 't-72b3', originCountry: russia.documentId, type: types['main-battle-tank'] },
    { name: 'T-80BVM', slug: 't-80bvm', originCountry: russia.documentId, type: types['main-battle-tank'] },
    { name: 'T-90M', slug: 't-90m', originCountry: russia.documentId, type: types['main-battle-tank'] },
    { name: 'BMP-2', slug: 'bmp-2', originCountry: russia.documentId, type: types['infantry-fighting-vehicle'] },
    { name: 'BTR-82A', slug: 'btr-82a', originCountry: russia.documentId, type: types['armoured-personnel-carrier'] },
    { name: 'Msta-S', slug: 'msta-s', originCountry: russia.documentId, type: types['self-propelled-artillery'] },
    { name: 'BM-21 Grad', slug: 'bm-21-grad', originCountry: russia.documentId, type: types['multiple-rocket-launcher'] },
    { name: 'Ka-52', slug: 'ka-52', originCountry: russia.documentId, type: types['helicopter'] },
    { name: 'Tor-M2', slug: 'tor-m2', originCountry: russia.documentId, type: types['anti-aircraft-system'] },
    { name: 'Ural-4320', slug: 'ural-4320', originCountry: russia.documentId, type: types['logistics-vehicle'] },
  ];
  const equipment = {};
  for (const e of equipmentData) {
    const created = await post('/equipments', e);
    equipment[e.slug] = created.documentId;
    console.log(`  ✓ ${e.name}`);
  }

  // ── Statuses ──────────────────────────────────────────────────────────────
  console.log('\n🏷️  Creating statuses...');
  const statusData = [
    { name: 'Destroyed', slug: 'destroyed' },
    { name: 'Damaged', slug: 'damaged' },
    { name: 'Captured', slug: 'captured' },
    { name: 'Abandoned', slug: 'abandoned' },
  ];
  const statuses = {};
  for (const s of statusData) {
    const created = await post('/statuses', s);
    statuses[s.slug] = created.documentId;
    console.log(`  ✓ ${s.name}`);
  }

  // ── Destroyed By ──────────────────────────────────────────────────────────
  console.log('\n💥 Creating destroyed-by entries...');
  const ukrainianForces = await post('/destroyed-bies', {
    name: 'Ukrainian Armed Forces',
    slug: 'ukrainian-armed-forces',
  });
  console.log(`  ✓ Ukrainian Armed Forces`);

  // ── Destroyed Equipment (with lat/lng in Ukraine) ────────────────────────
  console.log('\n🗺️  Creating destroyed equipment records...');

  const losses = [
    // Kharkiv region
    { lat: 50.001, lng: 36.231, eq: 't-72b3', status: 'destroyed', region: 'kharkiv-oblast', date: '2022-03-05' },
    { lat: 49.812, lng: 36.145, eq: 't-80bvm', status: 'captured', region: 'kharkiv-oblast', date: '2022-03-12' },
    { lat: 49.950, lng: 36.500, eq: 'bmp-2', status: 'destroyed', region: 'kharkiv-oblast', date: '2022-04-02' },
    { lat: 50.100, lng: 36.800, eq: 'btr-82a', status: 'abandoned', region: 'kharkiv-oblast', date: '2022-04-20' },
    { lat: 49.740, lng: 36.320, eq: 'ural-4320', status: 'destroyed', region: 'kharkiv-oblast', date: '2022-05-01' },
    // Donetsk region
    { lat: 47.995, lng: 37.803, eq: 't-72b3', status: 'destroyed', region: 'donetsk-oblast', date: '2022-05-15' },
    { lat: 48.100, lng: 37.550, eq: 'msta-s', status: 'destroyed', region: 'donetsk-oblast', date: '2022-06-01' },
    { lat: 47.850, lng: 38.100, eq: 'bmp-2', status: 'damaged', region: 'donetsk-oblast', date: '2022-06-20' },
    { lat: 48.300, lng: 37.200, eq: 't-90m', status: 'captured', region: 'donetsk-oblast', date: '2022-07-10' },
    { lat: 47.700, lng: 37.900, eq: 'bm-21-grad', status: 'destroyed', region: 'donetsk-oblast', date: '2022-07-25' },
    // Kherson region
    { lat: 46.635, lng: 32.616, eq: 't-72b3', status: 'captured', region: 'kherson-oblast', date: '2022-11-10' },
    { lat: 46.800, lng: 32.200, eq: 'btr-82a', status: 'destroyed', region: 'kherson-oblast', date: '2022-11-15' },
    { lat: 47.000, lng: 33.400, eq: 'ural-4320', status: 'abandoned', region: 'kherson-oblast', date: '2022-11-12' },
    // Zaporizhzhia region
    { lat: 47.839, lng: 35.139, eq: 't-80bvm', status: 'destroyed', region: 'zaporizhzhia-oblast', date: '2022-08-20' },
    { lat: 47.500, lng: 35.600, eq: 'bmp-2', status: 'damaged', region: 'zaporizhzhia-oblast', date: '2022-09-05' },
    { lat: 47.200, lng: 35.900, eq: 'tor-m2', status: 'destroyed', region: 'zaporizhzhia-oblast', date: '2023-01-15' },
    // Luhansk region
    { lat: 48.574, lng: 39.307, eq: 't-72b3', status: 'destroyed', region: 'luhansk-oblast', date: '2022-03-20' },
    { lat: 48.900, lng: 38.800, eq: 'ka-52', status: 'destroyed', region: 'luhansk-oblast', date: '2022-04-15' },
    // Mykolaiv region
    { lat: 46.975, lng: 31.994, eq: 't-72b3', status: 'captured', region: 'mykolaiv-oblast', date: '2022-03-28' },
    { lat: 47.100, lng: 32.300, eq: 'msta-s', status: 'destroyed', region: 'mykolaiv-oblast', date: '2022-04-08' },
  ];

  for (let i = 0; i < losses.length; i++) {
    const l = losses[i];
    await post('/destroyed-equipments', {
      sourceRecordId: 1000 + i,
      reportId: 2000 + i,
      reportedAt: l.date,
      eventDate: l.date,
      equipmentLabel: equipmentData.find((e) => e.slug === l.eq)?.name ?? 'Unknown',
      equipment: equipment[l.eq],
      quantity: 1,
      latitude: l.lat,
      longitude: l.lng,
      country: ukraine.documentId,
      region: regions[l.region],
      status: statuses[l.status],
      warConflict: conflictId,
      destroyedBy: [ukrainianForces.documentId],
    });
    process.stdout.write(`  ✓ Equipment ${i + 1}/${losses.length}\r`);
  }
  console.log(`\n  ✓ Created ${losses.length} destroyed equipment records`);

  // ── Conflict Events ───────────────────────────────────────────────────────
  console.log('\n📅 Creating conflict events...');
  const events = [
    {
      name: 'Battle of Kyiv',
      description: 'Russian forces attempted to capture Kyiv in the opening days of the full-scale invasion. Ukrainian forces successfully repelled the assault.',
      date: '2022-02-25',
      latitude: 50.450,
      longitude: 30.523,
      category: 'battle',
      warConflict: conflictId,
    },
    {
      name: 'Battle of Mariupol',
      description: 'A prolonged siege of the port city of Mariupol. The Azovstal steel plant became the last stronghold of Ukrainian defenders.',
      date: '2022-03-01',
      latitude: 47.095,
      longitude: 37.543,
      category: 'battle',
      warConflict: conflictId,
    },
    {
      name: 'Sinking of Moskva',
      description: 'The flagship of Russia\'s Black Sea Fleet was hit by Ukrainian Neptune anti-ship missiles and sank in the Black Sea.',
      date: '2022-04-13',
      latitude: 45.800,
      longitude: 31.900,
      category: 'naval',
      warConflict: conflictId,
    },
    {
      name: 'Kharkiv Counteroffensive',
      description: 'Ukrainian forces launched a major counteroffensive in Kharkiv Oblast, recapturing significant territory including Izium.',
      date: '2022-09-06',
      latitude: 49.812,
      longitude: 36.145,
      category: 'ground',
      warConflict: conflictId,
    },
    {
      name: 'Liberation of Kherson',
      description: 'Ukrainian forces liberated the city of Kherson following a successful counteroffensive in southern Ukraine.',
      date: '2022-11-11',
      latitude: 46.635,
      longitude: 32.616,
      category: 'ground',
      warConflict: conflictId,
    },
    {
      name: 'Missile Strike on Zaporizhzhia',
      description: 'Russian forces conducted multiple missile strikes targeting civilian infrastructure in Zaporizhzhia city.',
      date: '2022-10-09',
      latitude: 47.839,
      longitude: 35.139,
      category: 'airstrike',
      warConflict: conflictId,
    },
    {
      name: 'Battle of Bakhmut',
      description: 'One of the longest and most intense battles of the war, centered on the city of Bakhmut in Donetsk Oblast.',
      date: '2022-08-01',
      latitude: 48.598,
      longitude: 38.001,
      category: 'battle',
      warConflict: conflictId,
    },
    {
      name: 'Kahovka Dam Explosion',
      description: 'The Nova Kakhovka dam was destroyed, causing massive flooding downstream along the Dnipro river.',
      date: '2023-06-06',
      latitude: 46.758,
      longitude: 33.370,
      category: 'other',
      warConflict: conflictId,
    },
  ];

  for (const event of events) {
    await post('/conflict-events', event);
    console.log(`  ✓ ${event.name}`);
  }

  console.log('\n✅ Seed complete!');
  console.log(`\nSummary:`);
  console.log(`  • 1 war conflict`);
  console.log(`  • 2 countries, ${regionData.length} regions`);
  console.log(`  • ${typeData.length} equipment types, ${equipmentData.length} equipment models`);
  console.log(`  • ${losses.length} destroyed equipment records`);
  console.log(`  • ${events.length} conflict events`);
}

main().catch((err) => {
  console.error('\n❌ Seed failed:', err.message);
  process.exit(1);
});
