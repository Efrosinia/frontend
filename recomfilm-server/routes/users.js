const express = require('express');
const router = express.Router();
const { getUserProfile, updateUserProfile } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');

// Налаштування multer (зберігання аватарів у папку uploads/avatars)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/avatars'); // створити цю папку вручну
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // унікальне ім'я файлу
  }
});

const upload = multer({ storage });

// Маршрут отримання профілю (без змін)
router.get('/profile', authMiddleware, getUserProfile);

// Маршрут оновлення профілю з підтримкою файлу (аватара)
router.put('/profile', authMiddleware, upload.single('avatar'), updateUserProfile);

module.exports = router;

