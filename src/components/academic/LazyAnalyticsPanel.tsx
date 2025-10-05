import { lazy, Suspense } from 'react';
import { ComponentLoader } from '@/components/ui/PageLoader';

// Lazy load the heavy AnalyticsPanel component
const AnalyticsPanel = lazy(() => import('./AnalyticsPanel').then(module => ({ default: module.AnalyticsPanel })));

export function LazyAnalyticsPanel() {
  return (
    <Suspense fallback={<ComponentLoader message="Loading analytics..." />}>
      <AnalyticsPanel />
    </Suspense>
  );
}
