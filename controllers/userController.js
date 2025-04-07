const User = require("../models/User");

const userController = {
    getUserProfile: async (req, res) => {
        try {
            const user = await User.findById(req.user.id).select("-password");  // Ẩn password
            if (!user) return res.status(404).json({ message: "User not found" });
            res.status(200).json(user);
        } catch (err) {
            console.error("Error in getUserProfile:", err);
            res.status(500).json({ error: err.message });
        }
    },
};

module.exports = userController;
