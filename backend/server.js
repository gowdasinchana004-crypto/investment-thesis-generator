let latestScores = null;
const express = require("express");
const multer = require("multer");
const cors = require("cors");

const app = express();
app.use(cors());

// file storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const PDFDocument = require("pdfkit");

app.get("/report", (req, res) => {
  if (!latestScores) {
    return res.send("No report available. Please upload a file first.");
  }

  const doc = new PDFDocument();

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "attachment; filename=Investment_Report.pdf");

  doc.pipe(res);

  // TITLE
  doc.fontSize(20).text("Investment Thesis Report", { align: "center" });
  doc.moveDown();

  // 👉 Calculate overall score
  const values = Object.values(latestScores);
  const overall = Math.round(
    values.reduce((a, b) => a + b, 0) / values.length * 10
  );

  // 👉 Recommendation logic
  let recommendation = "Pass";
  if (overall > 75) recommendation = "Strong Buy";
  else if (overall > 50) recommendation = "Hold";

  // SUMMARY
  doc.fontSize(14).text(`Recommendation: ${recommendation}`);
  doc.text(`Overall Score: ${overall}/100`);
  doc.moveDown();

  // CATEGORY SCORES
  doc.fontSize(16).text("Category Analysis");
  doc.moveDown(0.5);

  Object.entries(latestScores).forEach(([key, value]) => {
    doc.fontSize(12).text(`${key}: ${value}/10`);
  });

  doc.moveDown();

  // 👉 Generate strengths & weaknesses dynamically
  const strengths = [];
  const weaknesses = [];

  Object.entries(latestScores).forEach(([key, value]) => {
    if (value >= 7) strengths.push(`${key} is strong`);
    else if (value <= 4) weaknesses.push(`${key} needs improvement`);
  });

  // STRENGTHS
  doc.fontSize(16).text("Strengths");
  doc.moveDown(0.5);

  strengths.forEach(item => doc.fontSize(12).text("- " + item));

  doc.moveDown();

  // WEAKNESSES
  doc.fontSize(16).text("Weaknesses");
  doc.moveDown(0.5);

  weaknesses.forEach(item => doc.fontSize(12).text("- " + item));

  doc.end();
});

app.post("/upload", upload.single("file"), (req, res) => {
  console.log("Upload API hit");

  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const size = req.file.size;

  const random = () => Math.floor(Math.random() * 3);

  const scores = {
    Problem: (size % 10) + random(),
    Solution: (size % 9) + random(),
    Market: (size % 8) + random(),
    Business: (size % 7) + random(),
    Competition: (size % 6) + random(),
    Team: (size % 5) + random(),
    Traction: (size % 4) + random(),
    Financials: (size % 3) + random(),
    Presentation: (size % 2) + random()
  };

  // 👉 STORE SCORES
  latestScores = scores;

  console.log("Stored Scores:", scores);

  res.json({ scores });
});

app.get("/", (req, res) => {
  res.send("Backend is running");
});

app.get("/report", (req, res) => {
  res.send("Report generation coming soon");
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});