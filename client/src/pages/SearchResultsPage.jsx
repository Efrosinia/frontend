import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './SearchResultsPage.css';
import Header from './Header';

const mockRecommendations = [
  {
    id: 1,
    title: "2001: A Space Odyssey",
    rating: 4.8,
    image: "https://via.placeholder.com/150x200?text=Odyssey",
  },
  {
    id: 2,
    title: "The Dark Knight",
    rating: 4.6,
    image: "https://via.placeholder.com/150x200?text=Knight",
  },
  {
    id: 3,
    title: "Parasite",
    rating: 4.9,
    image: "https://via.placeholder.com/150x200?text=Parasite",
  },
];

const SearchResultsPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchTerm = queryParams.get('q') || '';
  const genre = queryParams.get('genre') || '';

  const [sortBy, setSortBy] = useState('popular');
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    // This would be a real API call in production
    // Example: `/api/recommendations?q=${searchTerm}&genre=${genre}&sort=${sortBy}`
    setRecommendations(mockRecommendations); // Replace with actual fetch
  }, [searchTerm, genre, sortBy]);

  const handleSortChange = (e) => setSortBy(e.target.value);

  return (
    <div className="search-results-page">
      <Header />
      <div className="results-header">
        <h2>
          {searchTerm
            ? `Search results for: "${searchTerm}"`
            : `Recommendations by genre: "${genre}"`}
        </h2>
        <label>
          Sort by:&nbsp;
          <select value={sortBy} onChange={handleSortChange}>
            <option value="popular">Popular</option>
            <option value="recent">Recent</option>
          </select>
        </label>
      </div>

      <div className="recommendations-grid">
        {recommendations.length > 0 ? (
          recommendations.map((rec) => (
            <div className="recommendation-card" key={rec.id}>
              <img src={rec.image} alt={rec.title} />
              <div className="card-content">
                <h3>{rec.title}</h3>
                <p>⭐ {rec.rating} / 5</p>
              </div>
            </div>
          ))
        ) : (
          <p>No results found.</p>
        )}
      </div>
    </div>
  );
};

export default SearchResultsPage;
