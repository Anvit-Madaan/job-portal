const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");
const {
  uploadFile,
  getUserFiles,
  getFileById,
  deleteFile,
  shareFile,
  getSharedFile,
} = require("../controllers/fileController");

const router = express.Router();

router.post("/upload", protect, upload.single("file"), uploadFile);
router.get("/", protect, getUserFiles);
router.get("/shared/:code", getSharedFile);
router.get("/:id", protect, getFileById);
router.delete("/:id", protect, deleteFile);
router.post("/:id/share", protect, shareFile);

module.exports = router;
