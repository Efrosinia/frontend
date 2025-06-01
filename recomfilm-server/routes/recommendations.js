const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { User, Recommendation, RecommendedMovie } = require('../models');
const authMiddleware = require('../middleware/authMiddleware');  // Підключаємо middleware

// Налаштування зберігання зображень
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '..', 'uploads', 'recommendations');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname.replace(/\s/g, '_'));
  }
});

const upload = multer({ storage });

router.post(
  '/',
  authMiddleware, // Додаємо перевірку авторизації перед обробником
  upload.fields([
    { name: 'base_image', maxCount: 1 },
    { name: 'recommendations[0][image]' },
    { name: 'recommendations[1][image]' },
    { name: 'recommendations[2][image]' },
  ]),
  async (req, res) => {
    try {
      const {
        base_movie,         // відповідає полю recommendations.base_movie
        base_tmdb_id,       // можна використовувати для логіки, але в БД його немає, якщо не використовуєте — можна прибрати
        base_genres,        // додатково, якщо хочете зберігати, але в БД цього немає
        base_description,   // відповідає recommendations.explanation
        base_tags,          // немає в таблиці recommendations, можна пропустити або додати поле в БД
      } = req.body;

      const baseImageFile = req.files['base_image']?.[0];

      // Встановлюємо author_id з токена
      const authorId = req.user.userId;

      // Створюємо основну рекомендацію, використовуючи імена стовпців бази:
      const recommendation = await Recommendation.create({
        author_id: authorId,
        base_movie: base_movie,             // назва базового фільму
        explanation: base_description,      // пояснення
        // overall_rating можна не вказувати, він має дефолт 0
        // created_at — автоматично
        // Зображення у вас в таблиці recommendations немає — якщо треба, додавайте окремо чи інакше
      });

      // Створюємо рекомендовані фільми
      const recommended = [];

      for (let i = 0; ; i++) {
        if (!req.body[`recommendations[${i}][title]`]) break;

        const title = req.body[`recommendations[${i}][title]`];
        // Якщо є поля tmdb_id, genres, tags — їх у таблицях немає, пропускаємо або додаємо у модель і БД
        const description = req.body[`recommendations[${i}][description]`];
        const imageFile = req.files[`recommendations[${i}][image]`]?.[0];

        const movie = await RecommendedMovie.create({
          recommendation_id: recommendation.id,
          movie_name: title,
          movie_photo: imageFile ? path.join('uploads', 'recommendations', path.basename(imageFile.path)) : null,
          description: description || '',
          likes: 0,
          dislikes: 0,
        });

        recommended.push(movie);
      }

      return res.status(201).json({
        message: 'Recommendation saved successfully',
        recommendation,
        recommended
      });
    } catch (err) {
      console.error('Error saving recommendation:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
);

module.exports = router;

