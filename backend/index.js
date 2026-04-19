const express = require("express");
const multer = require("multer");
const { exec } = require("child_process");

const app = express();

const upload = multer({ dest: "uploads/" });

app.post("/upload", upload.single("file"), (req, res) => {
  const filePath = req.file.path;

  exec(`python analyze.py ${filePath}`, (error, stdout, stderr) => {
    if (error) {
      return res.send("Error processing file");
    }

    console.log(stdout);
    res.send(stdout); // sends extracted text
  });
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});