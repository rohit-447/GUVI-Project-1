const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

// DB Connection
const db = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "admin", 
  database: "studentdb",
  port: 3306
});

db.connect((err) => {
  if (err) {
    console.error(" DB connection failed:", err.message);
  } else {
    console.log(" Connected to MySQL");
  }
});

// Register Student API
app.post("/api/register", (req, res) => {
  const { name, email, phone, dob, course } = req.body;
  if (!name || !email || !phone || !dob || !course) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const sql = "INSERT INTO students (name, email, phone, dob, course) VALUES (?, ?, ?, ?, ?)";
  db.query(sql, [name, email, phone, dob, course], (err, result) => {
    if (err) {
      console.error("Error inserting student:", err);
      return res.status(500).json({ message: "Database error." });
    }
    res.status(200).json({ message: " Student registered successfully!" });
  });
});

// Check Student API
app.get("/api/check-student", (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ message: "Email is required." });

  const sql = "SELECT * FROM students WHERE email = ?";
  db.query(sql, [email], (err, results) => {
    if (err) {
      console.error("Error checking student:", err);
      return res.status(500).json({ message: "Database error." });
    }

    if (results.length > 0) {
      return res.status(200).json({ exists: true, student: results[0] });
    } else {
      return res.status(200).json({ exists: false });
    }
  });
});

app.listen(PORT, () => {
  console.log(` Server running at http://localhost:${PORT}`);
});
