import { lazy, Suspense } from 'react';
import { ComponentLoader } from '@/components/ui/PageLoader';

// Lazy load the ImportExport component
const ImportExport = lazy(() => import('./ImportExport').then(module => ({ default: module.ImportExport })));

export function LazyImportExport() {
  return (
    <Suspense fallback={<ComponentLoader message="Loading import/export..." />}>
      <ImportExport />
    </Suspense>
  );
}
