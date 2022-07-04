const { body } = require('express-validator');

class ImageValidation {
  commentsValidation() {
    return [
      body('comment')
        .isString()
        .withMessage('Campo "Comentário" é obrigatório')
        .isLength({ max: 500 })
        .withMessage('Comentário deve conter no máximo 500 caracteres'),

    ];
  }
}

module.exports = new ImageValidation();
