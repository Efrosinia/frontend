import React, { useState } from 'react';

export default function Register() {
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Тут можна додати логіку для реєстрації, наприклад, API-запит
    // Поки що просто показуємо повідомлення
    if (newUsername && newPassword) {
      setMessage(`User ${newUsername} successfully registered!`);
      setNewUsername('');
      setNewPassword('');
    } else {
      setMessage('Please fill in both fields.');
    }
  };

  return (
    <div>
      <header>
        <h1>Register for RecomFilm</h1>
        <nav>
          <a href="index.html">Home</a> | <a href="login.html">Login</a>
        </nav>
      </header>

      <main>
        <section className="auth-container" style={{ maxWidth: '400px', margin: '20px auto' }}>
          <form id="registerForm" onSubmit={handleSubmit}>
            <label htmlFor="newUsername">Username:</label>
            <input
              type="text"
              id="newUsername"
              name="newUsername"
              required
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
            />
            <br /><br />

            <label htmlFor="newPassword">Password:</label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <br /><br />

            <input type="submit" value="Register" />
          </form>

          <p>
            Already have an account? <a href="login.html">Login here</a>.
          </p>

          <div id="registerMessage" className="auth-message" style={{ marginTop: '15px', color: 'green' }}>
            {message}
          </div>
        </section>
      </main>

      <footer style={{ textAlign: 'center', marginTop: '40px' }}>
        <p>&copy; 2025 RecomFilm – Film & Series Recommendations</p>
      </footer>
    </div>
  );
}
