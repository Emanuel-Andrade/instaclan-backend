const { validationResult } = require('express-validator');

class Validation {
  validator(req, res, next) {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    const extractedErros = [];

    errors.array().map((err) => extractedErros.push(err.msg));

    return res.status(400).json({ errors: extractedErros });
  }
}

module.exports = new Validation();
