import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { TechCard } from './tech-cards';
import Image from 'next/image';

export async function TechCard({ damaged, destroyed, name, total, trophy, icon }: TechCard) {
  return (
    <Card className="max-lg:w-full lg:min-w-52">
      <CardHeader className="relative">
        <div className="relative w-full h-20">
          <Image fill={true} src={icon} alt="40" />
        </div>
        <CardTitle className="text-xl text-primary font-bold">{name}</CardTitle>
        <CardDescription className="text-xl text-primary-foreground font-bold">{total} Потеряно</CardDescription>
      </CardHeader>
      <CardContent>
        <div className=" text-gray-400">{destroyed} - уничтожено</div>
        <div className=" text-gray-400">{trophy} - трофеев</div>
        <div className=" text-gray-400">{damaged} - повреждено</div>
      </CardContent>
    </Card>
  );
}
