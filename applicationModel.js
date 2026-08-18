// src/models/applicationModel.js
// All direct database queries related to job applications live here.

const pool = require("../config/db");

// Fetch every application, joined with basic job info for context
async function getAllApplications() {
  const result = await pool.query(
    `SELECT applications.*, jobs.title AS job_title, jobs.company AS job_company
     FROM applications
     JOIN jobs ON applications.job_id = jobs.id
     ORDER BY applications.applied_at DESC`
  );
  return result.rows;
}

// Fetch a single application by its id
async function getApplicationById(id) {
  const result = await pool.query(
    `SELECT applications.*, jobs.title AS job_title, jobs.company AS job_company
     FROM applications
     JOIN jobs ON applications.job_id = jobs.id
     WHERE applications.id = $1`,
    [id]
  );
  return result.rows[0];
}

// Fetch all applications submitted by one applicant email
async function getApplicationsByEmail(email) {
  const result = await pool.query(
    `SELECT applications.*, jobs.title AS job_title, jobs.company AS job_company
     FROM applications
     JOIN jobs ON applications.job_id = jobs.id
     WHERE applicant_email = $1
     ORDER BY applications.applied_at DESC`,
    [email]
  );
  return result.rows;
}

// Check if this email has already applied to this job (used to block duplicates)
async function findDuplicateApplication(jobId, email) {
  const result = await pool.query(
    "SELECT * FROM applications WHERE job_id = $1 AND applicant_email = $2",
    [jobId, email]
  );
  return result.rows[0]; // undefined if no duplicate exists
}

// Insert a new application
async function createApplication({
  job_id,
  applicant_name,
  applicant_email,
  resume,
}) {
  const result = await pool.query(
    `INSERT INTO applications (job_id, applicant_name, applicant_email, resume)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [job_id, applicant_name, applicant_email, resume]
  );
  return result.rows[0];
}

// Delete an application by id. Returns the deleted row, or undefined if it didn't exist.
async function deleteApplication(id) {
  const result = await pool.query(
    "DELETE FROM applications WHERE id = $1 RETURNING *",
    [id]
  );
  return result.rows[0];
}

module.exports = {
  getAllApplications,
  getApplicationById,
  getApplicationsByEmail,
  findDuplicateApplication,
  createApplication,
  deleteApplication,
};
