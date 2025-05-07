const express = require("express");
const router = express.Router();
const bookController = require("../controllers/book.controller");
const { verifyToken, isAdmin } = require("../middleware/auth.middleware");
const { validateBook } = require("../middleware/validation.middleware");

// Public routes
router.get("/", bookController.findAll);
router.get("/:id", bookController.findOne);

// Protected routes (requires authentication)
router.post("/", [verifyToken, isAdmin, validateBook], bookController.create);
router.put("/:id", [verifyToken, isAdmin, validateBook], bookController.update);
router.delete("/:id", [verifyToken, isAdmin], bookController.delete);

module.exports = router;
