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

            type: type || "Super Ad",
            title,
            category,
            location,
            price: Number(price),
            description,

            socialAvailability: {
                whatsapp: whatsapp === "true" || whatsapp === true,
                telegram: telegram === "true" || telegram === true,
                imo: imo === "true" || imo === true,
                viber: viber === "true" || viber === true,
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
            error: error.message,
        });
    }
};

exports.getMyAds = async (req, res) => {
    try {
        const page = Math.max(Number(req.query.page) || 1, 1);
        const limit = Math.min(Math.max(Number(req.query.limit) || 20, 1), 100);
        const skip = (page - 1) * limit;

        const filter = {
            user: req.user._id,
        };

        const [ads, totalAds] = await Promise.all([
            Ad.find(filter)
                .populate("user", "accountId phone name")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),

            Ad.countDocuments(filter),
        ]);

        const totalPages = Math.ceil(totalAds / limit);

        return res.json({
            success: true,
            count: ads.length,
            page,
            limit,
            totalAds,
            totalPages,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1,
            ads,
        });
    } catch (error) {
        console.error("Get My Ads Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to get ads",
            error: error.message,
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
            error: error.message,
        });
    }
};