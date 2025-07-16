'use client';

import { ReactNode } from 'react'; // Import ReactNode for typing children
import { SessionProvider } from 'next-auth/react'; // Correct import path for SessionProvider
import { Session } from 'next-auth'; // Import Session type for the session prop

// Define an interface for the props to ensure type safety
interface ProviderProps {
  children: ReactNode;
  session: Session | null; // session can be null if no active session
}

// Correctly type the props for the functional component
const Provider = ({ children, session }: ProviderProps) => {
  return (
    <SessionProvider session={session}>
      {children}
    </SessionProvider>
  );
};

export default Provider;
