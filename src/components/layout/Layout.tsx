
import { ReactNode, useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { LazyAppSidebar } from './LazyAppSidebar';
import { LazyAppHeader } from './LazyAppHeader';
import AuthPage from '@/components/auth/AuthPage';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuOpen(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 border-3 border-primary/20 border-t-primary mx-auto"></div>
            <div className="absolute inset-0 rounded-full h-12 w-12 border-3 border-transparent border-t-academic-primary/40 animate-spin [animation-direction:reverse] [animation-duration:1s]"></div>
          </div>
          <div className="space-y-2">
            <p className="text-lg font-medium text-foreground">Loading UNI-TEL</p>
            <p className="text-sm text-muted-foreground">Connecting to your academic hub...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10">
      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
      
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <LazyAppSidebar onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      </div>
      
      {/* Mobile Sidebar */}
      <div className={`lg:hidden fixed inset-y-0 left-0 z-50 w-80 transform transition-transform duration-300 ${
        mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <LazyAppSidebar onToggle={handleMobileMenuClose} />
      </div>
      
      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${
        !sidebarCollapsed ? 'lg:ml-72' : 'lg:ml-24'
      } ml-0`}>
        <LazyAppHeader 
          user={{
            full_name: user.user_metadata?.full_name || user.email || '',
            email: user.email || '',
            avatar_url: user.user_metadata?.avatar_url
          }}
          onSignOut={handleSignOut}
          onMobileMenuToggle={handleMobileMenuToggle}
          mobileMenuOpen={mobileMenuOpen}
        />
        <main className="flex-1 overflow-auto bg-background/50">
          <div className="min-h-full p-3 sm:p-4 lg:p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
