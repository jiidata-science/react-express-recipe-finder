import React from 'react';
import './styles.css';

function SearchItem ({ ingredient, setTerm }) {
  return (
    <div className="search-item">
      <div className="ingredient" onClick={() => setTerm(ingredient)}>{ingredient}</div>
    </div>
  );
}

export default SearchItem;