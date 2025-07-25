const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  getUserProfile,
  updateUserProfile,
} = require("../controllers/userController");

// All routes in this file are protected
router
  .route("/me")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

router.route("/profile/:id").get(protect, getUserProfile); // For getting specific user (admin or own profile)

module.exports = router;
