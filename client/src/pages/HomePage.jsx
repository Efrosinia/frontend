// src/pages/HomePage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';
import logo1 from '../assets/logo1.jpg';
import logo2 from '../assets/logo2.jpg';
import banner from '../assets/banner.jpg';
import genresMap from '../assets/genres_map.jpg';

const HomePage = () => {
  const [showGenres, setShowGenres] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const toggleGenres = () => setShowGenres(!showGenres);
  const toggleSearch = () => setShowSearch(!showSearch);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
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
                  <a href={`/search?genre=${encodeURIComponent(genre)}`} style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}>
                    {genre}
                  </a>
                  <br />
                </label>
              ))}
            </fieldset>
          </div>
        )}
      </header>

      <main className="main-content">
        <section className="float-left">
          <h2>Popular</h2>
          <table>
            <thead>
              <tr>
                <th>Collection Title</th>
                <th>User Rating</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Time Travel Stories</td>
                <td>⭐ 4.7 / 5</td>
              </tr>
              <tr>
                <td>If You Liked "Interstellar"</td>
                <td>⭐ 4.5 / 5</td>
              </tr>
              <tr>
                <td>Anime Classics</td>
                <td>⭐ 4.9 / 5</td>
              </tr>
            </tbody>
          </table>
        </section>

        {showSearch && (
          <section className="float-right" id="searchSection">
            <h2>Search</h2>
            <form onSubmit={handleSearchSubmit}>
              <label htmlFor="title">Title:</label>
              <input
                type="text"
                id="title"
                name="title"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
              <br /><br />
              <input type="submit" value="Search" />
            </form>
          </section>
        )}

        <section className="float-center">
          <h2>Recommendations</h2>
          <ul>
            <li><strong>Interstellar</strong> – Film, Science Fiction (2014)</li>
            <li><strong>The Dark Knight</strong> – Film, Action (2008)</li>
            <li><strong>Stranger Things</strong> – Series, Mystery/Thriller (2016–)</li>
            <li><strong>Parasite</strong> – Film, Thriller (2019)</li>
          </ul>
        </section>
      </main>

      <footer className="footer">
        <h3>Graphical Elements</h3>
        <p>Logos / Banners:</p>
        <ul className="logo-list">
          <li><img src={logo1} alt="Logo 1" width="100" /></li>
          <li><img src={logo2} alt="Logo 2" width="100" /></li>
          <li><img src={banner} alt="Banner" width="200" /></li>
        </ul>

        <p>Genre Map:</p>
        <img src={genresMap} alt="Genres" useMap="#genres" width="300" />
        <map name="genres">
          <area shape="rect" coords="0,0,150,150" href="/search?genre=Comedy" alt="Comedy" />
          <area shape="rect" coords="150,0,300,150" href="/search?genre=Drama" alt="Drama" />
        </map>

        <p>&copy; 2025 RecomFilm – Film & Series Recommendations</p>
      </footer>
    </>
  );
};

export default HomePage;

