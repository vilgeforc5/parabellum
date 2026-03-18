export const COUNTRY_SEED = [
  { code: 'UNK', name: 'Unknown', slug: 'unknown' },
  { code: 'SU', name: 'Soviet Union', slug: 'soviet-union' },
  { code: 'UA', name: 'Ukraine', slug: 'ukraine' },
  { code: 'RU', name: 'Russia', slug: 'russia' },
  { code: 'US', name: 'United States', slug: 'united-states' },
  { code: 'DE', name: 'Germany', slug: 'germany' },
  { code: 'GB', name: 'United Kingdom', slug: 'united-kingdom' },
  { code: 'FR', name: 'France', slug: 'france' },
  { code: 'TR', name: 'Turkey', slug: 'turkey' },
  { code: 'PL', name: 'Poland', slug: 'poland' },
  { code: 'CZ', name: 'Czech Republic', slug: 'czech-republic' },
  { code: 'SE', name: 'Sweden', slug: 'sweden' },
  { code: 'NL', name: 'Netherlands', slug: 'netherlands' },
];

export const STATUS_SEED = [
  { name: 'Уничтожен', slug: 'destroyed' },
  { name: 'Поврежден', slug: 'damaged' },
  { name: 'Трофей', slug: 'captured' },
  { name: 'Брошен', slug: 'abandoned' },
];

export const WAR_CONFLICT_SEED = [
  {
    name: 'Russian Invasion of Ukraine',
    slug: 'russian-invasion-of-ukraine',
    description:
      'Full-scale war launched in February 2022, used here as the default conflict for seeded equipment losses.',
    startDate: '2022-02-24',
  },
  {
    name: 'Sample Border Escalation',
    slug: 'sample-border-escalation',
    description:
      'Extra sample conflict to validate relations, filtering, and admin editing flows.',
    startDate: '2021-04-01',
    endDate: '2021-05-15',
  },
];

export const EQUIPMENT_TYPE_SEED = [
  { name: 'Unknown', slug: 'unknown' },
  { name: 'Tank', slug: 'tank' },
  { name: 'Infantry Fighting Vehicle', slug: 'infantry-fighting-vehicle' },
  { name: 'Armored Personnel Carrier', slug: 'armored-personnel-carrier' },
  { name: 'Artillery', slug: 'artillery' },
  { name: 'Multiple Launch Rocket System', slug: 'multiple-launch-rocket-system' },
  { name: 'Air Defense', slug: 'air-defense' },
  { name: 'Aircraft', slug: 'aircraft' },
  { name: 'Helicopter', slug: 'helicopter' },
  { name: 'UAV', slug: 'uav' },
  { name: 'Radar', slug: 'radar' },
  { name: 'Truck', slug: 'truck' },
  { name: 'Utility Vehicle', slug: 'utility-vehicle' },
  { name: 'Engineering Vehicle', slug: 'engineering-vehicle' },
  { name: 'Electronic Warfare', slug: 'electronic-warfare' },
  { name: 'Boat', slug: 'boat' },
  { name: 'Other', slug: 'other' },
];

export const DEFAULT_WAR_CONFLICT_SLUG = 'russian-invasion-of-ukraine';
