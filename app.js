require("dotenv").config();
const express = require("express");
const cors = require("cors");

const swaggerUi = require("swagger-ui-express");
const fs = require("fs");
const yaml = require("js-yaml");

const app = express();

const db = require("./models");
const authRoutes = require("./routes/auth.routes");
const bookRoutes = require("./routes/book.routes");
const peminjamanRoute = require("./routes/peminjaman.routes");
const exp = require("constants");

// Load Swagger document
const swaggerDocument = yaml.load(fs.readFileSync("./swagger.yaml", "utf8"));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  express.static("views/landing.html");
  res.sendFile(__dirname + "/views/landing.html");
});
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument, { explorer: true }));

app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/pinjam", peminjamanRoute);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
  console.log(`Swagger documentation available at http://localhost:${PORT}/api-docs`);
});

db.sequelize
  .sync()
  .then(() => {
    console.log("Database synchronized successfully.");
  })
  .catch((err) => {
    console.error("Failed to sync database:", err.message);
  });
