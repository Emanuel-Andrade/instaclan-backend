const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('../models/User');

const jwtSecret = process.env.JWT_SECRET;

class UserController {
  async register(req, res) {
    const {
      name, email, password,
    } = req.body;

    // check if email already exist
    const user = await User.findOne({ email });
    if (user) return res.status(400).json({ errors: ['Email já cadastrado'] });

    // create password-hash
    const hash = bcrypt.hashSync(password, 8);

    const newUser = await User.create({ name, email, password: hash });

    if (!newUser) return res.status(500).json({ erros: ['Houve um problema, por favor tentar mais tarde'] });

    const generateToken = (id) => jwt.sign({ id }, jwtSecret, {
      expiresIn: '7d',
    });
    const token = generateToken(newUser._id);
    return res.json({
      _id: newUser._id,
      token,
    });
  }

  async login(req, res) {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ errors: ['Email não cadastrado'] });

    if (!bcrypt.compareSync(password, user.password)) return res.status(400).json({ errors: ['Senha incorreta'] });

    const generateToken = (id) => jwt.sign({ id }, jwtSecret, {
      expiresIn: '7d',
    });
    const token = generateToken(user._id);
    return res.json({
      _id: user._id,
      token,
      profileImage: user.profileImage,
    });
  }

  getCurrentUser(req, res) {
    const user = req.user;
    res.json(user);
  }

  async getUserProfileImage(req, res) {
    const { image } = req.params;

    try {
      const photo = await User.findOne({ profileImage: image }).select('profileImage');

      if (!photo) return res.status(404).json({ erros: ['Foto não encontrada'] });

      return res.json(photo.profileImage);
    } catch (error) {
      return res.status(500).json({ errors: ['Ocorreu um erro por favor tente mais tarde'] });
    }
  }

  async update(req, res) {
    const {
      name, password, bio,
    } = req.body;
    let hash;
    let profileImage = null;

    const user = await User.findById(mongoose.Types.ObjectId(req.user._id)).select('-password');

    if (password) bcrypt.hashSync(password, 8);
    if (req.file) profileImage = req.file.filename;
    if (req.file && !req.file.originalname.match(/\.(png|jpg)$/)) return res.status(400).json({ errors: ['Enviar fotos apenas nos formatos png/jpg'] });
    if (name) user.name = name;
    if (bio) user.bio = bio;
    if (profileImage) user.profileImage = profileImage;
    if (password) user.password = hash;

    await user.save();
    return res.json(user);
  }

  async getUserById(req, res) {
    const { id } = req.params;

    try {
      const user = await User.findById(mongoose.Types.ObjectId(id)).select('-password');
      if (!user) return res.status(404).json({ errors: ['usuário não encontrado'] });
      return res.json(user);
    } catch (error) {
      return res.status(404).json({ errors: ['usuário não encontrado'] });
    }
  }
}

module.exports = new UserController();
