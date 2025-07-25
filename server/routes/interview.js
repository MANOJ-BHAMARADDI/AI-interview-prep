const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  startInterview,
  submitAnswer,
  getInterviewHistory,
  getInterviewById,
} = require("../controllers/interviewController");

router
  .route("/")
  .post(protect, startInterview)
  .get(protect, getInterviewHistory);

router.route("/:id").get(protect, getInterviewById);

router.route("/:id/answer").post(protect, submitAnswer);

module.exports = router;