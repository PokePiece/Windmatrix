import React from 'react';
import PromptCard from './IntelligenceCard'; // Renamed from PromptCard to IntelligenceCard based on previous context

// Define the Post interface, assuming it's the same as in IntelligenceCard.tsx
// If you have a shared types file (e.g., types/index.ts), define this there
// and import it into both IntelligenceCard.tsx and this file.
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

// Define the interface for the Profile component's props
interface ProfileProps {
  name: string;
  desc: string;
  data: Post[]; // data is an array of Post objects
  handleEdit?: (post: Post) => void; // handleEdit takes a Post object
  handleDelete?: (post: Post) => void; // handleDelete takes a Post object
}

// Type the functional component with the defined props interface
const Profile: React.FC<ProfileProps> = ({ name, desc, data, handleEdit, handleDelete }) => {
  return (
    <section className="w-full">
      <h1 className="head_text text-left">
        <span className="blue_gradient">{name} Profile</span>
      </h1>
      <p className="desc text-left">{desc}</p>
      <div className="mt-10 prompt_layout">
        {data.map((post: Post) => ( // FIX: Explicitly type 'post' as Post
          <PromptCard
            key={post.id} // Assuming 'id' is the unique key for your posts
            post={post}
            handleEdit={() => handleEdit && handleEdit(post)}
            handleDelete={() => handleDelete && handleDelete(post)}
          />
        ))}
      </div>
    </section>
  );
};

export default Profile;
