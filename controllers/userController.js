const User = require("../models/User");

const userController = {
    // Lấy tất cả người dùng
    getAllUsers: async (req, res) => {
        try {
            const users = await User.find(); 
            res.status(200).json(users);
        } catch (err) {
            console.error("Error in getAllUsers:", err);
            res.status(500).json({ error: err.message });
        }
    },
};

module.exports = userController;
