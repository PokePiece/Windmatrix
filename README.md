![logo](https://github.com/user-attachments/assets/b0d30319-1189-4a85-b1de-a78cac3bf9d2)

# The Void (Cloud Intelligence Superstructure)



A global, open-source repository for the collection, distillation, and dissemination of highly significant, useful, and actionable intelligence across an unlimited range of disciplines and formats.

## 🌟 Vision & Goal

**The Void** transcends traditional information platforms by focusing on **"raw and distilled intelligence."** This means knowledge that has been refined to its most potent, useful core, offering profound insights and practical utility rather than casual or ephemeral content. It aims to be the definitive, publicly accessible, global superstructure for shared human knowledge.

* **Any Form, Any Domain:** The platform is fundamentally agnostic to the type of intelligence (AI prompts, code snippets, documentation, recipes, scientific breakthroughs, etc.) and its domain, fostering cross-disciplinary learning.
* **Collaborative Ecosystem:** Designed as an open and collaborative platform, "The Void" empowers anyone to contribute their unique insights, enriching a shared global knowledge base.
* **Profound & Actionable Value:** Prioritizing depth and utility, it serves as a go-to resource for individuals seeking to expand understanding, solve complex problems, and contribute meaningfully to collective intelligence.

## ✨ Features (Current & Planned)

* **User Authentication:** Secure sign-up and login using Supabase Auth (email/password), with potential for future social login integrations.
* **Profile Management:** User profiles with customizable usernames and avatars.
* **Intelligence Creation:** Intuitive forms for creating and submitting diverse intelligence entries (text, code, descriptions, tags, etc.).
* **Public Intelligence Feed:** A dynamic homepage displaying all public intelligence entries.
* **User-Specific Pages:** Dedicated pages to view intelligence entries created by specific users (Coming Soon in a future Cruise!).
* **Intelligence Editing & Deletion:** Capabilities for users to manage their own intelligence entries (Coming Soon in a future Cruise!).
* **Search & Discovery:** Robust search functionality by keywords, tags, and authors (Coming Soon in a future Cruise!).
* **Row Level Security (RLS):** Robust data access control implemented via Supabase RLS.

## 🚀 Technologies Used

* **Frontend Framework:** [Next.js 14+](https://nextjs.org/) (App Router, React Server Components)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/)
* **Backend & Database:** [Supabase](https://supabase.com/) (PostgreSQL Database, Authentication, Storage)
* **State Management/Context:** React Context API (for authentication)
* **Version Control:** Git / GitHub

## 🛠️ Getting Started

Follow these steps to get a local copy of "The Void" up and running on your machine.

### Prerequisites

* Node.js (LTS version recommended)
* npm or Yarn (npm is used in examples)
* Git

### 1. Clone the Repository

```bash
git clone [https://github.com/PokePiece/the_void.git](https://github.com/PokePiece/the_void.git)
cd the_void
2. Install Dependencies
Bash

npm install
# or
yarn install
3. Supabase Setup
"The Void" uses Supabase for its backend. You'll need to set up a new Supabase project.

Create a Supabase Project:

Go to Supabase Dashboard.

Click "New Project" and follow the prompts.

Note your Project URL and anon Public Key from Project Settings > API.

Database Schema (SQL Editor):

In your Supabase project, navigate to the "SQL Editor" (the SQL icon in the sidebar).

Run the following SQL commands to set up your profiles and intelligence_entries tables, along with Row Level Security (RLS) policies.

profiles Table:

SQL

-- profiles table for user metadata
create table profiles (
  id uuid references auth.users not null primary key,
  username text unique,
  avatar_url text,
  updated_at timestamp with time zone,
  -- Add any other profile fields you deem necessary
  constraint username_length check (char_length(username) >= 3)
);

-- Set up Row Level Security (RLS) for profiles
alter table profiles enable row level security;

-- Policy for users to read their own profile
create policy "Public profiles are viewable by everyone."
  on profiles for select using (true); -- Make public profiles viewable by everyone. Adjust as needed for privacy.

-- Policy for users to insert their own profile on signup
create policy "Users can insert their own profile."
  on profiles for insert with check (auth.uid() = id);

-- Policy for users to update their own profile
create policy "Users can update their own profile."
  on profiles for update using (auth.uid() = id);

-- This trigger automatically creates a profile entry when a new user signs up
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, avatar_url)
  values (new.id, new.email, null); -- Or generate a random username, use email as fallback
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
intelligence_entries Table:

SQL

-- intelligence_entries table for the core content
create type intelligence_type as enum ('text', 'code', 'recipe', 'documentation', 'prompt', 'other'); -- Define types

create table intelligence_entries (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  description text,
  content_type intelligence_type default 'text' not null, -- Use the enum type
  content_text text not null, -- For text-based content
  content_url text,           -- For external links or files (e.g., images, PDFs)
  tags text[],                -- Array of text for tags
  is_public boolean default true not null, -- Control public visibility
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone
);

-- Set up Row Level Security (RLS) for intelligence_entries
alter table intelligence_entries enable row level security;

-- Policy for public entries to be viewable by everyone
create policy "Public intelligence entries are viewable by everyone."
  on intelligence_entries for select using (is_public = true);

-- Policy for owners to view their own entries (even if not public)
create policy "Owners can view their own intelligence entries."
  on intelligence_entries for select using (auth.uid() = user_id);

-- Policy for owners to create intelligence entries
create policy "Owners can create intelligence entries."
  on intelligence_entries for insert with check (auth.uid() = user_id);

-- Policy for owners to update their intelligence entries
create policy "Owners can update their own intelligence entries."
  on intelligence_entries for update using (auth.uid() = user_id);

-- Policy for owners to delete their intelligence entries
create policy "Owners can delete their own intelligence entries."
  on intelligence_entries for delete using (auth.uid() = user_id);
Environment Variables:

Create a .env.local file in the root of your project (same level as package.json).

Add your Supabase API keys to this file:

Code snippet

NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_PROJECT_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_PROJECT_ANON_KEY
(Replace YOUR_SUPABASE_PROJECT_URL and YOUR_SUPABASE_PROJECT_ANON_KEY with the values from your Supabase Dashboard.)

4. Run the Development Server
Bash

npm run dev
# or
yarn dev
Open http://localhost:3000 in your browser to see the application.

🤝 Contributing
We welcome contributions to "The Void"! If you're interested in contributing:

Fork the repository.

Create a new branch (git checkout -b feature/your-feature-name).

Make your changes.

Commit your changes (git commit -m 'feat: Add new feature').

Push to the branch (git push origin feature/your-feature-name).

Open a Pull Request.

Please ensure your code adheres to the project's coding standards and includes relevant tests.

📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

📞 Contact
Your Name/Handle: [Your GitHub Profile Link]

Project GitHub: https://github.com/PokePiece/the_void

