import { lazy, Suspense } from 'react';
import { ComponentLoader } from '@/components/ui/PageLoader';

// Lazy load the heavy ActiveAttendanceCard component
const ActiveAttendanceCard = lazy(() => import('./ActiveAttendanceCard').then(module => ({ default: module.ActiveAttendanceCard })));

interface LazyActiveAttendanceCardProps {
  records: any[];
}

export function LazyActiveAttendanceCard({ records }: LazyActiveAttendanceCardProps) {
  return (
    <Suspense fallback={<ComponentLoader message="Loading attendance records..." />}>
      <ActiveAttendanceCard records={records} />
    </Suspense>
  );
}
