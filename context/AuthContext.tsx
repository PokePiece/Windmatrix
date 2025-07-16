'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'; // Import ReactNode
import { User, Session } from '@supabase/supabase-js'; // Import User and Session types from Supabase
import { supabase } from '../utils/supabase'; // Adjust path if necessary

// Define the shape of your authentication context
interface AuthContextType {
  user: User | null;
  loading: boolean;
}

// Initialize AuthContext with a default value that matches AuthContextType, or null
// We allow it to be null if used outside a provider, which is handled in useAuth hook consumers
const AuthContext = createContext<AuthContextType | null>(null);

// Define props for AuthProvider component
interface AuthProviderProps {
  children: ReactNode; // FIX: children prop typed as ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) { // FIX: Type AuthProvider props
  // FIX: Explicitly type useState for 'user' as User | null
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // Explicitly type loading as boolean

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session: Session | null) => { // FIX: Type session as Session | null
        if (session) {
          setUser(session.user); // This line is now safe
        } else {
          setUser(null); // This line is now safe
        }
        setLoading(false);
      }
    );

    // Fetch initial user state
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setUser(session.user); // This line is now safe
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    // FIX: value matches the AuthContextType
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

// useAuth hook will return AuthContextType or null if not used inside AuthProvider
export const useAuth = () => useContext(AuthContext);
