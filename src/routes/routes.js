const express = require('express');
const User = require('../controllers/userController');
const Photo = require('../controllers/photoController');
const Validate = require('../middlewares/handleValidation');
const userValidation = require('../middlewares/userValidation');
const { profileImageUpload, imagesUpload } = require('../middlewares/imageUpload');
const { commentsValidation } = require('../middlewares/imageValidation');
const Auth = require('../middlewares/auth');

const { validator } = Validate;
const router = express.Router();

// User
router.post('/register', userValidation.createValidation(), validator, User.register);
router.post('/login', userValidation.loginValidation(), validator, User.login);
router.get('/profile', Auth, User.getCurrentUser);
router.get('/user/:id', User.getUserById);
router.get('/user/image/:image', User.getUserProfileImage);
router.put('/user', Auth, userValidation.updateValidation(), validator, profileImageUpload.single('profileImage'), User.update);

// Photos
router.get('/', Photo.getAll); // Get current user all photos
router.get('/images/search', Auth, Photo.getPhotoByQuery);
router.get('/images/:id', Photo.getPhotoById);
router.get('/user/images/:id', Photo.getUserAllPhotos);
router.get('/images', Photo.getAll);
router.put('/like/:id', Auth, Photo.likeFunctionality);
router.put('/comment/:id', Auth, commentsValidation(), validator, Photo.commentFunctionlity);
router.put('/images/:id', Auth, Photo.updatePhoto);
router.post('/image', Auth, imagesUpload.single('image'), Photo.create);
router.delete('/images/:id', Auth, Photo.delete);
module.exports = router;
