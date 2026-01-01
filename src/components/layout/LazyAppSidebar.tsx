import { lazy, Suspense } from 'react';
import { ComponentLoader } from '@/components/ui/PageLoader';

// Lazy load the AppSidebar component
const AppSidebar = lazy(() => import('./AppSidebar').then(module => ({ default: module.AppSidebar })));

interface LazyAppSidebarProps {
  onToggle?: () => void;
  mobileMenuOpen?: boolean;
}

export function LazyAppSidebar({ onToggle, mobileMenuOpen }: LazyAppSidebarProps) {
  return (
    <Suspense fallback={<ComponentLoader message="Loading sidebar..." size="sm" variant="minimal" />}>
      <AppSidebar onToggle={onToggle} mobileMenuOpen={mobileMenuOpen} />
    </Suspense>
  );
}
