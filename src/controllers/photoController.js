const mongoose = require('mongoose');
const Photos = require('../models/Photos');
const User = require('../models/User');

class Photo {
  async getAll(req, res) {
    const photos = await Photos.find({}).sort([['createdAt', -1]]).exec();

    res.json(photos);
  }

  async getUserAllPhotos(req, res) {
    const { id } = req.params;
    const photos = await Photos.find({ userId: id }).sort({ createdAt: 'desc' });

    res.json(photos);
  }

  async getPhotoById(req, res) {
    const { id } = req.params;

    try {
      const photo = await Photos.findById(id);
      if (!photo) return res.status(404).json({ erros: ['Foto não encontradada'] });

      return res.json(photo);
    } catch (error) {
      return res.status(400).json({ erros: ['Foto não encontrada'] });
    }
  }

  async getPhotoByQuery(req, res) {
    const { q } = req.query;

    try {
      const photo = await Photos.find({ title: new RegExp(q, 'i') });
      if (photo.length === 0) return res.status(404).json({ errors: ['Nenhuma foto encotrada'] });

      return res.json(photo);
    } catch (error) {
      return res.status(400).json({ errors: ['Foto não encontrada'] });
    }
  }

  async updatePhoto(req, res) {
    const { id } = req.params;
    const { title } = req.body;
    const userId = req.user.id;
    try {
      const photo = await Photos.findById(id);
      if (!photo) return res.status(404).json({ errors: ['Foto não encontrada'] });
      if (title.length > 50) return res.status(404).json({ errors: ['Título não pode conter mais de 50 caracteres'] });
      if (!photo.userId.equals(userId)) return res.status(400).json({ errors: ['Apenas o dono da foto pode atualiza-la'] });

      photo.title = title;
      await photo.save();

      return res.json(photo);
    } catch (error) {
      return res.status(400).json({ errors: ['Foto nao encotrada'] });
    }
  }

  async create(req, res) {
    const { title } = req.body;
    if (!req.file) return res.status(400).json({ errors: ['Foto não enviada'] });

    if (!req.file.originalname.match(/\.(png|jpg)$/)) return res.status(400).json({ errors: ['Enviar fotos apenas nos formatos png/jpg'] });
    const image = req.file.filename;

    const user = await User.findById(mongoose.Types.ObjectId(req.user.id)).select('-password');
    if (!user) return res.status(400).json({ errors: ['Não foi encontrado usuário'] });

    const newPhoto = await Photos.create({
      image,
      title,
      userId: user._id,
      userName: user.name,
    });
    if (!newPhoto) return res.status(500).json({ errors: ['Houve um problema por favor tente mais tarde'] });
    return res.json(newPhoto);
  }

  async delete(req, res) {
    const { id } = req.params;
    const { _id: userId } = req.user;
    if (!id) return res.status(404).json({ errors: ['Foto não encontrada'] });

    try {
      const photo = await Photos.findById(mongoose.Types.ObjectId(id));
      if (!photo) return res.status(404).json({ errors: ['Foto não encontrada'] });

      if (!photo.userId.equals(req.user.id)) return res.status(400).json({ errors: ['Apenas o dono da foto pode exclui-la'] });
      await Photos.findByIdAndRemove(photo._id);
      const photos = await Photos.find({ userId });
      const leftPhotos = photos.filter((eachPhoto) => eachPhoto._id !== id);
      return res.json(leftPhotos);
    } catch (error) {
      return res.status(400).json({ errors: ['Houve um erro por favor tente mais tarde'] });
    }
  }

  async likeFunctionality(req, res) {
    const { id } = req.params;
    const { user } = req;

    try {
      const photo = await Photos.findById(id);
      const likesArray = [...photo.likes];

      if (photo.likes.includes(user.id)) {
        photo.likes.filter((like) => {
          if (like === user.id) likesArray.pop();
          return likesArray;
        });
        photo.likes = [...likesArray];
        await photo.save();
        return res.json(photo);
      }

      likesArray.push(user.id);
      photo.likes = [...likesArray];
      await photo.save();

      return res.json(photo);
    } catch (error) {
      return res.status(500).json({ erros: ['Foto nao encotrada'] });
    }
  }

  async commentFunctionlity(req, res) {
    const { id } = req.params;
    const { comment } = req.body;
    const { user } = req;

    try {
      const photo = await Photos.findById(id);

      if (!photo) return res.status(404).json({ errors: ['Foto não encontrada'] });
      if (!comment) return res.status(404).json({ errors: ['Comentário não enviado'] });

      photo.comments.push({
        userId: user.id, userName: user.name, userProfile: user.profileImage, comment,
      });
      await photo.save();

      return res.json(photo);
    } catch (error) {
      return res.status(400).json({ erros: ['Foto nao encotrada'] });
    }
  }
}
module.exports = new Photo();
