const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const fs = require('fs');

const app = express();
const PORT = 3001; // або інший, якщо 3000 зайнятий

// Middleware
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(bodyParser.json());
app.use(cookieParser());


const fs = require('fs');
const path = require('path');

// Файл для зберігання користувачів
const USERS_FILE = path.join(__dirname, 'users.json');

// Допоміжна функція: читає користувачів
function readUsers() {
  if (!fs.existsSync(USERS_FILE)) return {};
  return JSON.parse(fs.readFileSync(USERS_FILE));
}

// 🔐 Реєстрація
app.post('/register', (req, res) => {
  const { username, password } = req.body;
  const users = readUsers();

  if (users[username]) {
    return res.status(400).json({ message: 'User already exists' });
  }

  users[username] = { password };
  fs.writeFileSync(USERS_FILE, JSON.stringify(users));
  res.status(200).json({ message: 'Registration successful' });
});

// 🔑 Логін
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const users = readUsers();

  if (!users[username] || users[username].password !== password) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  res.cookie('user', username, { httpOnly: true });
  res.status(200).json({ message: 'Login successful' });
});

// 🚪 Вихід
app.post('/logout', (req, res) => {
  res.clearCookie('user');
  res.status(200).json({ message: 'Logged out' });
});


// Тестовий маршрут
app.get('/', (req, res) => {
  res.send('RecomFilm server is working!');
});

// Старт сервера
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});