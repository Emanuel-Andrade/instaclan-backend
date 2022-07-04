const jwt = require('jsonwebtoken');
const User = require('../models/User');

const jwtSecret = process.env.JWT_SECRET;

const auth = async (req, res, next) => {
  const bearer = req.headers.authorization;

  const token = bearer && bearer.split(' ')[1];
  if (!token) return res.status(401).json({ errors: ['Usuário não autorizado'] });

  try {
    const verified = jwt.verify(token, jwtSecret);
    req.user = await User.findById(verified.id).select('-password');

    return next();
  } catch (error) {
    return res.status(400).json({ errors: ['Token inválido'] });
  }
};

module.exports = auth;
