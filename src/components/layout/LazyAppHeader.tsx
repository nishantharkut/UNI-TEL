import { lazy, Suspense } from 'react';
import { ComponentLoader } from '@/components/ui/PageLoader';

// Lazy load the AppHeader component
const AppHeader = lazy(() => import('./AppHeader').then(module => ({ default: module.AppHeader })));

interface LazyAppHeaderProps {
  user: {
    full_name: string;
    email: string;
    avatar_url?: string;
  };
  onSignOut: () => void;
  onMobileMenuToggle?: () => void;
  mobileMenuOpen?: boolean;
}

export function LazyAppHeader({ user, onSignOut, onMobileMenuToggle, mobileMenuOpen }: LazyAppHeaderProps) {
  return (
    <Suspense fallback={<ComponentLoader message="Loading header..." />}>
      <AppHeader 
        user={user} 
        onSignOut={onSignOut} 
        onMobileMenuToggle={onMobileMenuToggle}
        mobileMenuOpen={mobileMenuOpen}
      />
    </Suspense>
  );
}
