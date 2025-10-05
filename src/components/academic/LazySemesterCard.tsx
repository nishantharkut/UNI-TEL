import { lazy, Suspense } from 'react';
import { ComponentLoader } from '@/components/ui/PageLoader';

// Lazy load the SemesterCard component
const SemesterCard = lazy(() => import('./SemesterCard').then(module => ({ default: module.SemesterCard })));

interface LazySemesterCardProps {
  semester: any;
}

export function LazySemesterCard({ semester }: LazySemesterCardProps) {
  return (
    <Suspense fallback={<ComponentLoader message="Loading semester..." />}>
      <SemesterCard semester={semester} />
    </Suspense>
  );
}
