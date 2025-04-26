const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    },
    fullName: {
        type: String,
        default: null
    },
    phone: {
        type: String,
        default: null
    },
    birthday: {
        type: String,
        default: null
    },
    address: {
        type: String,
        default: null
    },
    avatar: {
        type: String,
        default: null
    }
}, { timestamps: true });

module.exports = mongoose.model("Profile", profileSchema);
