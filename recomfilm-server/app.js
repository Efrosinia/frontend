const express = require('express');
const cors = require('cors');
const sequelize = require('./config/db');
require('dotenv').config();
const path = require('path');

const app = express();

// Налаштування CORS
app.use(cors({
  origin: 'http://localhost:3000',  // адреса твого React-фронтенду
  credentials: true
}));

// Для парсингу application/json
app.use(express.json());

// Для парсингу application/x-www-form-urlencoded (корисно при формі)
app.use(express.urlencoded({ extended: true }));

// Статична роздача файлів аватарок з папки uploads/avatars
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Підключення маршрутів
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/recommendations', require('./routes/recommendations'));

// Запуск сервера після синхронізації з базою
const PORT = process.env.PORT || 5000;
sequelize.sync()
  .then(() => {
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
  })
  .catch((err) => {
    console.error('Error syncing database:', err);
  });

