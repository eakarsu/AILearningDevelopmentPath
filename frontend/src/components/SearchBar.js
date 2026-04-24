import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { globalSearch } from '../services/api';

function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const ref = useRef(null);
  const debounceRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSearch = (value) => {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (value.length < 2) { setResults([]); setOpen(false); return; }

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const { data } = await globalSearch(value);
        setResults(data);
        setOpen(true);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    }, 300);
  };

  const handleSelect = (result) => {
    navigate(result.link);
    setQuery('');
    setOpen(false);
    setResults([]);
  };

  const typeColors = {
    Employee: '#6366f1', Course: '#22c55e', Certification: '#f59e0b',
    'Learning Track': '#8b5cf6', 'Training Event': '#f97316',
  };

  return (
    <div className="search-bar-container" ref={ref}>
      <div className="search-input-wrapper">
        <span className="search-icon">&#x1F50D;</span>
        <input
          className="search-input"
          type="text"
          placeholder="Search employees, courses, certifications..."
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => { if (results.length > 0) setOpen(true); }}
        />
        {loading && <span className="search-spinner" />}
      </div>

      {open && results.length > 0 && (
        <div className="search-dropdown">
          {results.map((r, i) => (
            <div key={`${r.type}-${r.id}-${i}`} className="search-result-item" onClick={() => handleSelect(r)}>
              <span className="search-result-type" style={{ background: `${typeColors[r.type] || '#64748b'}20`, color: typeColors[r.type] || '#94a3b8' }}>
                {r.type}
              </span>
              <div className="search-result-info">
                <div className="search-result-title">{r.title}</div>
                <div className="search-result-subtitle">{r.subtitle}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {open && !loading && results.length === 0 && query.length >= 2 && (
        <div className="search-dropdown">
          <div className="search-no-results">No results found for "{query}"</div>
        </div>
      )}
    </div>
  );
}

export default SearchBar;
