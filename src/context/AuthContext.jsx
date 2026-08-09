// src/context/AuthContext.jsx
// Supabase authentication context for DigitallyDefined Dashboard

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabase.js";
import {
  getCurrentUser,
  signInWithEmail,
  signUpWithEmail,
  signInWithGoogle,
  signOut,
} from "../lib/auth";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSession() {
      try {
        // First: check active session (required for Google OAuth)
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.user) {
          setCurrentUser(session.user);
        } else {
          // Fallback: check user via getCurrentUser()
          const user = await getCurrentUser();
          setCurrentUser(user || null);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    }

    loadSession();

    // Listen for auth state changes (login, logout, Google OAuth callback)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setCurrentUser(session.user);
      } else {
        setCurrentUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const value = {
    currentUser,

    login: async (email, password) => {
      const user = await signInWithEmail(email, password);
      setCurrentUser(user.user);
      return user;
    },

    signup: async (email, password, name) => {
      const user = await signUpWithEmail(email, password, name);
      setCurrentUser(user.user);
      return user;
    },

    signInWithGoogle: async () => {
      await signInWithGoogle();
      // OAuth redirects, session will be picked up by getSession() + onAuthStateChange
    },

    logout: async () => {
      await signOut();
      setCurrentUser(null);
    },
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
