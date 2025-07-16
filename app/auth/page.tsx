// app/auth/page.tsx
'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase'; // Ensure this points to your typed supabase client
import { useAuth } from '@/context/AuthContext'; // Ensure this points to your typed AuthContext

// Import your generated database types
// This path should be relative to your project root, assuming database.types.ts is there
import type { Database } from '@/database.types';

// Define the type for the error state to match Supabase's AuthError structure
// Supabase AuthError typically has a 'message' property
type AuthError = { message: string } | null;

const AuthPage: React.FC = () => { // Type the functional component
  // Typed State Variables
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [error, setError] = useState<AuthError>(null); // Use the AuthError type
  const [loading, setLoading] = useState<boolean>(false);
  const [signupSuccess, setSignupSuccess] = useState<boolean>(false);

  const router = useRouter();

  // Safely get user and loading from useAuth, handling potential null/undefined
  const authContext = useAuth();

  // IMPORTANT: Ensure authContext is not null/undefined before destructuring.
  // This check prevents the "type user and loading do not exist on type null" error.
  if (!authContext) {
    // This scenario indicates AuthPage is rendered outside AuthProvider,
    // or AuthContext is misconfigured. Log an error and prevent further rendering.
    console.error("AuthContext not provided. Ensure AuthPage is wrapped by AuthProvider.");
    return (
      <div className="w-full h-screen flex justify-center items-center text-xl text-red-500">
        Authentication system not initialized. Please check application setup.
      </div>
    );
  }

  // Destructure with explicit types from useAuth hook AFTER the null check
  const { user, loading: authLoading } = authContext;

  // Redirect if already logged in
  useEffect(() => {
    // Only redirect if authLoading is false (initial check complete) AND user exists
    if (!authLoading && user) {
      router.push('/');
    }
  }, [user, authLoading, router]); // Dependencies ensure effect re-runs when these values change

  // Typed Event Parameter for form submission
  const handleAuth = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent default form submission behavior
    setError(null); // Clear previous errors
    setLoading(true); // Set loading state
    setSignupSuccess(false); // Reset success message

    if (isSignUp) {
      // --- SIGN UP LOGIC ---
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        // The `data` option here is for `user_metadata` in the `auth.users` table.
        // It's separate from your `profiles` table.
        // If you want to save username to user_metadata, uncomment and adjust:
        // options: {
        //   data: {
        //     username: username, // Save username to user_metadata
        //   },
        // },
      });

      if (signUpError) {
        setError(signUpError); // Supabase's AuthError is compatible with our AuthError type
      } else {
        // If signup is successful, email confirmation is usually required.
        // Do NOT attempt to create a profile here; wait for email confirmation or first login.
        setSignupSuccess(true);
        // Using a custom modal/message box is preferred over alert() in production apps
        // alert('Success! Please check your email for a confirmation link. After confirming, you can log in.');
        setEmail(''); // Clear form fields
        setPassword('');
        setUsername('');
        setIsSignUp(false); // Switch to login form after successful signup
      }
    } else {
      // --- LOG IN LOGIC ---
      const { data: { user: loggedInUser }, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      console.log('Logged in user:', loggedInUser);

      if (signInError) {
        setError(signInError);
      } else if (loggedInUser) {
        // User successfully logged in. Now, check if their profile exists in the 'profiles' table.
        // This is the correct place to create the profile if it doesn't exist.
        // Use the generated Database types for the 'profiles' table
        const { data: profile, error: fetchProfileError } = await supabase
          .from('profiles')
          .select('id') // Select only the 'id' to check for existence
          .eq('id', loggedInUser.id)
          .single(); // Expecting one row or none

        console.log('Profile fetch result:', profile, fetchProfileError);

        // Check for "No rows found" error (PGRST116 is a common PostgREST code for this)
        if (fetchProfileError && fetchProfileError.code === 'PGRST116') {
          // Profile does not exist, so create it
          const { error: profileCreationError } = await supabase
            .from('profiles')
            .insert([
              {
                id: loggedInUser.id,
                username: username || loggedInUser.email?.split('@')[0] || 'New User', // Provide a fallback username
                avatar_url: null,
                created_at: new Date().toISOString()
              }
            ]);

          console.log('Profile creation result:', profileCreationError);

          if (profileCreationError) {
            console.error("Error creating profile on first login:", profileCreationError.message);
            // Provide a user-friendly error message
            setError({ message: "Login successful, but an error occurred creating your profile. Please try again or contact support." });
            await supabase.auth.signOut(); // Sign out if profile creation fails critically
            return; // Stop further execution
          }
        } else if (fetchProfileError) {
          // Other error fetching profile (not just 'no rows found')
          console.error("Error fetching profile on login:", fetchProfileError.message);
          setError({ message: "An error occurred while logging in. Please try again or contact support." });
          await supabase.auth.signOut();
          return;
        }
        // If profile already exists or was just created successfully, redirect to home
        router.push('/');
      }
    }
    setLoading(false); // Reset loading state
  };

  // Display loading/redirecting message while auth state is being determined
  if (authLoading || user) {
    return (
      <div className="w-full h-screen flex justify-center items-center text-xl text-gray-500">
        {user ? 'Redirecting...' : 'Loading...'}
      </div>
    );
  }

  return (
    <section className="w-full flex-center flex-col">
      <h1 className="head_text text-center">
        {isSignUp ? 'Sign Up' : 'Log In'} for The Void
      </h1>
      <p className="desc text-center max-w-md">
        {isSignUp
          ? 'Join The Void to share and access distilled intelligence.'
          : 'Access your intelligence in The Void.'}
      </p>

      {signupSuccess && (
        <div className="mt-4 p-4 bg-green-100 text-green-700 rounded-md">
          Success! Please check your email for a confirmation link. After confirming, you can log in.
        </div>
      )}

      <form onSubmit={handleAuth} className="mt-10 w-full max-w-2xl flex flex-col gap-7 glassmorphism">
        {isSignUp && (
          <label>
            <span className="font-satoshi font-semibold text-base text-gray-700">
              Username
            </span>
            <input
              value={username}
              onChange={(e: FormEvent<HTMLInputElement>) => setUsername(e.currentTarget.value)}
              type="text"
              placeholder="Your unique username"
              required
              className="form_input"
            />
          </label>
        )}
        <label>
          <span className="font-satoshi font-semibold text-base text-gray-700">
            Email Address
          </span>
          <input
            value={email}
            onChange={(e: FormEvent<HTMLInputElement>) => setEmail(e.currentTarget.value)}
            type="email"
            placeholder="email@example.com"
            required
            className="form_input"
          />
        </label>
        <label>
          <span className="font-satoshi font-semibold text-base text-gray-700">
            Password
          </span>
          <input
            value={password}
            onChange={(e: FormEvent<HTMLInputElement>) => setPassword(e.currentTarget.value)}
            type="password"
            placeholder="password"
            required
            className="form_input"
          />
        </label>

        {error && <p className="text-red-500 text-sm mt-2">{error.message}</p>}

        <div className="flex-end mx-3 mb-5 gap-4">
          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError(null); // Clear errors when toggling form
              setSignupSuccess(false); // Clear success message
            }}
            className="text-gray-500 text-sm"
          >
            {isSignUp ? 'Already have an account? Log In' : 'Need an account? Sign Up'}
          </button>

          <button
            type="submit"
            className="px-5 py-1.5 text-sm bg-primary-orange rounded-full text-white"
            disabled={loading}
          >
            {loading ? (isSignUp ? 'Signing Up...' : 'Logging In...') : (isSignUp ? 'Sign Up' : 'Log In')}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AuthPage;
