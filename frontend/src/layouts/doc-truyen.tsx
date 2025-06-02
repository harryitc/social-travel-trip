import CustomBackTop from '@/components/ui/back-top';
import { ReactNode } from 'react';

export default function DocTruyenLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <main>{children}</main>
      <CustomBackTop />
    </>
  );
}
