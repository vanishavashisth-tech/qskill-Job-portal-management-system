// src/controllers/applicationController.js
// Handles incoming HTTP requests for job applications.

const applicationModel = require("../models/applicationModel");
const jobModel = require("../models/jobModel");

// Very small email format check — good enough for basic validation
// without pulling in an extra dependency.
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// POST /api/applications
async function applyForJob(req, res, next) {
  try {
    const { job_id, applicant_name, applicant_email, resume } = req.body;

    if (!job_id || !applicant_name || !applicant_email) {
      return res.status(400).json({
        success: false,
        message: "job_id, applicant_name, and applicant_email are required",
      });
    }

    if (isNaN(job_id)) {
      return res.status(400).json({
        success: false,
        message: "job_id must be a valid number",
      });
    }

    if (!isValidEmail(applicant_email)) {
      return res.status(400).json({
        success: false,
        message: "applicant_email must be a valid email address",
      });
    }

    // Make sure the job actually exists before creating the application
    const job = await jobModel.getJobById(job_id);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Cannot apply: job not found",
      });
    }

    // Block duplicate applications from the same email for the same job
    const existing = await applicationModel.findDuplicateApplication(
      job_id,
      applicant_email
    );
    if (existing) {
      return res.status(409).json({
        success: false,
        message: "You have already applied for this job with this email",
      });
    }

    const application = await applicationModel.createApplication({
      job_id,
      applicant_name,
      applicant_email,
      resume: resume || null,
    });

    res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      data: application,
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/applications
async function listApplications(req, res, next) {
  try {
    const applications = await applicationModel.getAllApplications();
    res.status(200).json({
      success: true,
      message: "Applications fetched successfully",
      data: applications,
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/applications/:id
async function getApplication(req, res, next) {
  try {
    const { id } = req.params;

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Application id must be a valid number",
      });
    }

    const application = await applicationModel.getApplicationById(id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Application fetched successfully",
      data: application,
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/applications/user/:email
async function getApplicationsByEmail(req, res, next) {
  try {
    const { email } = req.params;

    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "A valid email must be provided",
      });
    }

    const applications = await applicationModel.getApplicationsByEmail(email);

    res.status(200).json({
      success: true,
      message: `Applications for ${email} fetched successfully`,
      data: applications,
    });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/applications/:id
async function deleteApplication(req, res, next) {
  try {
    const { id } = req.params;

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Application id must be a valid number",
      });
    }

    const deleted = await applicationModel.deleteApplication(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Application withdrawn successfully",
      data: deleted,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  applyForJob,
  listApplications,
  getApplication,
  getApplicationsByEmail,
  deleteApplication,
};
