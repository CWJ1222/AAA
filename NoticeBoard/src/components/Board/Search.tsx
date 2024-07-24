import React, { useState } from 'react';

interface SearchProps {
  onSearch: (query: string) => void;
}

const Search: React.FC<SearchProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSearch = () => {
    onSearch(query);
  };

return (
  <div className="search-container flex justify-end">
    <input
      type="text"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="Search title or content"
      className="border p-1 text-xs"
    />
    <button onClick={handleSearch} className="bg-lime-500 text-black px-1 py-0.5 ml-2 rounded text-xs">
      Search
    </button>
  </div>
);
};

export default Search;