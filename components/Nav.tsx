// components/Nav.jsx
'use client'; // Mark as client component

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react'; // Keep useState, useEffect if used elsewhere for mobile menu
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext'; // Import useAuth
import { supabase } from '../utils/supabase'; // Import supabase instance
import { User } from '@supabase/supabase-js'; // Import Supabase User type

const Nav = () => {
  const router = useRouter();

  // Safely get authContext from useAuth, handling potential null/undefined
  const authContext = useAuth();

  // IMPORTANT: Ensure authContext is not null/undefined before destructuring.
  // If it is null, it means AuthProvider is not wrapping this component.
  if (!authContext) {
    console.error("AuthContext not provided. Ensure Nav is wrapped by AuthProvider.");
    // In this scenario, you might want to render a very basic nav or redirect,
    // but returning null here would mean no nav is shown at all.
    // For a Navbar, it's generally better to let it render its loading/signed-out state
    // and handle null user appropriately within its JSX.
    // So, we'll assign default values if context is missing, though this shouldn't happen
    // if the RootLayout correctly wraps the app with AuthProvider.
    // If the error persists, double-check your RootLayout.
    return (
      <nav className="flex-between w-full mb-16 pt-3">
        <Link href="/" className="flex gap-2 flex-center">
          <Image src="/assets/images/logo.svg" alt="The Void Logo" width={30} height={30} className="object-contain" />
          <p className="logo_text">The Nerves</p>
        </Link>
        {/* Render a default state if authContext is unexpectedly null */}
        <div className="sm:flex hidden">
          <Link href="/auth" className="black_btn">Sign In / Sign Up</Link>
        </div>
        <div className="sm:hidden flex relative">
          <Link href="/auth" className="black_btn">Sign In / Sign Up</Link>
        </div>
      </nav>
    );
  }

  // Destructure with explicit types from useAuth hook AFTER the null check
  const { user, loading }: { user: User | null; loading: boolean } = authContext; // FIX: Explicitly type user and loading

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error.message);
    } else {
      router.push('/auth'); // Redirect to auth page after logout
    }
  };

  return (
    <nav className="flex-between w-full mb-16 pt-3">
      <Link href="/" className="flex gap-2 flex-center">
        <Image
          src="/assets/images/logo.svg"
          alt="The Void Logo"
          width={30}
          height={30}
          className="object-contain"
        />
        <p className="logo_text">The Nerves</p>
      </Link>

      {/* Desktop Navigation */}
      <div className="sm:flex hidden">
        {loading ? ( // Show loading state for auth
          <div>Loading...</div>
        ) : user ? ( // User is logged in
          <div className="flex gap-3 md:gap-5">
            <Link href="/create-intelligence" className="black_btn">
              Create Intelligence
            </Link>

            <button type="button" onClick={handleSignOut} className="outline_btn">
              Sign Out
            </button>

            {/* Link to user's profile based on their Supabase ID */}
            <Link href={`/profile/${user.id}`}>
              <Image
                src={user.user_metadata?.avatar_url || '/assets/images/logo.svg'} // Use actual avatar if available, fallback to logo
                width={37}
                height={37}
                className="rounded-full"
                alt="profile"
              />
            </Link>
          </div>
        ) : ( // User is not logged in
          <>
            <Link href="/auth" className="black_btn">
              Sign In / Sign Up
            </Link>
          </>
        )}
      </div>

      {/* Mobile Navigation (Adapt existing logic as needed) */}
      <div className="sm:hidden flex relative">
        {loading ? (
            <div>Loading...</div>
        ) : user ? (
            <>
                {/* Placeholder for mobile menu button/dropdown */}
                <Image
                    src={user.user_metadata?.avatar_url || '/assets/images/logo.svg'}
                    width={37}
                    height={37}
                    className="rounded-full"
                    alt="profile"
                    // onClick={() => setToggleDropdown((prev) => !prev)} // Assuming you have this state
                />
                {/* Your mobile dropdown conditional rendering */}
                {/* If you have a dropdown, you'd typically have state like:
                {toggleDropdown && (
                    <div className="dropdown">
                        <Link href={`/profile/${user.id}`} className="dropdown_link" onClick={() => setToggleDropdown(false)}>
                            My Profile
                        </Link>
                        <Link href="/create-intelligence" className="dropdown_link" onClick={() => setToggleDropdown(false)}>
                            Create Intelligence
                        </Link>
                        <button type="button" onClick={() => { setToggleDropdown(false); handleSignOut(); }} className="mt-5 w-full black_btn">
                            Sign Out
                        </button>
                    </div>
                )}
                */}
            </>
        ) : (
            <Link href="/auth" className="black_btn">
                Sign In / Sign Up
            </Link>
        )}
      </div>
    </nav>
  );
};

export default Nav;
