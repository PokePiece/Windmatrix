// components/IntelligenceCard.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { User } from '@supabase/supabase-js'; // Import Supabase User type

// Define an interface for the 'post' prop to ensure type safety
// You'll need to define the actual structure of your 'post' object based on your database schema
interface Post {
  id: string; // Example, adjust based on your actual data
  user_id: string;
  content_text: string;
  title: string;
  description?: string; // Optional property
  tags: string[]; // Assuming tags is an array of strings
  profiles: {
    username: string;
    avatar_url?: string; // Optional
    // Add other profile properties as needed
  };
  // ... any other properties of a post
}

interface IntelligenceCardProps {
  post: Post;
  handleTagClick?: (tag: string) => void; // Optional if not always provided
  handleEdit?: () => void;
  handleDelete?: () => void;
}

const IntelligenceCard: React.FC<IntelligenceCardProps> = ({ post, handleTagClick, handleEdit, handleDelete }) => {
  // Safely get authContext from useAuth, handling potential null/undefined
  const authContext = useAuth();

  // IMPORTANT: Ensure authContext is not null/undefined before destructuring.
  // If authContext is null, it means AuthProvider is not wrapping this component.
  if (!authContext) {
    console.error("AuthContext not provided. Ensure IntelligenceCard is wrapped by AuthProvider.");
    // Depending on your app's flow, you might want to render nothing,
    // or a placeholder, or redirect. For now, we'll return null to prevent errors.
    return null;
  }

  // Destructure with explicit types from useAuth hook AFTER the null check
  // Explicitly type 'user' as User | null to guide TypeScript
  const { user }: { user: User | null } = authContext; // FIX: Explicitly type user

  const pathName = usePathname();
  const router = useRouter();

  const [copied, setCopied] = useState<string | false>("");

  const handleProfileClick = () => {
    console.log(post);

    // Now 'user' is correctly typed as User | null, so this check works
    if (user && post.user_id === user.id) {
      return router.push(`/profile/${user.id}`);
    }
    router.push(`/profile/${post.user_id}?name=${post.profiles.username}`);
  };

  const handleCopy = () => {
    setCopied(post.content_text);
    document.execCommand('copy'); // Use document.execCommand('copy') for clipboard in iframe environments
    // navigator.clipboard.writeText(post.content_text); // This might not work in all iframe environments
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="prompt_card">
      <div className="flex justify-between items-start gap-5">
        <div
          className="flex-1 flex justify-start items-center gap-3 cursor-pointer"
          onClick={handleProfileClick}
        >
          <Image
            src={post.profiles?.avatar_url || '/assets/images/logo.svg'}
            alt="user_image"
            width={40}
            height={40}
            className="rounded-full object-contain"
          />

          <div className="flex flex-col">
            <h3 className="font-satoshi font-semibold text-gray-100">
              {post.profiles?.username}
            </h3>
            <p className="font-inter text-sm text-gray-200">
              {/*post.profiles?.email || 'unknown@example.com'*/}
            </p>
          </div>
        </div>

        <div className="copy_btn" onClick={handleCopy}>
          <Image
            src={
              copied === post.content_text
                ? "/assets/icons/tick.svg"
                : "/assets/icons/copy.svg"
            }
            alt={copied === post.content_text ? "tick_icon" : "copy_icon"}
            width={12}
            height={12}
          />
        </div>
      </div>

      <h2 className="font-satoshi font-bold text-lg text-gray-300 mt-4">{post.title}</h2>
      {post.description && (
          <p className="my-2 font-inter text-sm text-gray-300">{post.description}</p>
      )}
      <p className="my-2 font-satoshi text-sm text-gray-400">{post.content_text}</p>
      <p
        className="font-inter text-sm blue_gradient cursor-pointer"
        onClick={() => handleTagClick && handleTagClick(post.tags[0])}
      >
        {post.tags && post.tags.join(', ')}
      </p>

      {/* This check is now safe because 'user' is typed as User | null */}
      {user && user.id === post.user_id && pathName === "/profile" && (
        <div className="mt-5 flex-center gap-4 border-t border-gray-100 pt-3">
          <p
            className="font-inter text-sm green_gradient cursor-pointer"
            onClick={handleEdit}
          >
            Edit
          </p>
          <p
            className="font-inter text-sm orange_gradient cursor-pointer"
            onClick={handleDelete}
          >
            Delete
          </p>
        </div>
      )}
    </div>
  );
};

export default IntelligenceCard;
