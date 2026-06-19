import React from 'react';
import { useSeating } from '../../context/SeatingContext';
import './SearchBar.css';

export default function SearchBar() {
  const { searchQuery, setSearchQuery } = useSeating();

  return (
    <div className="search-bar">
      <span className="search-icon">⌕</span>
      <input
        type="text"
        className="search-input"
        placeholder="Search guests or groups…"
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
      />
      {searchQuery && (
        <button className="search-clear" onClick={() => setSearchQuery('')}>×</button>
      )}
    </div>
  );
}
