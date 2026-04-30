require("dotenv").config();
import express, { json } from "express";
import cors from "cors";
import { nanoid } from "nanoid";
import { Pool } from "pg";

const app = express();
const PORT = process.env.PORT || 5000;

// Base URL (for local + future deployment)
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;

// PostgreSQL connection
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Middleware
app.use(cors());
app.use(json());

// Test route
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

  try {
    // Get original URL
    const result = await pool.query(
      "SELECT original_url FROM urls WHERE short_id = $1",
      [shortId]
    );

    if (result.rows.length > 0) {
      // Increase click count
      await pool.query(
        "UPDATE urls SET clicks = clicks + 1 WHERE short_id = $1",
        [shortId]
      );

      // Redirect user
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