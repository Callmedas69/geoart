"use client";

import { useAccount, useSignMessage } from 'wagmi';
import { useState, useCallback, useEffect } from 'react';

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  loading: boolean;
  error: string | null;
}

export const useVibeAuth = () => {
  const { address } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    token: null,
    loading: false,
    error: null
  });

  const authenticate = useCallback(async (): Promise<string | null> => {
    if (!address) {
      setAuthState(prev => ({ ...prev, error: 'Wallet not connected' }));
      return null;
    }

    setAuthState(prev => ({ ...prev, loading: true, error: null }));

    try {
      console.log('🔐 Performing authentication flow for address:', address);

      // Request authentication message/challenge from Vibe.Market
      console.log('🚀 Requesting authentication message from Vibe.Market...');
      const messageResponse = await fetch(`/api/vibe-auth-message/${address}`, {
        method: 'GET',
      });

      const messageResult = await messageResponse.json();
      console.log('🔍 Message response:', messageResult);

      if (!messageResult.success || !messageResult.message) {
        throw new Error(`Failed to get authentication message: ${messageResult.error || 'Unknown error'}`);
      }

      // Sign the challenge message
      const message = messageResult.message;
      console.log('🔐 Signing Vibe.Market authentication message:', message);
      const signature = await signMessageAsync({ message });
      console.log('✍️ Message signed:', signature);

      // Verify signature with Vibe.Market to get JWT token
      console.log('🚀 Verifying signature with Vibe.Market auth endpoint...');
      
      const authResponse = await fetch('/api/vibe-auth-verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          address: address,
          signature: signature
        })
      });

      const authResult = await authResponse.json();
      console.log('🔍 Signature verification response:', authResult);

      if (authResult.success && authResult.data?.accessToken) {
        // Success! We have a valid JWT token
        const token = authResult.data.accessToken;
        console.log('✅ Successfully obtained access token:', token.substring(0, 50) + '...');

        setAuthState({
          isAuthenticated: true,
          token,
          loading: false,
          error: null
        });
        return token;
      } else {
        throw new Error(`Signature verification failed: ${authResult.data?.message || 'Unknown error'}`);
      }

    } catch (error) {
      console.error('❌ Authentication error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Authentication failed';
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage
      }));
      return null;
    }
  }, [address, signMessageAsync]);

  const logout = useCallback(() => {
    setAuthState({
      isAuthenticated: false,
      token: null,
      loading: false,
      error: null
    });
  }, []);

  const getToken = useCallback((): string | null => {
    return authState.token;
  }, [authState.token]);


  return {
    ...authState,
    authenticate,
    logout,
    getToken,
    address
  };
};