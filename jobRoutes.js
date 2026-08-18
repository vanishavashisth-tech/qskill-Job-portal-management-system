// src/routes/jobRoutes.js

const express = require("express");
const router = express.Router();
const jobController = require("../controllers/jobController");

// IMPORTANT: /search must be defined before /:id
// otherwise Express will treat "search" as an :id value.
router.get("/search", jobController.searchJobs);

router.get("/", jobController.listJobs);
router.get("/:id", jobController.getJob);
router.post("/", jobController.createJob);

module.exports = router;
