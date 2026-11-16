import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  loading: boolean;
  isConfigured: boolean;
  authError: string | null;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(() => Boolean(isSupabaseConfigured && supabase));
  const [authError, setAuthError] = useState<string | null>(null);

  // Check if a user is explicitly authorized as the admin
  const verifyAdminAuthorization = async (currentUser: User): Promise<boolean> => {
    if (!supabase) return false;

    try {
      // 1. Direct database verification via public.is_admin() RPC function
      const { data: rpcIsAdmin, error: rpcError } = await supabase.rpc('is_admin');
      if (!rpcError && typeof rpcIsAdmin === 'boolean' && rpcIsAdmin) {
        return true;
      }

      // 2. Check against the admin_users table in Supabase
      const { data: adminRecord, error: tableError } = await supabase
        .from('admin_users')
        .select('id, email')
        .eq('id', currentUser.id)
        .maybeSingle();

      if (!tableError && adminRecord) {
        return true;
      }


      return false;
    } catch (err) {
      console.warn('Error verifying admin authorization:', err);

      return false;
    }
  };

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      return;
    }

    let isMounted = true;

    let revision = 0;
    const applySession = async (currentSession: Session | null) => {
      const currentRevision = ++revision;
      if (!isMounted) return;
      setLoading(true);
      setIsAdmin(false);
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      try {
        const authorized = currentSession?.user
          ? await verifyAdminAuthorization(currentSession.user)
          : false;
        if (isMounted && revision === currentRevision) setIsAdmin(authorized);
      } finally {
        if (isMounted && revision === currentRevision) setLoading(false);
      }
    };

    // Auth callbacks must return before starting another Supabase request.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setTimeout(() => { if (isMounted) void applySession(newSession); }, 0);
    });
    const initialRevision = revision;
    void supabase.auth.getSession().then(({ data: { session: currentSession }, error }) => {
      if (!isMounted || revision !== initialRevision) return;
      if (error) setAuthError(error.message);
      void applySession(error ? null : currentSession);
    }).catch(() => {
      if (isMounted && revision === initialRevision) {
        setAuthError('Unable to restore your session. Please sign in again.');
        void applySession(null);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setAuthError(null);

    if (!isSupabaseConfigured || !supabase) {
      const msg = 'Supabase credentials are not configured. Please add your credentials to .env.';
      setAuthError(msg);
      return { success: false, error: msg };
    }

    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error || !data.user) {
        const msg = error?.message || 'Authentication failed. Please verify your email and password.';
        setAuthError(msg);
        setLoading(false);
        return { success: false, error: msg };
      }

      // Enforce authorization: Authentication alone does NOT grant admin privileges
      const authorized = await verifyAdminAuthorization(data.user);

      if (!authorized) {
        // Sign out immediately if user is not the designated admin
        await supabase.auth.signOut();
        setUser(null);
        setSession(null);
        setIsAdmin(false);
        const msg = 'Access Denied: Your account is not authorized as the administrator for this portfolio.';
        setAuthError(msg);
        setLoading(false);
        return { success: false, error: msg };
      }

      setUser(data.user);
      setSession(data.session);
      setIsAdmin(true);
      setLoading(false);
      return { success: true };
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'An unexpected error occurred during sign in.';
      setAuthError(errorMsg);
      setLoading(false);
      return { success: false, error: errorMsg };
    }
  };

  const signOut = async (): Promise<void> => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setSession(null);
    setIsAdmin(false);
    setAuthError(null);
  };

  const clearError = () => setAuthError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isAdmin,
        loading,
        isConfigured: isSupabaseConfigured,
        authError,
        signIn,
        signOut,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
