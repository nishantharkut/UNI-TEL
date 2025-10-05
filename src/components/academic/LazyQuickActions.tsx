import { lazy, Suspense } from 'react';
import { ComponentLoader } from '@/components/ui/PageLoader';

// Lazy load the QuickActions component
const QuickActions = lazy(() => import('./QuickActions').then(module => ({ default: module.QuickActions })));

export function LazyQuickActions() {
  return (
    <Suspense fallback={<ComponentLoader message="Loading quick actions..." />}>
      <QuickActions />
    </Suspense>
  );
}
