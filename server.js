const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// console.log("PASS:", process.env.DB_PASS)
// kết nối MySQL
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  // password: "123456",
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});

db.connect(err => {
  if (err) throw err;
  console.log("MySQL connected");
});

// GET: lấy comment
app.get("/comments", (req, res) => {
  console.log("API called");
  db.query(
    "SELECT * FROM comments ORDER BY id DESC",
    (err, result) => {
      if (err) throw err;
      res.json(result);
      console.log(result);
    }
  );
});

// POST: gửi comment
app.post("/comments", (req, res) => {
  const { username, content } = req.body;

  if (!username || !content) {
    return res.json({ error: "Thiếu dữ liệu" });
  }

  db.query(
    "INSERT INTO comments (username, content) VALUES (?, ?)",
    [username, content],
    (err) => {
      if (err) throw err;
      res.json({ ok: true });
    }
  );
});

// chạy server
app.listen(3000, () => {
  console.log("Server chạy tại http://localhost:3000");
});