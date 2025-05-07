const jwt = require("jsonwebtoken");
const db = require("../models");
const User = db.users;

const verifyToken = (req, res, next) => {
  const token = req.headers["x-access-token"] || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(403).send({ message: "No token provided!" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Unauthorized!", error: err.message });
    }
    req.userId = decoded.id;
    next();
  });
};

const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId);

    if (user.role === "admin") {
      next();
      return;
    }

    res.status(403).send({ message: "Require Admin Role!" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

module.exports = {
  verifyToken,
  isAdmin,
};
