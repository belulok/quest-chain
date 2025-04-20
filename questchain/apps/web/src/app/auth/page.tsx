'use client';

import { useAuthCallback } from '@mysten/enoki/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import LoadingScreen from '@/components/LoadingScreen';

export default function AuthCallbackPage() {
  const { handled, state } = useAuthCallback();
  const router = useRouter();
  const [progress, setProgress] = useState(10);
  const [timeoutError, setTimeoutError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Simulate progress to give user feedback
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 10;
      });
    }, 500);

    // Set a timeout to detect if the process is taking too long
    const timeout = setTimeout(() => {
      if (!handled) {
        setTimeoutError(true);
      }
    }, 10000); // 10 seconds timeout

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [handled]);

  // Check for errors in the authentication process
  useEffect(() => {
    if (handled) {
      if (!state) {
        // If handled but no state, there was an error
        setError(new Error('Authentication failed. No session data received.'));
        console.error('Authentication error: No session data');
      } else {
        setProgress(100);
        // Redirect to world map after successful authentication
        setTimeout(() => {
          router.push('/world-map');
        }, 500); // Small delay to show 100% progress
      }
    }
  }, [handled, state, router]);

  // Handle manual retry
  const handleRetry = () => {
    window.location.href = '/';
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <LoadingScreen progress={progress} />
      <div className="text-center mt-4">
        <h1 className="text-xl font-pixel text-primary">Authenticating...</h1>
        <p className="text-gray-400">Please wait while we complete the login process</p>

        {error && (
          <div className="mt-4 text-red-500">
            <p>Authentication failed</p>
            <p className="text-sm">{error.message || 'Unknown error occurred'}</p>
            <button
              onClick={handleRetry}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {timeoutError && !error && !handled && (
          <div className="mt-4 text-yellow-500">
            <p>Authentication is taking longer than expected</p>
            <p className="text-sm">This could be due to network issues or authentication service delays</p>
            <button
              onClick={handleRetry}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
