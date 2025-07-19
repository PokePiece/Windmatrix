// app/create-intelligence/page.jsx
'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/utils/supabase';
import { User } from '@supabase/supabase-js'; // Import Supabase User type

import Form from '@/components/Form';

const CreateIntelligence = () => {
  const router = useRouter();

  // Safely get authContext from useAuth, handling potential null/undefined
  const authContext = useAuth();

  // IMPORTANT: Ensure authContext is not null/undefined before destructuring.
  // This check prevents the "type user and loading do not exist on type null" error.
  if (!authContext) {
    // This scenario indicates CreateIntelligence is rendered outside AuthProvider,
    // or AuthContext is misconfigured. Log an error and prevent further rendering.
    console.error("AuthContext not provided. Ensure CreateIntelligence is wrapped by AuthProvider.");
    router.push('/auth'); // Redirect to auth page if context is not available
    return null; // Don't render anything if redirecting
  }

  // Destructure with explicit types from useAuth hook AFTER the null check
  // Explicitly type 'user' as User | null to guide TypeScript
  const { user, loading: authLoading }: { user: User | null; loading: boolean } = authContext;

  const [submitting, setSubmitting] = useState(false);
  const [post, setPost] = useState({
    intelligence: '', // Will map to content_text
    tag: '',          // Will map to tags (array of strings)
    type: 'text',     // Default type, can be expanded later
    title: '',        // New field for title
    description: '',  // New field for description
  });

  // Handle redirection based on auth state
  if (authLoading) {
    return <div className="w-full h-screen flex justify-center items-center text-xl text-gray-500">Loading...</div>;
  }

  // If not loading and no user, redirect to auth page
  // After this check, 'user' is guaranteed to be a 'User' object
  if (!user) {
    router.push('/auth');
    return null; // Don't render anything if redirecting
  }

  // Explicitly type the event parameter 'e' as FormEvent<HTMLFormElement>
  const createIntelligence = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);

    // Basic validation (can be more robust)
    if (!post.title || !post.intelligence || !post.tag) {
      console.error('Title, Content, and Tags are required.');
      setSubmitting(false);
      return;
    }

    // Convert single tag string to array for Supabase text[] type
    const tagsArray = post.tag.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);

    try {
      // Insert into intelligence_entries table
      const { data, error } = await supabase
        .from('intelligence_entries')
        .insert([
          {
            user_id: user.id, // 'user' is now explicitly typed as 'User' here, resolving the error
            title: post.title,
            description: post.description,
            content_text: post.intelligence,
            content_type: post.type,
            tags: tagsArray, // Use the array of tags
            is_public: true, // Default to public for now
          },
        ])
        .select(); // Select the inserted row to confirm

      if (error) {
        console.error('Error creating intelligence entry:', error);
        // In a real app, display a user-friendly error message here (e.g., a toast or modal)
      } else {
        console.log('Intelligence entry created successfully:', data);
        router.push('/'); // Redirect to home feed
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      // In a real app, display a user-friendly error message here
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Form
      type="Create"
      post={post}
      setPost={setPost}
      submitting={submitting}
      handleSubmit={createIntelligence}
    />
  );
};

export default CreateIntelligence;
