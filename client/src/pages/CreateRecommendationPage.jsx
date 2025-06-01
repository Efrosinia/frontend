// src/pages/CreateRecommendationPage.jsx
import React, { useState } from 'react';
import './CreateRecommendationPage.css';

const TMDB_API_KEY = '0f67bce088909b4a8bfe3f014e96fcee';

function MovieSearchWidget({ onMovieSelect }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [genres, setGenres] = useState('');

  const fetchMovies = async (searchText) => {
    if (!searchText) return;
    setLoading(true);
    try {
      const res = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(searchText)}`);
      const data = await res.json();
      setSuggestions(data.results || []);
    } catch (err) {
      console.error('Error fetching movie suggestions');
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = async (movie) => {
    setQuery(movie.title);
    setSuggestions([]);
    setLoading(true);
    try {
      const res = await fetch(`https://api.themoviedb.org/3/movie/${movie.id}?api_key=${TMDB_API_KEY}`);
      const data = await res.json();
      setSelectedMovie(data);
      setGenres(data.genres.map(g => g.name).join(', '));
      onMovieSelect({
        id: data.id,
        title: data.title,
        genres: data.genres.map(g => g.name),
        posterPath: data.poster_path,
      });
    } catch (err) {
      console.error('Error loading movie details');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="movie-search-widget">
      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setSelectedMovie(null);
          onMovieSelect(null);
          fetchMovies(e.target.value);
        }}
        placeholder="Enter movie title..."
      />
      {loading && <div className="loader">Loading...</div>}
      {suggestions.length > 0 && (
        <ul className="suggestions-list">
          {suggestions.map(movie => (
            <li key={movie.id} onClick={() => handleSelect(movie)}>
              {movie.title} ({movie.release_date?.slice(0, 4) || '—'})
            </li>
          ))}
        </ul>
      )}
      {selectedMovie && (
        <div className="movie-details">
          <img src={`https://image.tmdb.org/t/p/w200${selectedMovie.poster_path}`} alt={selectedMovie.title} />
          <p><strong>Genres:</strong> {genres}</p>
        </div>
      )}
    </div>
  );
}

function RecommendationBlock({ index, onMovieSelect, onDataChange }) {
  const [movieData, setMovieData] = useState(null);
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);

  const handleMovieSelect = (movie) => {
    setMovieData(movie);
    onMovieSelect(index, movie);
  };

  const handleChange = () => {
    onDataChange(index, { description, image });
  };

  return (
    <div className="recommendation-block">
      <h3>Recommended Movie #{index + 1}</h3>
      <MovieSearchWidget onMovieSelect={handleMovieSelect} />
      <label>Description:</label>
      <textarea rows="3" value={description} onChange={(e) => { setDescription(e.target.value); handleChange(); }} />
      <label>Upload Image (optional):</label>
      <input type="file" accept="image/*" onChange={(e) => { setImage(e.target.files[0]); handleChange(); }} />
    </div>
  );
}

export default function CreateRecommendationPage() {
  const [baseMovie, setBaseMovie] = useState(null);
  const [explanation, setExplanation] = useState('');
  const [recommendationBlocks, setRecommendationBlocks] = useState([{ id: 0, movie: null, data: {} }]);

  const addRecommendationBlock = () => {
    setRecommendationBlocks(prev => [...prev, { id: prev.length, movie: null, data: {} }]);
  };

  const handleBlockMovieSelect = (index, movie) => {
    setRecommendationBlocks(prev => {
      const updated = [...prev];
      updated[index].movie = movie;
      return updated;
    });
  };

  const handleBlockDataChange = (index, data) => {
    setRecommendationBlocks(prev => {
      const updated = [...prev];
      updated[index].data = data;
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!baseMovie) {
      alert('Please select a base movie.');
      return;
    }

    const formData = new FormData();

    // Назва базового фільму у полі base_movie
    formData.append('base_movie', baseMovie.title);
    // Пояснення (explanation)
    formData.append('explanation', explanation);

    recommendationBlocks.forEach((block, idx) => {
      if (!block.movie) return;

      // Поля для таблиці recommendedmovies
      formData.append(`recommendedmovies[${idx}][movie_name]`, block.movie.title);

      if (block.data.description) {
        formData.append(`recommendedmovies[${idx}][description]`, block.data.description);
      } else {
        formData.append(`recommendedmovies[${idx}][description]`, '');
      }

      if (block.data.image) {
        formData.append(`recommendedmovies[${idx}][movie_photo]`, block.data.image);
      }
    });

    try {
      const token = localStorage.getItem('token'); // Отримуємо токен з локального сховища

      const res = await fetch('http://localhost:5000/api/recommendations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          // 'Content-Type' не встановлюємо для FormData
        },
        body: formData,
      });

      if (res.ok) {
        alert('Recommendation submitted successfully!');
        // Тут можна почистити форму, якщо потрібно
      } else {
        const errText = await res.text();
        alert('Submission failed: ' + errText);
      }
    } catch (err) {
      console.error('Error submitting recommendation:', err);
      alert('Error submitting recommendation');
    }
  };

  return (
    <main className="create-recommendation-page">
      <h1>Create a New Recommendation</h1>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <h2>Base Film or Series</h2>
        <MovieSearchWidget onMovieSelect={setBaseMovie} />
        <label>Description / Explanation:</label>
        <textarea
          value={explanation}
          onChange={(e) => setExplanation(e.target.value)}
          required
          placeholder="Why do you recommend this base movie?"
        />

        <h2>Recommended Movies</h2>
        {recommendationBlocks.map((block, index) => (
          <RecommendationBlock
            key={block.id}
            index={index}
            onMovieSelect={handleBlockMovieSelect}
            onDataChange={handleBlockDataChange}
          />
        ))}
        <button type="button" onClick={addRecommendationBlock}>+ Add Another Recommendation</button>

        <button type="submit">Submit Recommendation</button>
      </form>
    </main>
  );
}
