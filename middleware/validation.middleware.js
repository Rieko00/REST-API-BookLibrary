const Joi = require("joi");

// User validation schemas
const registerSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  fullName: Joi.string().min(3).max(50).required(),
  role: Joi.string().valid("user", "admin").default("user"),
});

const loginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

// Book validation schema
const bookSchema = Joi.object({
  title: Joi.string().min(1).max(100).required(),
  author: Joi.string().min(2).max(100).required(),
  isbn: Joi.string().min(10).max(13).required(),
  publicationYear: Joi.number().integer().min(1000).max(new Date().getFullYear()),
  publisher: Joi.string().max(100),
  genre: Joi.string().max(50),
  totalStok: Joi.number().integer().min(1).default(1),
  sisaStok: Joi.number().integer().min(0),
  tersedia: Joi.boolean().default(true),
});

// Peminjaman validation schema
const peminjamanSchema = Joi.object({
  bookId: Joi.number().integer().required(),
  userId: Joi.number().integer(),
  tanggalPinjam: Joi.date().default(new Date()),
  tanggalKembali: Joi.date(),
  status: Joi.string().valid("dipinjam", "dikembalikan"),
});

// Validation middleware
const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: "Validation failed",
        error: error.details[0].message,
      });
    }
    next();
  };
};

module.exports = {
  validateRegister: validateRequest(registerSchema),
  validateLogin: validateRequest(loginSchema),
  validateBook: validateRequest(bookSchema),
  validatePeminjaman: validateRequest(peminjamanSchema),
};
