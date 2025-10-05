import { lazy, Suspense } from 'react';
import { ComponentLoader } from '@/components/ui/PageLoader';

// Lazy load the PerformanceTrends component
const PerformanceTrends = lazy(() => import('./PerformanceTrends').then(module => ({ default: module.PerformanceTrends })));

export function LazyPerformanceTrends() {
  return (
    <Suspense fallback={<ComponentLoader message="Loading performance trends..." />}>
      <PerformanceTrends />
    </Suspense>
  );
}
