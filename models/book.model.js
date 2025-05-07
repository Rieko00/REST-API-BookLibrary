module.exports = (sequelize, Sequelize) => {
  const Book = sequelize.define("book", {
    title: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    author: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    isbn: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    publicationYear: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    publisher: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    genre: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    tersedia: {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
    },
    totalStok: {
      type: Sequelize.INTEGER,
      defaultValue: 1,
    },
    sisaStok: {
      type: Sequelize.INTEGER,
      defaultValue: 1,
    },
  });

  return Book;
};
