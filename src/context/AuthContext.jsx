// src/context/AuthContext.jsx
// Puter.js authentication context

import { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser, signIn as puterSignIn, signOut as puterSignOut, isSignedIn } from "../lib/auth";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already signed in
    async function checkAuth() {
      try {
        const user = await getCurrentUser();
        setCurrentUser(user);
      } catch (error) {
        console.error('Auth check failed:', error);
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, []);

  const value = {
    currentUser,
    signup: async (email, password, name) => {
      // Puter.js handles signup through signIn()
      // The actual signup is handled by Puter's auth flow
      throw new Error("Sign up is handled by Puter.js authentication flow");
    },
    login: async (email, password) => {
      // Puter.js uses its own auth flow, not email/password
      // This is kept for compatibility but actual auth uses puter.auth.signIn()
      await puterSignIn();
      const user = await getCurrentUser();
      setCurrentUser(user);
      return user;
    },
    logout: async () => {
      await puterSignOut();
      setCurrentUser(null);
    },
    signInWithGoogle: async () => {
      // Google sign-in is handled by Puter.js
      await puterSignIn();
      const user = await getCurrentUser();
      setCurrentUser(user);
      return user;
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
