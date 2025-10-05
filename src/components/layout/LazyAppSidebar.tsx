import { lazy, Suspense } from 'react';
import { ComponentLoader } from '@/components/ui/PageLoader';

// Lazy load the AppSidebar component
const AppSidebar = lazy(() => import('./AppSidebar').then(module => ({ default: module.AppSidebar })));

interface LazyAppSidebarProps {
  onToggle?: () => void;
}

export function LazyAppSidebar({ onToggle }: LazyAppSidebarProps) {
  return (
    <Suspense fallback={<ComponentLoader message="Loading sidebar..." />}>
      <AppSidebar onToggle={onToggle} />
    </Suspense>
  );
}
