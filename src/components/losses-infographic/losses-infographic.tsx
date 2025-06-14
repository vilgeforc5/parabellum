import React, { ComponentProps } from 'react';
import { LossCountGraph } from '@/components/losses-infographic/loss-count-graph';
import { LocationGraph } from '@/components/losses-infographic/location-graph';
import { TechItem } from '@/components/losses-infographic/tech-item';
import { getTranslations } from 'next-intl/server';

const tech: Array<ComponentProps<typeof TechItem>> = [
  {
    trophy: 10,
    destroyed: 50,
    total: 60,
    name: 'ББМ',
    damaged: 20,
  },
  {
    trophy: 10,
    destroyed: 50,
    total: 60,
    name: 'ББМ',
    damaged: 20,
  },
  {
    trophy: 10,
    destroyed: 50,
    total: 60,
    name: 'ББМ',
    damaged: 20,
  },
  {
    trophy: 10,
    destroyed: 50,
    total: 60,
    name: 'ББМ',
    damaged: 20,
  },
  {
    trophy: 10,
    destroyed: 50,
    total: 60,
    name: 'ББМ',
    damaged: 20,
  },
  {
    trophy: 10,
    destroyed: 50,
    total: 60,
    name: 'ББМ',
    damaged: 20,
  },
];

const lossData: ComponentProps<typeof LossCountGraph> = {
  data: [
    { month: '01-10', value: 186 },
    { month: '', value: 305 },
    { month: '', value: 237 },
    { month: '', value: 73 },
    { month: '', value: 209 },
    { month: '01-15', value: 214 },
    { month: '', value: 214 },
    { month: '', value: 200 },
    { month: '', value: 250 },
    { month: '01-20', value: 214 },
  ],
  trend: -5,
};

const locationData: ComponentProps<typeof LocationGraph> = {
  data: [
    {
      region: 'DPR',
      value: 250,
      label: 'ДНР',
    },
    {
      region: 'LPR',
      value: 500,
      label: 'ЛНР',
    },
    {
      region: 'KHR',
      value: 750,
      label: 'Херсонская область',
    },
    {
      region: 'ZAP',
      value: 250,
      label: 'Запорожская область',
    },
  ],
};

const timePeriod = '10.03.25 - 16.03.25';

export async function LossesInfographic() {
  const t = await getTranslations('BasePage');

  return (
    <div className="max-lg:px-3">
      <div className="w-full text-white p-6 lg:p-8 rounded-lg bg-card">
        <div className="mb-8">
          <h2 className="text-4xl font-bold mb-2">{t('loss-infographic.title')}</h2>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-primary"></div>
            <span className="text-primary font-semibold">{timePeriod}</span>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <LossCountGraph {...lossData} />
          <LocationGraph {...locationData} />
          <div className="mt-8 col-span-full">
            <h2 className="text-2xl font-bold mb-4">{t('loss-infographic.tech-section.title')}</h2>
            <div className="flex flex-wrap gap-8">
              {tech.map((item) => (
                <TechItem {...item} key={item.name} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
