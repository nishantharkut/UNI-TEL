import { Loader2 } from 'lucide-react';

interface PageLoaderProps {
  message?: string;
}

export function PageLoader({ message = "Loading..." }: PageLoaderProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-16">
          <div className="relative mb-6">
            <div className="animate-spin rounded-full h-12 w-12 border-3 border-primary/20 border-t-primary mx-auto"></div>
            <div className="absolute inset-0 rounded-full h-12 w-12 border-3 border-transparent border-t-academic-primary/40 animate-spin [animation-direction:reverse] [animation-duration:1.5s]"></div>
          </div>
          <p className="text-lg font-medium text-muted-foreground">{message}</p>
        </div>
      </div>
    </div>
  );
}

export function ComponentLoader({ message = "Loading component..." }: PageLoaderProps) {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="flex items-center gap-3">
        <Loader2 className="h-5 w-5 animate-spin text-academic-primary" />
        <span className="text-sm text-muted-foreground">{message}</span>
      </div>
    </div>
  );
}
