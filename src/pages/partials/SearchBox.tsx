import React, { useState } from 'react';
import { useDebounce } from 'use-debounce';
import { useNavigate } from 'react-router-dom';
import { CiSearch } from 'react-icons/ci';
import { api } from '../../lib/api';

interface SearchBoxProps {
  className?: string;
}

export const SearchBox: React.FC<SearchBoxProps> = () => {
  const [query, setQuery] = useState('');
  const [debouncedQuery] = useDebounce(query, 500);
  type Post = {
    id: string | number;
    title: string;
    // add other fields if needed
  };

  const [results, setResults] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Fetch API when debounced query changes
  React.useEffect(() => {
    const fetchResults = async () => {
      if (!debouncedQuery) return setResults([]);
      setLoading(true);

      try {
        const res = await fetch(`${api}/posts/search?query=${debouncedQuery}`);
        const data = await res.json();
        setResults(data.posts || []);
      } catch (err) {
        console.error('Search error', err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [debouncedQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;
    navigate(`/search?query=${query}`);
  };

  return (
    <div className='relative w-full max-w-md custom-container'>
      <form onSubmit={handleSubmit} className='flex items-center w-full'>
        <CiSearch />
        <input
          type='text'
          placeholder='Search'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className='w-full px-8 py-1 -translate-x-6 border rounded-md text-sm-regular text-neutral-500'
        />
      </form>
      {results.length > 0 && (
        <ul className='absolute z-10 w-full mt-1 overflow-auto bg-white border rounded-md max-h-60'>
          {results.map((post) => (
            <li
              key={post.id}
              onClick={() => navigate(`/posts/${post.id}`)}
              className='px-3 py-2 cursor-pointer hover:bg-gray-100'
            >
              {post.title}
            </li>
          ))}
        </ul>
      )}

      {loading && <p className='mt-1 text-xs'>Loading...</p>}
    </div>
  );
};
