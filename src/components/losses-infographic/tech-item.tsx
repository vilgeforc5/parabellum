import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getTranslations } from 'next-intl/server';

interface ITechItemProps {
  total: number;
  destroyed: number;
  trophy: number;
  damaged: number;
  name: string;
}

export async function TechItem({ damaged, destroyed, name, total, trophy }: ITechItemProps) {
  const t = await getTranslations('BasePage');

  return (
    <Card className="max-lg:w-full lg:min-w-52">
      <CardHeader>
        <CardTitle className="text-xl text-primary font-bold">{name}</CardTitle>
        <CardDescription className="text-xl text-primary-foreground font-bold">
          {t('loss-infographic.tech-section.status.total', { value: total })}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className=" text-gray-400">
          {t('loss-infographic.tech-section.status.destroyed', { value: destroyed })}
        </div>
        <div className=" text-gray-400">{t('loss-infographic.tech-section.status.trophy', { value: trophy })}</div>
        <div className=" text-gray-400">
          {t('loss-infographic.tech-section.status.damaged', { value: damaged })}
        </div>
      </CardContent>
    </Card>
  );
}
