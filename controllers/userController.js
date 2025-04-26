const User = require("../models/User");
const Profile = require("../models/Profile");

const userController = {
    getUserProfile: async (req, res) => {
        try {
            const user = await User.findById(req.user.id).select("-password");  // Ẩn password
            if (!user) return res.status(404).json({ message: "User not found" });
            const profile = await Profile.findOne({ userId: user._id });
            res.status(200).json({
                ...user._doc,
                profile: profile || null,
            });
        } catch (err) {
            console.error("Error in getUserProfile:", err);
            res.status(500).json({ error: err.message });
        }
    },
    updateUserProfile: async (req, res) => {
        try {
            const userId = req.user.id;
            const { fullName, phone, birthday, address, avatar } = req.body;

            let profile = await Profile.findOne({ userId });

            if (!profile) {
                profile = new Profile({ userId });
            }

            if (fullName !== undefined) profile.fullName = fullName;
            if (phone !== undefined) profile.phone = phone;
            if (birthday !== undefined) profile.birthday = birthday;
            if (address !== undefined) profile.address = address;
            if (avatar !== undefined) profile.avatar = avatar;

            await profile.save();

            res.status(200).json({ message: "Cập nhật profile thành công", profile });
        } catch (err) {
            console.error("Error in updateUserProfile:", err);
            res.status(500).json({ error: err.message });
        }
    }
};

module.exports = userController;
