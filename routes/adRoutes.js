const express = require("express");

const {
    createAd,
    getMyAds,
    deleteAd,
} = require("../controllers/adController");

const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

router.post("/", protect, upload.single("image"), createAd);
router.get("/my-ads", protect, getMyAds);
router.delete("/:id", protect, deleteAd);

module.exports = router;