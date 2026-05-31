import { EquitySidebar } from '@/components/equity/EquitySidebar';

export default function EquityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      <EquitySidebar />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
