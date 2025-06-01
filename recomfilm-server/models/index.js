const User = require('./User');
const Recommendation = require('./Recommendation');
const RecommendedMovie = require('./RecommendedMovie');

// Асоціації:
// Користувач може мати багато рекомендацій
User.hasMany(Recommendation, {
  foreignKey: 'author_id',
  as: 'recommendations',
});

Recommendation.belongsTo(User, {
  foreignKey: 'author_id',
  as: 'author',
});

// Recommendation має багато RecommendedMovie
Recommendation.hasMany(RecommendedMovie, {
  foreignKey: 'recommendation_id',
  as: 'recommendedMovies',
});

RecommendedMovie.belongsTo(Recommendation, {
  foreignKey: 'recommendation_id',
  as: 'recommendation',
});

module.exports = {
  User,
  Recommendation,
  RecommendedMovie,
};
