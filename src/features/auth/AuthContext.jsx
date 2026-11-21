import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import * as authService from '@/services/authService';
import { mergeGuestCart } from '@/features/cart/cartService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const unsub = authService.onAuthChange(async (firebaseUser) => {
      setUser(firebaseUser || null);
      setLoading(false);
      setInitializing(false);
      if (firebaseUser) {
        // Merge any guest cart + guest draft into the account.
        try {
          await mergeGuestCart(firebaseUser.uid);
        } catch (err) {
          console.warn('Guest merge failed (non-fatal):', err);
        }
      }
    });
    return () => unsub();
  }, []);

  const login = useCallback((email, password) => authService.login(email, password), []);
  const signup = useCallback((email, password, name) => authService.signup(email, password, name), []);
  const logout = useCallback(() => authService.logout(), []);
  const resetPassword = useCallback((email) => authService.resetPassword(email), []);

  const value = useMemo(
    () => ({ user, loading, initializing, login, signup, logout, resetPassword }),
    [user, loading, initializing, login, signup, logout, resetPassword],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
