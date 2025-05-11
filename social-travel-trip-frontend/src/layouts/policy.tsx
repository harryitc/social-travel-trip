import Footer from '@/components/common/footer';
import { ReactNode } from 'react';
import dynamic from 'next/dynamic';
import CustomBackTop from '@/components/ui/back-top';
import Header from '@/components/common/header/header';

// const Header = dynamic(() => import('@/components/common/header/header'), {
//   ssr: false,
// });
export default function PolicyLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="fixed top-0 left-0 right-0 min-h-14 z-50 flex flex-col justify-center backdrop-blur-lg shadow-lg">
        <Header />
      </div>
      <main className="pt-14">
        <div className="container mx-auto sm:max-w-[540px] md:max-w-[1140px] px-4">{children}</div>
      </main>
      <Footer />
      <CustomBackTop />
    </>
  );
}
