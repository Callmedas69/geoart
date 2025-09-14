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
      console.log('🔍 Checking for existing Vibe.Market authentication...');
      
      // STEP 1: Check for existing vibeAuthToken in localStorage (from Vibe.Market)
      const existingToken = localStorage.getItem('vibeAuthToken');
      
      if (existingToken) {
        console.log('✅ Found existing vibeAuthToken in localStorage:', existingToken.substring(0, 50) + '...');
        
        // Validate token format (JWT should have 3 parts separated by dots)
        const tokenParts = existingToken.split('.');
        if (tokenParts.length === 3) {
          try {
            // Decode JWT payload to check expiration
            const payload = JSON.parse(atob(tokenParts[1]));
            const currentTime = Math.floor(Date.now() / 1000);
            
            if (payload.exp && payload.exp > currentTime) {
              console.log('✅ Existing token is valid and not expired');
              setAuthState({
                isAuthenticated: true,
                token: existingToken,
                loading: false,
                error: null
              });
              return existingToken;
            } else {
              console.log('⚠️ Existing token is expired, will authenticate fresh');
            }
          } catch (decodeError) {
            console.log('⚠️ Could not decode existing token, will authenticate fresh');
          }
        } else {
          console.log('⚠️ Existing token format invalid, will authenticate fresh');
        }
      } else {
        console.log('📭 No existing vibeAuthToken found in localStorage');
      }

      // STEP 2: No valid existing token, perform full authentication flow
      console.log('🔐 Performing full authentication flow...');
      
      // Step 2a: Request authentication message/challenge from Vibe.Market
      console.log('🚀 Requesting authentication message from Vibe.Market...');
      const messageResponse = await fetch(`/api/vibe-auth-message/${address}`, {
        method: 'GET',
      });

      const messageResult = await messageResponse.json();
      console.log('🔍 Message response:', messageResult);

      if (!messageResult.success || !messageResult.message) {
        throw new Error(`Failed to get authentication message: ${messageResult.error || 'Unknown error'}`);
      }

      // Step 2b: Sign the challenge message
      const message = messageResult.message;
      console.log('🔐 Signing Vibe.Market authentication message:', message);
      const signature = await signMessageAsync({ message });
      console.log('✍️ Message signed:', signature);

      // Step 3: Verify signature with Vibe.Market to get JWT token
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
        console.log('✅ Successfully obtained fresh access token:', token.substring(0, 50) + '...');
        
        // Store token in localStorage for future use (same as Vibe.Market)
        localStorage.setItem('vibeAuthToken', token);
        console.log('💾 Stored vibeAuthToken in localStorage');
        
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
    // Clear stored token
    localStorage.removeItem('vibeAuthToken');
    console.log('🗑️ Cleared vibeAuthToken from localStorage');
    
    setAuthState({
      isAuthenticated: false,
      token: null,
      loading: false,
      error: null
    });
  }, []);

  const getToken = useCallback((): string | null => {
    // First check current state
    if (authState.token) {
      return authState.token;
    }
    
    // Fallback to localStorage (browser only)
    if (typeof window !== 'undefined') {
      const existingToken = localStorage.getItem('vibeAuthToken');
      if (existingToken) {
        console.log('🔍 getToken: Retrieved token from localStorage');
        return existingToken;
      }
    }
    
    console.log('⚠️ getToken: No token available');
    return null;
  }, [authState.token]);

  // Check for existing token on hook initialization
  useEffect(() => {
    const checkExistingAuth = () => {
      const existingToken = localStorage.getItem('vibeAuthToken');
      
      if (existingToken) {
        console.log('🔍 Found existing vibeAuthToken on initialization');
        
        // Validate token format and expiration
        const tokenParts = existingToken.split('.');
        if (tokenParts.length === 3) {
          try {
            const payload = JSON.parse(atob(tokenParts[1]));
            const currentTime = Math.floor(Date.now() / 1000);
            
            if (payload.exp && payload.exp > currentTime) {
              console.log('✅ Auto-authenticating with existing valid token');
              setAuthState({
                isAuthenticated: true,
                token: existingToken,
                loading: false,
                error: null
              });
            } else {
              console.log('⚠️ Existing token expired on initialization');
              localStorage.removeItem('vibeAuthToken');
            }
          } catch (error) {
            console.log('⚠️ Invalid token format on initialization');
            localStorage.removeItem('vibeAuthToken');
          }
        }
      }
    };

    checkExistingAuth();
  }, []);

  return {
    ...authState,
    authenticate,
    logout,
    getToken,
    address
  };
};