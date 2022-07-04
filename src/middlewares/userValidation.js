const { body } = require('express-validator');

class UserValidation {
  createValidation() {
    return [
      body('name')
        .isString()
        .withMessage('Campo "nome" é Obrigatório')
        .isLength({ min: 3 })
        .withMessage('Nome precisa ter no mínimo três caracteres'),
      body('email')
        .isString()
        .withMessage('Campo "email" é obrigatório')
        .isEmail()
        .withMessage('Email inválido'),
      body('password')
        .isString()
        .withMessage('Campo "senha" é obrigatório')
        .isLength({ min: 6 })
        .withMessage('Senha precisa ter no minímo 6 caracteres'),
      body('confirmPassword')
        .isString()
        .withMessage('Campo "Confirme a senha" é obrigatório')
        .custom((value, { req }) => {
          if (value !== req.body.password) throw new Error('As senhas são diferentes');
          return true;
        }),
    ];
  }

  loginValidation() {
    return [
      body('email')
        .isString()
        .withMessage('Campo "email" é obrigatório')
        .isEmail()
        .withMessage('Email inválido'),
      body('password')
        .isString()
        .withMessage('Campo "senha" é obrigatório'),

    ];
  }

  updateValidation() {
    return [
      body('name')
        .optional()
        .isLength({ min: 3 })
        .withMessage('Campo "Nome" deve conter no mínimo 3 caracteres'),
      body('password')
        .optional()
        .isLength({ min: 6 })
        .withMessage('Campo "Senha" deve ter conter  mínimo 6 caracteres'),
    ];
  }
}

module.exports = new UserValidation();
