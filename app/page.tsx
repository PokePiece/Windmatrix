// app/page.jsx
import Feed from '../components/Feed';
import { supabase } from '../utils/supabase';

const Home = async () => {
  const { data: intelligenceEntries, error } = await supabase
    .from('intelligence_entries')
    .select(`
      *,
      profiles (
        username,
        avatar_url
      )
    `) // <-- Remove the comments from here!
    .eq('is_public', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('--- Supabase Fetch Error ---');
    console.error('Error details:', error);
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    console.error('--- End Supabase Fetch Error ---');

    return (
      <section className="w-full flex-center flex-col">
        <h1 className="head_text text-center">
          Discover & Share <br className="max-md:hidden" />
          <span className="orange_gradient text-center">Distilled Intelligence</span>
        </h1>
        <p className="desc text-center">
          The Void is an open-source intelligence platform for everyone to discover, create, and share profound and actionable insights.
        </p>
        <p className="mt-10 text-red-500">
            Failed to load intelligence entries: <br/>
            <span className="font-mono text-sm">{error.message}</span>
        </p>
      </section>
    );
  }

  return (
    <section className="w-full flex-center flex-col">
      <h1 className="head_text text-center">
        Discover & Share <br className="max-md:hidden" />
        <span className="orange_gradient text-center">Distilled Intelligence</span>
      </h1>
      <p className="desc text-center">
        The Void is an open-source intelligence platform for everyone to discover, create, and share profound and actionable insights.
      </p>

      <Feed data={intelligenceEntries || []} />
    </section>
  );
};

export default Home;