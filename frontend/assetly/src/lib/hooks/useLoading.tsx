import React, { createContext, useState, useContext, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

// Create loading context with proper TypeScript typing
interface LoadingContextType {
  isLoading: boolean;
  startLoading: () => void;
  stopLoading: () => void;
}

// Create loading context
const LoadingContext = createContext<LoadingContextType>({
  isLoading: false,
  startLoading: () => {},
  stopLoading: () => {}
});

// Define props type
interface LoadingProviderProps {
  children: React.ReactNode;
}

// Loading Provider Component
export const LoadingProvider: React.FC<LoadingProviderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Start loading
  const startLoading = useCallback(() => {
    setIsLoading(true);
  }, []);

  // Stop loading
  const stopLoading = useCallback(() => {
    setIsLoading(false);
  }, []);

  // Intercept navigation
  const originalPush = router.push;
  const originalPrefetch = router.prefetch;
  const originalReplace = router.replace;
  const originalRefresh = router.refresh;

  React.useEffect(() => {
    // Override router methods to include loading state
    router.push = (...args) => {
      startLoading();
      try {
        const result = originalPush.apply(router, args);
        
        // If result is a promise, handle it
        if (result && typeof result === 'object' && 'then' in result) {
          (result as Promise<void>).then(
            () => stopLoading(),
            () => stopLoading()
          );
        } else {
          stopLoading();
        }
        
        return result;
      } catch {
        stopLoading();
        throw new Error('Navigation failed');
      }
    };

    router.prefetch = (...args) => {
      startLoading();
      try {
        const result = originalPrefetch.apply(router, args);
        
        if (result && typeof result === 'object' && 'then' in result) {
          (result as Promise<void>).then(
            () => stopLoading(),
            () => stopLoading()
          );
        } else {
          stopLoading();
        }
        
        return result;
      } catch {
        stopLoading();
        throw new Error('Prefetch failed');
      }
    };

    router.replace = (...args) => {
      startLoading();
      try {
        const result = originalReplace.apply(router, args);
        
        if (result && typeof result === 'object' && 'then' in result) {
          (result as Promise<void>).then(
            () => stopLoading(),
            () => stopLoading()
          );
        } else {
          stopLoading();
        }
        
        return result;
      } catch {
        stopLoading();
        throw new Error('Replacement failed');
      }
    };

    router.refresh = (...args) => {
      startLoading();
      try {
        const result = originalRefresh.apply(router, args);
        
        if (result && typeof result === 'object' && 'then' in result) {
          (result as Promise<void>).then(
            () => stopLoading(),
            () => stopLoading()
          );
        } else {
          stopLoading();
        }
        
        return result;
      } catch {
        stopLoading();
        throw new Error('Refresh failed');
      }
    };

    // Cleanup function to restore original methods
    return () => {
      router.push = originalPush;
      router.prefetch = originalPrefetch;
      router.replace = originalReplace;
      router.refresh = originalRefresh;
    };
  }, [originalPrefetch, originalPush, originalRefresh, originalReplace, router, startLoading, stopLoading]);

  // Default loading overlay
  const LoadingOverlay = () => (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center 
      bg-white/50 dark:bg-black/50 backdrop-blur-sm"
    >
      <div className="animate-spin">
        <Loader2 size={48} className="text-primary" />
      </div>
    </div>
  );

  return (
    <LoadingContext.Provider value={{ isLoading, startLoading, stopLoading }}>
      {isLoading && <LoadingOverlay />}
      {children}
    </LoadingContext.Provider>
  );
};

// Custom hook for using loading context
export const useLoading = () => {
  const context = useContext(LoadingContext);
  
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  
  return context;
};