const Ad = require("../models/Ad");
const Counter = require("../models/Counter");

const generateAdId = async () => {
    const counter = await Counter.findOneAndUpdate(
        { name: "adId" },
        { $inc: { seq: 1 } },
        {
            new: true,
            upsert: true,
        }
    );

    return `AD${counter.seq}`;
};

exports.createAd = async (req, res) => {
    try {
        const {
            type,
            title,
            category,
            location,
            price,
            description,
            whatsapp,
            telegram,
            imo,
            viber,
        } = req.body;

        if (!title || !category || !location || !price || !description) {
            return res.status(400).json({
                success: false,
                message: "Required fields are missing.",
            });
        }

        const adId = await generateAdId();

        const ad = await Ad.create({
            user: req.user._id,
            adId,

            image: req.file
                ? {
                    url: `/uploads/ads/${req.file.filename}`,
                    filename: req.file.filename,
                }
                : {
                    url: "",
                    filename: "",
                },

            type,
            title,
            category,
            location,
            price,
            description,

            socialAvailability: {
                whatsapp: whatsapp === "true",
                telegram: telegram === "true",
                imo: imo === "true",
                viber: viber === "true",
            },

            status: "pending",
        });

        const populatedAd = await Ad.findById(ad._id).populate(
            "user",
            "accountId phone name"
        );

        return res.status(201).json({
            success: true,
            message: "Ad created successfully",
            ad: populatedAd,
        });
    } catch (error) {
        console.error("Create Ad Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to create ad",
        });
    }
};

exports.getMyAds = async (req, res) => {
    try {
        const ads = await Ad.find({
            user: req.user._id,
        })
            .populate("user", "accountId phone name")
            .sort({ createdAt: -1 });

        return res.json({
            success: true,
            count: ads.length,
            ads,
        });
    } catch (error) {
        console.error("Get My Ads Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to get ads",
        });
    }
};

exports.deleteAd = async (req, res) => {
    try {
        const ad = await Ad.findOne({
            _id: req.params.id,
            user: req.user._id,
        });

        if (!ad) {
            return res.status(404).json({
                success: false,
                message: "Ad not found",
            });
        }

        await ad.deleteOne();

        return res.json({
            success: true,
            message: "Ad deleted successfully",
        });
    } catch (error) {
        console.error("Delete Ad Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to delete ad",
        });
    }
};