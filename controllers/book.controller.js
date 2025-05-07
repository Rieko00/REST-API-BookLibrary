const db = require("../models");
const Book = db.books;
const Op = db.Sequelize.Op;

exports.create = async (req, res) => {
  try {
    const book = await Book.create(req.body);

    res.status(201).send(book);
  } catch (error) {
    res.status(500).send({
      message: error.message || "Some error occurred while   the book.",
    });
  }
};

exports.findAll = async (req, res) => {
  try {
    const { title, author, genre } = req.query;
    let condition = {};

    if (title) {
      condition.title = { [Op.like]: `%${title}%` };
    }

    if (author) {
      condition.author = { [Op.like]: `%${author}%` };
    }

    if (genre) {
      condition.genre = { [Op.like]: `%${genre}%` };
    }

    const books = await Book.findAll({ where: condition });
    res.send(books);
  } catch (error) {
    res.status(500).send({
      message: error.message || "Some error occurred while retrieving books.",
    });
  }
};

exports.findOne = async (req, res) => {
  try {
    const id = req.params.id;

    const book = await Book.findByPk(id);

    if (!book) {
      return res.status(404).send({
        message: `Book with id=${id} not found.`,
      });
    }

    res.send(book);
  } catch (error) {
    res.status(500).send({
      message: `Error retrieving book with id=${req.params.id}`,
    });
  }
};

// Update a book by the id
exports.update = async (req, res) => {
  try {
    const id = req.params.id;

    const num = await Book.update(req.body, {
      where: { id: id },
    });

    if (num[0] === 1) {
      res.send({
        message: "Book was updated successfully.",
      });
    } else {
      res.send({
        message: `Cannot update book with id=${id}. Book not found`,
      });
    }
  } catch (error) {
    res.status(500).send({
      message: `Error updating book with id=${req.params.id}`,
    });
  }
};

exports.delete = async (req, res) => {
  try {
    const id = req.params.id;

    const num = await Book.destroy({
      where: { id: id },
    });

    if (num === 1) {
      res.send({
        message: "Book deleted successfully!",
      });
    } else {
      res.send({
        message: `Book not found!`,
      });
    }
  } catch (error) {
    res.status(500).send({
      message: `Could not delete book with id=${req.params.id}`,
    });
  }
};
