// src/context/AuthContext.jsx
// Supabase authentication context for DigitallyDefined Dashboard

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabase.js";
import { getCurrentUser, signInWithEmail, signUpWithEmail, signInWithGoogle, signOut } from "../lib/auth";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already signed in via Supabase
    getCurrentUser().then((user) => {
      setCurrentUser(user);
    }).catch((error) => {
      console.error('Auth check failed:', error);
      setCurrentUser(null);
    }).finally(() => {
      setLoading(false);
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setCurrentUser(session?.user || null);
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
      // OAuth redirects, so no need to update currentUser here
    }.bind(this),
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
