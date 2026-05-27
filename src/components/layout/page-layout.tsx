import { Footer } from '@/components/layout/footer';

export function PageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1 flex-col">
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
}
