import { lazy, Suspense } from 'react';
import { ComponentLoader } from '@/components/ui/PageLoader';

// Lazy load the DashboardStats component
const DashboardStats = lazy(() => import('./DashboardStats').then(module => ({ default: module.DashboardStats })));

export function LazyDashboardStats() {
  return (
    <Suspense fallback={<ComponentLoader message="Loading dashboard stats..." />}>
      <DashboardStats />
    </Suspense>
  );
}
