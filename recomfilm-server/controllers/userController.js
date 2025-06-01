const { User } = require('../models');

exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await User.findByPk(userId, {
      attributes: ['id', 'username', 'bio', 'reputation', 'profile_photo_path', 'registered_at'],
    });

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { username, bio } = req.body;  // беремо тільки текстові поля
    
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.username = username ?? user.username;
    user.bio = bio ?? user.bio;

    // multer додає файл в req.file, перевіряємо і оновлюємо шлях
    if (req.file) {
      user.profile_photo_path = '/uploads/avatars/' + req.file.filename;
    }

    await user.save();

    res.json({ message: 'Profile updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

