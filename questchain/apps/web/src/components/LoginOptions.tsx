'use client';

import React from 'react';
import { useCustomWallet } from '@/contexts/CustomWallet';

interface LoginOptionsProps {
  onLogin?: (provider: 'google' | 'apple' | 'email') => void;
}

export const LoginOptions: React.FC<LoginOptionsProps> = ({ onLogin }) => {
  const { login, isConnecting } = useCustomWallet();

  const handleLogin = async (provider: 'google' | 'apple' | 'email') => {
    if (provider === 'google') {
      try {
        await login();
      } catch (error) {
        console.error('Login failed:', error);
      }
    } else if (onLogin) {
      onLogin(provider);
    } else {
      console.log(`Login with ${provider}`);
    }
  };

  return (
    <div className="pixel-container w-full max-w-xs animate-[fadeIn_0.3s_ease-out]">
      <p className="text-center mb-3 font-pixel text-primary">LOGIN WITH</p>
      <div className="flex justify-center gap-4">
        <button
          onClick={() => handleLogin('google')}
          className="bg-white text-black px-4 py-2 rounded-md hover:bg-gray-200 transition-colors font-pixel flex items-center"
          disabled={isConnecting}
        >
          {isConnecting ? (
            'Connecting...'
          ) : (
            <>
              <span className="text-red-500 mr-1">G</span>oogle
            </>
          )}
        </button>
        <button
          onClick={() => handleLogin('apple')}
          className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors font-pixel"
          disabled={isConnecting}
        >
          Apple
        </button>
        <button
          onClick={() => handleLogin('email')}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors font-pixel"
          disabled={isConnecting}
        >
          Email
        </button>
      </div>
      <div className="text-center text-gray-400 text-xs mt-4">
        <p>No wallet or seed phrase needed!</p>
        <p>We use zkLogin for a seamless Web3 experience.</p>
      </div>
    </div>
  );
};

export default LoginOptions;
