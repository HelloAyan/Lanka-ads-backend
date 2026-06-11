const express = require("express");

const {
    createAd,
    getMyAds,
    deleteAd,
} = require("../controllers/adController");

const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

const uploadSingleImage = (req, res, next) => {
    upload.single("image")(req, res, (error) => {
        if (error) {
            return res.status(400).json({
                success: false,
                message: "Image upload failed",
                error: error.message,
            });
        }

        next();
    });
};

router.post("/", protect, uploadSingleImage, createAd);
router.get("/my-ads", protect, getMyAds);
router.delete("/:id", protect, deleteAd);

module.exports = router;