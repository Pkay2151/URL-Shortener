const express = require("express");
const cors = require("cors");
const { nanoid } = require("nanoid");
const { Pool } = require("pg");

const app = express();
const PORT = 5000;

// Base URL (important for deployment later)
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;

// PostgreSQL connection
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "url_shortener",
  password: "qwerty025",
  port: 5432,
});

// Middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.post("/shorten", async (req, res) => {
  const { originalUrl } = req.body;

  if (!originalUrl) {
    return res.status(400).json({ error: "URL is required" });
  }

  const shortId = nanoid(6);

  try {
    await pool.query(
      "INSERT INTO urls (short_id, original_url) VALUES ($1, $2)",
      [shortId, originalUrl]
    );

    res.json({
      shortUrl: `${BASE_URL}/${shortId}`
    });
  } catch (err) {
    console.error("DB Insert Error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

app.get("/:id", async (req, res) => {
  const shortId = req.params.id;

  console.log("Redirect request:", shortId);

  try {
    const result = await pool.query(
      "SELECT original_url FROM urls WHERE short_id = $1",
      [shortId]
    );

    if (result.rows.length > 0) {
      return res.redirect(result.rows[0].original_url);
    }

    return res.status(404).send("URL not found");
  } catch (err) {
    console.error("DB Fetch Error:", err);
    res.status(500).send("Server error");
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});