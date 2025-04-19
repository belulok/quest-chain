'use client';

import { useAuthCallback } from '@mysten/enoki/react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LoadingScreen from '@/components/LoadingScreen';

export default function AuthCallbackPage() {
  const { handled, error } = useAuthCallback();
  const router = useRouter();

  useEffect(() => {
    if (handled) {
      // Redirect to world map after successful authentication
      router.push('/world-map');
    }
    
    if (error) {
      console.error('Authentication error:', error);
      // Redirect to home page on error
      router.push('/');
    }
  }, [handled, error, router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <LoadingScreen progress={50} />
      <div className="text-center mt-4">
        <h1 className="text-xl font-pixel text-primary">Authenticating...</h1>
        <p className="text-gray-400">Please wait while we complete the login process</p>
        {error && (
          <div className="mt-4 text-red-500">
            <p>Authentication failed</p>
            <p className="text-sm">{error.message}</p>
          </div>
        )}
      </div>
    </div>
  );
}
