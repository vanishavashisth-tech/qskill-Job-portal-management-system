// src/config/db.js
// Sets up a PostgreSQL connection pool using credentials from .env

const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Verify the connection works as soon as the server starts.
// This gives a clear error message instead of a confusing crash later.
pool
  .connect()
  .then((client) => {
    console.log("PostgreSQL connected successfully");
    client.release();
  })
  .catch((err) => {
    console.error("Failed to connect to PostgreSQL:", err.message);
  });

module.exports = pool;
