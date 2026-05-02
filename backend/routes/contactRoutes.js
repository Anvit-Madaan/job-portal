const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { submitContactMessage, getContactMessages } = require("../controllers/contactController");

const router = express.Router();

router.post("/", submitContactMessage);
router.get("/", protect, getContactMessages);

module.exports = router;
