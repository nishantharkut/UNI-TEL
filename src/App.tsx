
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Suspense, lazy } from 'react';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { PageLoader } from '@/components/ui/PageLoader';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import Layout from '@/components/layout/Layout';

// Lazy load all pages
const Index = lazy(() => import('@/pages/Index'));
const Semesters = lazy(() => import('@/pages/Semesters'));
const Attendance = lazy(() => import('@/pages/Attendance'));
const Marks = lazy(() => import('@/pages/Marks'));
const Analytics = lazy(() => import('@/pages/Analytics'));
const Settings = lazy(() => import('@/pages/Settings'));
const ComingSoon = lazy(() => import('@/pages/ComingSoon'));
const NotFound = lazy(() => import('@/pages/NotFound'));

const queryClient = new QueryClient();

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <BrowserRouter
            future={{
              v7_startTransition: true,
              v7_relativeSplatPath: true
            }}
          >
            <Layout>
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/semesters" element={<Semesters />} />
                  <Route path="/attendance" element={<Attendance />} />
                  <Route path="/marks" element={<Marks />} />
                  <Route path="/analytics" element={<Analytics />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/coming-soon" element={<ComingSoon />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </Layout>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
