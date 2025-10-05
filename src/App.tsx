
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import Layout from '@/components/layout/Layout';
import Index from '@/pages/Index';
import Semesters from '@/pages/Semesters';
import Attendance from '@/pages/Attendance';
import Marks from '@/pages/Marks';
import Analytics from '@/pages/Analytics';
import Settings from '@/pages/Settings';
import ComingSoon from '@/pages/ComingSoon';
import NotFound from '@/pages/NotFound';
import RedirectToComingSoon from '@/components/RedirectToComingSoon';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/semesters" element={<RedirectToComingSoon />} />
              <Route path="/attendance" element={<RedirectToComingSoon />} />
              <Route path="/marks" element={<Marks />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/coming-soon" element={<ComingSoon />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
