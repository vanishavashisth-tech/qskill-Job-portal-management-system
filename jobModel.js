// src/models/jobModel.js
// All direct database queries related to jobs live here.
// Controllers call these functions instead of writing SQL themselves.

const pool = require("../config/db");

// Fetch every job, most recent first
async function getAllJobs() {
  const result = await pool.query(
    "SELECT * FROM jobs ORDER BY created_at DESC"
  );
  return result.rows;
}

// Fetch a single job by its id
async function getJobById(id) {
  const result = await pool.query("SELECT * FROM jobs WHERE id = $1", [id]);
  return result.rows[0]; // undefined if not found
}

// Search jobs by title, company, location, or a general keyword.
// ILIKE gives case-insensitive partial matching in PostgreSQL.
async function searchJobs(keyword) {
  const searchTerm = `%${keyword}%`;
  const result = await pool.query(
    `SELECT * FROM jobs
     WHERE title ILIKE $1
        OR company ILIKE $1
        OR location ILIKE $1
        OR description ILIKE $1
     ORDER BY created_at DESC`,
    [searchTerm]
  );
  return result.rows;
}

// Insert a new job posting
async function createJob({ title, company, location, salary, description }) {
  const result = await pool.query(
    `INSERT INTO jobs (title, company, location, salary, description)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [title, company, location, salary, description]
  );
  return result.rows[0];
}

module.exports = {
  getAllJobs,
  getJobById,
  searchJobs,
  createJob,
};
