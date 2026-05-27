import { Footer } from '@/components/layout/footer';
import { Breadcrumb } from '@/components/breadcrumb';

export function PageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1 flex-col">
      <Breadcrumb />
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
}
