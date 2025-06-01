import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setMessage('Please enter username and password');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setMessage(errorData.message || 'Login failed');
        return;
      }

      const data = await response.json();
      setMessage('Login successful! Redirecting...');
      localStorage.setItem('token', data.token);

      setTimeout(() => {
        navigate('/');
      }, 1000);

    } catch (error) {
      setMessage('Network error. Try again later.');
      console.error(error);
    }
  };

  return (
    <>
      <header>
        <h1>Login to RecomFilm</h1>
        <nav>
          <a href="/">Home</a>
          <a href="/register">Register</a>
        </nav>
      </header>

      <main>
        <section className="auth-container">
          <form id="loginForm" onSubmit={handleSubmit}>
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              name="username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <br /><br />

            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <br /><br />

            <input type="submit" value="Login" />
          </form>

          <p>
            Don't have an account? <a href="/register">Register here</a>.
          </p>
          <div id="loginMessage" className="auth-message">{message}</div>
        </section>
      </main>

      <footer>
        <p>&copy; 2025 RecomFilm – Film & Series Recommendations</p>
      </footer>
    </>
  );
}
