'use client';

import React, { FormEvent, ChangeEvent } from 'react'; // Import React, FormEvent, ChangeEvent
import Link from 'next/link';

// Define the Post interface based on how it's used and set in create-intelligence/page.jsx
interface Post {
  intelligence: string; // Maps to content_text
  tag: string;          // A single string for tags, which will be split into an array later
  type: string;         // e.g., 'text'
  title: string;
  description: string;
}

// Define the props interface for the Form component
interface FormProps {
  type: string; // e.g., "Create" or "Edit"
  post: Post;
  setPost: React.Dispatch<React.SetStateAction<Post>>; // Type for useState setter function
  submitting: boolean;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => Promise<void>; // Type for form submission handler
}

// Type the functional component with the defined props interface
const Form: React.FC<FormProps> = ({ type, post, setPost, submitting, handleSubmit }) => {
  return (
    <section className="w-full max-w-full flex-start flex-col">
      <h1 className="head_text text-left">
        <span className="blue_gradient">{type} Intelligence</span>
      </h1>
      <p className="desc text-left max-w-md">
        {type} and share amazing pieces of raw and distilled intelligence with the world.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-10 w-full max-w-2xl flex flex-col gap-7 glassmorphism"
      >
        {/* Title Field */}
        <label>
          <span className="font-satoshi font-semibold text-base text-gray-700">
            Title of Intelligence
          </span>
          <input
            value={post.title}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setPost({ ...post, title: e.target.value })} // Type event
            placeholder="A concise and descriptive title"
            required
            className="form_input"
          />
        </label>

        {/* Intelligence Content Field (formerly "Prompt") */}
        <label>
          <span className="font-satoshi font-semibold text-base text-gray-700">
            Your Intelligence
          </span>
          <textarea
            value={post.intelligence}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setPost({ ...post, intelligence: e.target.value })} // Type event
            placeholder="Write your raw and distilled intelligence here (e.g., code, detailed instructions, deep insights)"
            required
            className="form_textarea"
          />
        </label>

        {/* Tags Field */}
        <label>
          <span className="font-satoshi font-semibold text-base text-gray-700">
            Tags{' '}
            <span className="font-normal">
              (#product, #webdev, #recipe, #physics, #concept, etc. - separate with commas)
            </span>
          </span>
          <input
            value={post.tag}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setPost({ ...post, tag: e.target.value })} // Type event
            type="text"
            placeholder="#tag, #anotherTag"
            required
            className="form_input"
          />
        </label>

        {/* Description Field (Optional) */}
        <label>
          <span className="font-satoshi font-semibold text-base text-gray-700">
            Optional Description
            <span className="font-normal"> (A brief overview or context)</span>
          </span>
          <textarea
            value={post.description}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setPost({ ...post, description: e.target.value })} // Type event
            placeholder="Optionally provide more context or a brief overview."
            className="form_textarea"
          />
        </label>

        <div className="flex-end mx-3 mb-5 gap-4">
          <Link href="/" className="text-gray-500 text-sm">
            Cancel
          </Link>

          <button
            type="submit"
            disabled={submitting}
            className="px-5 py-1.5 text-sm bg-primary-orange rounded-full text-white"
          >
            {submitting ? `${type}ing...` : type}
          </button>
        </div>
      </form>
    </section>
  );
};

export default Form;
