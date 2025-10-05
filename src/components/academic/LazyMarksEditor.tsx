import { lazy, Suspense } from 'react';
import { ComponentLoader } from '@/components/ui/PageLoader';

// Lazy load the heavy MarksEditor component
const MarksEditor = lazy(() => import('./MarksEditor').then(module => ({ default: module.MarksEditor })));

interface LazyMarksEditorProps {
  semesterId?: string;
}

export function LazyMarksEditor({ semesterId }: LazyMarksEditorProps) {
  return (
    <Suspense fallback={<ComponentLoader message="Loading marks editor..." />}>
      <MarksEditor semesterId={semesterId} />
    </Suspense>
  );
}
