import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import classes from './search.module.css';

export default function Search({
  searchRoute = '/search/',
  defaultRoute = '/',
  margin,
  placeholder = 'Search Food ...',
}) {
  const [term, setTerm] = useState('');
  const navigate = useNavigate();
  const { searchTerm } = useParams();

  useEffect(() => {
    setTerm(searchTerm ?? '');
  }, [searchTerm]);

  const search = () => {
    if (term.trim()) {
      navigate(`${searchRoute}${term}`);
    } else {
      navigate(defaultRoute);
    }
  };

  return (
    <div className={classes.container} style={{ margin }}>
      <input
        type="text"
        placeholder={placeholder}
        onChange={(e) => setTerm(e.target.value)}
        onKeyUp={(e) => e.key === 'Enter' && search()}
        value={term}
      />
      <button onClick={search}>Search</button>
    </div>
  );
}
