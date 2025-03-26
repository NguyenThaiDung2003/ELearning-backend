const User = require("../models/User");
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt");

const authController = {
  //Register
  registerUser: async (req, res) => {
    try {
      // Kiểm tra dữ liệu đầu vào
      if (!req.body.password || !req.body.username || !req.body.email) {
        return res.status(400).json({ error: "All fields are required" });
      }

      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(req.body.password, salt);

      // Tạo user mới
      const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashed,
      });

      // Lưu vào database
      const user = await newUser.save();
      res.status(200).json(user);
    } catch (err) {
      console.error(" Error in registerUser:", err);
      res.status(500).json({ error: err.message });
    }
  },
  //Login
  loginUser: async (req, res) => {
    try {
      const user = await User.findOne({ username: req.body.username });
      if (!user) return res.status(401).json({ error: "Wrong username" }); 

      const validPassword = await bcrypt.compare(req.body.password, user.password);
      if (!validPassword) return res.status(400).json({ error: "Wrong password" }); 

      if(user && validPassword){
        const accessToken = jwt.sign(
          { id: user.id, admin: user.admin, },
          process.env.JWT_ACCESS_KEY,
          { expiresIn: "1h" }
        );
        const refreshToken = jwt.sign(
          { id: user.id, admin: user.admin },
          process.env.JWT_REFRESH_KEY,
          { expiresIn: "30d" }
        );
        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: false,
          path: "/",
          sameSite: "strict",
      });
      
        const {password,...others} = user._doc
        res.status(200).json({...others, accessToken}); 
      }
    } catch (err) {
      console.error(" Error in loginUser:", err);
      res.status(500).json({ error: err.message });
    }
  },
  //Refresh
  refreshToken: (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.status(401).json("You're not authenticated!");

    jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, (err, user) => {
        if (err) return res.status(403).json("Refresh token is not valid!");

        const newAccessToken = jwt.sign(
            { id: user.id, admin: user.admin },
            process.env.JWT_ACCESS_KEY,
            { expiresIn: "1h" }
        );

        res.status(200).json({ accessToken: newAccessToken });
    });
  },

  userLogout: async (req, res) => {
    try {
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: false, 
            path: "/",
            sameSite: "strict",
        });

        res.status(200).json({ message: "Logged out successfully!" });
    } catch (err) {
        console.error(" Error in logoutUser:", err);
        res.status(500).json({ error: err.message });
    }
  } 
};

module.exports = authController;
