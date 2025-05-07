const db = require("../models");
const Peminjaman = db.peminjaman;
const Book = db.books;
const User = db.users;
const Op = db.Sequelize.Op;

exports.create = async (req, res) => {
  try {
    const book = await Book.findByPk(req.body.bookId);

    if (!book) {
      return res.status(404).send({ message: "Book not found!" });
    }

    if (book.sisaStok <= 0) {
      return res.status(400).send({ message: "Book is not available for borrowing!" });
    }
    const userId = req.body.userId || req.userId;

    const peminjaman = await Peminjaman.create({
      ...req.body,
      userId: userId,
      tanggalPinjam: new Date(),
      status: "dipinjam",
    });

    await Book.update(
      {
        sisaStok: book.sisaStok - 1,
        tersedia: book.sisaStok - 1 > 0,
      },
      { where: { id: req.body.bookId } }
    );

    res.status(201).send(peminjaman);
  } catch (error) {
    res.status(500).send({
      message: error.message || "Some error occurred while creating the borrowing record.",
    });
  }
};

exports.findAll = async (req, res) => {
  try {
    const { userId, bookId, status } = req.query;
    let condition = {};

    if (userId) {
      condition.userId = userId;
    }

    if (bookId) {
      condition.bookId = bookId;
    }

    if (status) {
      condition.status = status;
    }

    const peminjamans = await Peminjaman.findAll({
      where: condition,
      include: [
        {
          model: Book,
          as: "book",
        },
        {
          model: User,
          as: "user",
          attributes: ["id", "username", "fullName", "email"],
        },
      ],
    });

    res.send(peminjamans);
  } catch (error) {
    res.status(500).send({
      message: error.message || "Some error occurred while retrieving peminjaman.",
    });
  }
};

exports.findOne = async (req, res) => {
  const id = req.params.id;

  try {
    const peminjaman = await Peminjaman.findByPk(id, {
      include: [
        {
          model: Book,
          as: "book",
        },
        {
          model: User,
          as: "user",
          attributes: ["id", "username", "fullName", "email"],
        },
      ],
    });

    if (!peminjaman) {
      return res.status(404).send({
        message: `Peminjaman with id=${id} not found.`,
      });
    }

    res.send(peminjaman);
  } catch (error) {
    res.status(500).send({
      message: `Error retrieving Peminjaman with id=${id}`,
    });
  }
};

exports.returnBook = async (req, res) => {
  const id = req.params.id;

  try {
    const peminjaman = await Peminjaman.findByPk(id);

    if (!peminjaman) {
      return res.status(404).send({
        message: `Peminjaman with id=${id} not found.`,
      });
    }

    if (peminjaman.status === "dikembalikan") {
      return res.status(400).send({
        message: `Book has already been returned.`,
      });
    }

    await Peminjaman.update(
      {
        tanggalKembali: new Date(),
        status: "dikembalikan",
      },
      { where: { id: id } }
    );

    const book = await Book.findByPk(peminjaman.bookId);
    await Book.update(
      {
        sisaStok: book.sisaStok + 1,
        tersedia: true,
      },
      { where: { id: peminjaman.bookId } }
    );

    res.send({
      message: `Book returned successfully.`,
    });
  } catch (error) {
    res.status(500).send({
      message: `Error returning book: ${error.message}`,
    });
  }
};
