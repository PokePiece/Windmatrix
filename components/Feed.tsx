'use client'; // Needs to be a client component for search state

import React, { useState, useEffect, FormEvent, ChangeEvent } from 'react'; // Import React, FormEvent, ChangeEvent
import IntelligenceCard from './IntelligenceCard'; // Assuming this component is now typed

// Define the Post interface, assuming it's consistent across your application
// (e.g., from IntelligenceCard.tsx or a shared types file)
interface Post {
  id: string;
  user_id: string;
  content_text: string;
  title: string;
  description?: string;
  tags: string[];
  profiles: {
    username: string;
    avatar_url?: string;
  };
}

// Define props for IntelligenceCardList component
interface IntelligenceCardListProps {
  data: Post[]; // data is an array of Post objects
  handleTagClick: (tag: string) => void;
}

// Helper component for rendering individual intelligence cards
const IntelligenceCardList: React.FC<IntelligenceCardListProps> = ({ data, handleTagClick }) => {
  return (
    <div className="mt-16 prompt_layout">
      {data.map((post: Post) => ( // Explicitly type 'post' in map
        <IntelligenceCard
          key={post.id}
          post={post}
          handleTagClick={handleTagClick}
          // Add handlers for edit/delete if needed here (later movements)
        />
      ))}
    </div>
  );
};

// Define props for Feed component
interface FeedProps {
  data: Post[]; // data is an array of Post objects passed from the parent
}

const Feed: React.FC<FeedProps> = ({ data }) => { // Type Feed component props
  const [searchText, setSearchText] = useState<string>('');
  const [searchResults, setSearchResults] = useState<Post[]>([]); // searchResults is an array of Post objects
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null); // Type for setTimeout ID

  const filterIntelligence = (searchtext: string): Post[] => { // Type searchtext parameter and return value
    const regex = new RegExp(searchtext, 'i'); // 'i' for case-insensitive search
    return data.filter(
      (item: Post) => // Explicitly type 'item'
        regex.test(item.profiles.username) || // Search by creator's username
        regex.test(item.title) ||             // Search by title
        regex.test(item.content_text) ||      // Search by content
        item.tags.some(tag => regex.test(tag)) // Search within tags array
    );
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => { // Type event parameter
    if (searchTimeout) { // Clear existing timeout if any
      clearTimeout(searchTimeout);
    }
    setSearchText(e.target.value);

    // debounce method
    setSearchTimeout(
      setTimeout(() => {
        const searchResult = filterIntelligence(e.target.value);
        setSearchResults(searchResult);
      }, 500)
    );
  };

  const handleTagClick = (tagName: string) => { // Type tagName parameter
    setSearchText(tagName);
    const searchResult = filterIntelligence(tagName);
    setSearchResults(searchResult);
  };

  // Effect to update search results when data or search text changes
  useEffect(() => {
    if (searchText === '') {
      setSearchResults(data); // If no search text, show all data
    } else {
      setSearchResults(filterIntelligence(searchText));
    }
  }, [data, searchText]); // Re-filter if data from server component changes

  return (
    <section className="feed">
      <form className="relative w-full flex-center">
        <input
          type="text"
          placeholder="Search for intelligence, tags, or users..."
          value={searchText}
          onChange={handleSearchChange}
          required
          className="search_input peer"
        />
      </form>

      {/* All Intelligence Entries */}
      {searchText ? (
        <IntelligenceCardList data={searchResults} handleTagClick={handleTagClick} />
      ) : (
        <IntelligenceCardList data={data} handleTagClick={handleTagClick} />
      )}
    </section>
  );
};

export default Feed;
