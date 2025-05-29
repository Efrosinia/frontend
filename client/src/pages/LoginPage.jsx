import React, { useState } from 'react';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Приклад простої валідації або виклик API для логіну
    if (username && password) {
      // Тут можна додати логіку звернення до сервера
      setMessage(`Logged in as ${username}`); // тимчасове повідомлення
    } else {
      setMessage('Please enter username and password');
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
