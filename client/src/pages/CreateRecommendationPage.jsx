// src/pages/CreateRecommendationPage.jsx
import React, { useState, useEffect } from 'react';
import './CreateRecommendationPage.css';

const TMDB_API_KEY = '0f67bce088909b4a8bfe3f014e96fcee';

function MovieSearchWidget({ onMovieSelect, initialTitle = '', initialGenres = '' }) {
  const [query, setQuery] = useState(initialTitle);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [genres, setGenres] = useState(initialGenres);

  const fetchMovies = async (searchText) => {
    if (!searchText) {
      setSuggestions([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(searchText)}&language=en-US`);
      const data = await response.json();

      if (data.results && data.results.length > 0) {
        setSuggestions(data.results);
      } else {
        setSuggestions([]);
        setError('No movies found');
      }
    } catch {
      setError('Error fetching data');
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  const selectMovie = async (movie) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://api.themoviedb.org/3/movie/${movie.id}?api_key=${TMDB_API_KEY}&language=en-US`);
      const data = await response.json();
      setSelectedMovie(data);
      setQuery(data.title);
      setGenres(data.genres.map(g => g.name).join(', '));
      setSuggestions([]);
      if (onMovieSelect) onMovieSelect(data);
    } catch {
      setError('Error loading movie details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      fetchMovies(query);
    }, 500);

    return () => clearTimeout(handler);
  }, [query]);

  return (
    <div className="movie-search-widget">
      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setSelectedMovie(null);
          setError(null);
          if (onMovieSelect) onMovieSelect(null);
        }}
        disabled={loading}
        placeholder="Enter movie or series title..."
        autoComplete="off"
      />
      {loading && <div className="loader">Loading...</div>}
      {error && <div className="error">{error}</div>}

      {!loading && suggestions.length > 0 && (
        <ul className="suggestions-list">
          {suggestions.map(movie => (
            <li key={movie.id} onClick={() => selectMovie(movie)}>
              {movie.title} ({movie.release_date ? movie.release_date.slice(0, 4) : '—'})
            </li>
          ))}
        </ul>
      )}

      {selectedMovie && (
        <div className="movie-details">
          <img
            src={selectedMovie.poster_path ? `https://image.tmdb.org/t/p/w200${selectedMovie.poster_path}` : ''}
            alt={selectedMovie.title}
          />
          <div className="movie-info">
            <p><strong>Genres:</strong> {genres}</p>
          </div>
        </div>
      )}

      <input type="hidden" value={genres} readOnly />
    </div>
  );
}

function RecommendationBlock({ index, onMovieSelect }) {
  return (
    <div className="recommendation-block">
      <h3>Recommended Title #{index}</h3>
      <MovieSearchWidget onMovieSelect={onMovieSelect} />
      <label>Description:</label>
      <textarea name={`recommendation[${index}][description]`} rows="3" required />
      <label>Tags (optional):</label>
      <input type="text" name={`recommendation[${index}][tags]`} placeholder="#romance, #thriller" />
      <label>Upload Image (optional):</label>
      <input type="file" name={`recommendation[${index}][image]`} accept="image/*" />
    </div>
  );
}

export default function CreateRecommendationPage() {
  const [showGenres, setShowGenres] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const toggleGenres = () => setShowGenres(!showGenres);
  const toggleSearch = () => setShowSearch(!showSearch);

  const [baseDescription, setBaseDescription] = useState('');
  const [baseTags, setBaseTags] = useState('');
  const [recommendations, setRecommendations] = useState([1]);
  const [baseImage, setBaseImage] = useState(null);
  const [baseMovie, setBaseMovie] = useState(null);

  const addRecommendation = () => {
    setRecommendations(prev => [...prev, prev.length + 1]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Form submitted!');
  };

  return (
    <>
      <header className="header">
        <h1 className="title">RecomFilm – Platform for Film & Series Recommendations</h1>
        <nav className="navbar">
          <a href="/">Home</a>
          <a href="/create">Create Recommendation</a>
          <a href="/profile">Profile</a>
          <a href="/login" id="login-link">Login</a>
          <a href="/register" id="register-link">Register</a>
          <button id="logout-button" className="hidden">Logout</button>
          <button onClick={toggleGenres} className="toggle-btn">
            Genres {showGenres ? '▲' : '▼'}
          </button>
          <button onClick={toggleSearch} className="toggle-btn">
            {showSearch ? 'Search ✖' : 'Search 🔍'}
          </button>
        </nav>
        {showGenres && (
          <div id="genresPanel" className="panel">
            <fieldset>
              <legend>Genres</legend>
              {['Drama', 'Science Fiction', 'Comedy', 'Action', 'Thriller', 'Mystery', 'Romance', 'Horror', 'Fantasy'].map((genre) => (
                <label key={genre}>
                  <input type="checkbox" name="genre" value={genre} /> {genre}
                  <br />
                </label>
              ))}
            </fieldset>
          </div>
        )}
      </header>

      <main className="create-recommendation-page" style={{ fontFamily: 'Arial, sans-serif' }}>
        <div className="top-heading">
          <h1>Create a New Recommendation</h1>
        </div>

        <div className="form-container">
          {showSearch && (
            <section id="searchSection">
              <h2>Search</h2>
              <form>
                <label htmlFor="title">Title:</label>
                <input type="text" id="title" name="title" />
                <br /><br />
                <input type="submit" value="Search" />
              </form>
            </section>
          )}

          <form onSubmit={handleSubmit} encType="multipart/form-data" lang="en">
            <h2>Base Film or Series</h2>

            <label htmlFor="base-title">Title:</label>
            <MovieSearchWidget onMovieSelect={setBaseMovie} />

            <label htmlFor="base-description">Description (theme, genre, atmosphere, etc.):</label>
            <textarea
              id="base-description"
              name="base_description"
              rows={4}
              placeholder="Describe the common features..."
              required
              value={baseDescription}
              onChange={e => setBaseDescription(e.target.value)}
            />

            <label htmlFor="base-tags">Tags (optional):</label>
            <input
              type="text"
              id="base-tags"
              name="base_tags"
              placeholder="#firstlove, #drama, #action"
              value={baseTags}
              onChange={e => setBaseTags(e.target.value)}
            />

            <label htmlFor="base-image">Upload Image (optional):</label>
            <input
              type="file"
              id="base-image"
              name="base_image"
              accept="image/*"
              onChange={e => setBaseImage(e.target.files[0])}
            />

            <hr />

            <h2>Recommendations</h2>

            <div id="recommendations">
              {recommendations.map(index => (
                <RecommendationBlock key={index} index={index} onMovieSelect={() => {}} />
              ))}
            </div>

            <button type="button" className="add-btn" onClick={addRecommendation}>
              + Add Another Recommendation
            </button>

            <button type="submit" className="submit-btn">
              Submit Recommendation
            </button>
          </form>
        </div>
      </main>
    </>
  );
}