const express = require("express");
const router = express.Router();
const peminjamanController = require("../controllers/peminjaman.controller");
const { verifyToken, isAdmin } = require("../middleware/auth.middleware");
const { validatePeminjaman } = require("../middleware/validation.middleware");

// Protected routes (requires authentication)
router.post("/", [verifyToken, validatePeminjaman], peminjamanController.create);
router.get("/", [verifyToken], peminjamanController.findAll);
router.get("/:id", [verifyToken], peminjamanController.findOne);
router.put("/:id/return", [verifyToken], peminjamanController.returnBook);

module.exports = router;
