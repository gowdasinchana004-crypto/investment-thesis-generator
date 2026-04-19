const express = require("express");
const multer = require("multer");
const cors = require("cors");

const app = express();
app.use(cors());

// File upload setup
const upload = multer({ dest: "uploads/" });

// Test route
app.get("/", (req, res) => {
  res.send("Backend is running");
});

// Upload route
app.post("/upload", upload.single("file"), (req, res) => {
  console.log(req.file);
  res.send("File uploaded successfully");
});

// Start server
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});