// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import HomePage from './pages/HomePage';
import CreateRecommendationPage from './pages/CreateRecommendationPage';
import Login from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Recommendation from './pages/RecommendationPage';
import Profile from './pages/ProfilePage';
import SearchResultsPage from './pages/SearchResultsPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/create" element={<CreateRecommendationPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/recommendation" element={<Recommendation />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/search" element={<SearchResultsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
