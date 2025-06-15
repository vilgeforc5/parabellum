import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface ITechItemProps {
  total: number;
  destroyed: number;
  trophy: number;
  damaged: number;
  name: string;
}

export async function TechItem({ damaged, destroyed, name, total, trophy }: ITechItemProps) {
  return (
    <Card className="max-lg:w-full lg:min-w-52">
      <CardHeader>
        <CardTitle className="text-xl text-primary font-bold">{name}</CardTitle>
        <CardDescription className="text-xl text-primary-foreground font-bold">
          {total} Потеряно
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className=" text-gray-400">
          {destroyed} - уничтожено
        </div>
        <div className=" text-gray-400">{trophy} - трофеев</div>
        <div className=" text-gray-400">
          {damaged} - повреждено
        </div>
      </CardContent>
    </Card>
  );
}
