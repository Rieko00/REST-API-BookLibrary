module.exports = (sequelize, Sequelize) => {
  const Peminjaman = sequelize.define("peminjaman", {
    bookId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    userId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    tanggalPinjam: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW,
    },
    tanggalKembali: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    status: {
      type: Sequelize.ENUM("dipinjam", "dikembalikan"),
      defaultValue: "dipinjam",
      allowNull: false,
    },
  });

  return Peminjaman;
};
