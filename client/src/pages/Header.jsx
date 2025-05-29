import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const [showGenres, setShowGenres] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
      setShowSearch(false); // сховати панель пошуку
    }
  };

  const handleGenreClick = (genre) => {
    navigate(`/search?genre=${encodeURIComponent(genre)}`);
    setShowGenres(false); // сховати панель жанрів
  };

  return (
    <header>
      <h1>RecomFilm – Platform for Film & Series Recommendations</h1>
      <nav>
        <a href="/">Home</a>
        <a href="/create">Create Recommendation</a>
        <a href="/profile">Profile</a>
        <a href="/login" id="login-link">Login</a>
        <a href="/register" id="register-link">Register</a>
        <button id="logout-button" style={{ display: 'none' }}>Logout</button>
        <button onClick={() => setShowGenres(!showGenres)}>
          Genres {showGenres ? '▲' : '▼'}
        </button>
        <button onClick={() => setShowSearch(!showSearch)}>
          {showSearch ? 'Search ✖' : 'Search 🔍'}
        </button>
      </nav>

      {showGenres && (
        <div id="genresPanel">
          <fieldset>
            <legend>Genres</legend>
            {['Drama', 'Science Fiction', 'Comedy', 'Action', 'Thriller', 'Mystery', 'Romance', 'Horror', 'Fantasy'].map((genre) => (
              <div key={genre}>
                <button
                  type="button"
                  onClick={() => handleGenreClick(genre)}
                  className="genre-button"
                >
                  {genre}
                </button>
              </div>
            ))}
          </fieldset>
        </div>
      )}

      {showSearch && (
        <section id="searchSection">
          <h2>Search</h2>
          <form onSubmit={handleSearchSubmit}>
            <label htmlFor="title">Title:</label>
            <input
              type="text"
              id="title"
              name="title"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <br /><br />
            <input type="submit" value="Search" />
          </form>
        </section>
      )}
    </header>
  );
}
