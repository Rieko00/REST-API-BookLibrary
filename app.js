require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const swaggerUi = require("swagger-ui-express");
const fs = require("fs");
const yaml = require("js-yaml");

const app = express();

const db = require("./models");
const authRoutes = require("./routes/auth.routes");
const bookRoutes = require("./routes/book.routes");
const peminjamanRoute = require("./routes/peminjaman.routes");

// Load Swagger document
let swaggerDocument;
try {
  swaggerDocument = yaml.load(fs.readFileSync(path.join(__dirname, "./swagger.yaml"), "utf8"));
} catch (error) {
  console.error("Error loading swagger.yaml:", error);
  swaggerDocument = {};
}

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/Views/landing.html"));
});
// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument, { explorer: true }));
app.get("/api-docs", (req, res) => {
  res.sendFile(path.join(__dirname, "/docs/index.html"));
});

app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/pinjam", peminjamanRoute);

// Setup for both local development and Vercel
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
    console.log(`Swagger documentation available at http://localhost:${PORT}/api-docs`);
  });
}

// Connect to database
db.sequelize
  .sync()
  .then(() => {
    console.log("Database synchronized successfully.");
  })
  .catch((err) => {
    console.error("Failed to sync database:", err.message);
  });

// Export for Vercel
module.exports = app;
