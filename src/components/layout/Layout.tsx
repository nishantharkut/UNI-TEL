
import { ReactNode, useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { AppSidebar } from './AppSidebar';
import { AppHeader } from './AppHeader';
import AuthPage from '@/components/auth/AuthPage';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10 flex w-full">
      <AppSidebar onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${sidebarCollapsed ? 'ml-24' : 'ml-72'}`}>
        <AppHeader 
          user={{
            full_name: user.user_metadata?.full_name || user.email || '',
            email: user.email || '',
            avatar_url: user.user_metadata?.avatar_url
          }}
          onSignOut={handleSignOut}
        />
        <main className="flex-1 overflow-auto bg-background/50">
          <div className="min-h-full p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
