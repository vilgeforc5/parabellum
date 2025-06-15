import { ReactNode } from 'react';

export function SectionWrapper({ children }: { children?: ReactNode }) {
  return (
    <div className="max-lg:px-3">
      <div className="w-full text-white p-6 lg:p-8 rounded-lg bg-card">{children}</div>
    </div>
  );
}
