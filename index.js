const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const authRoute = require("./routes/auth");
const userRoute = require("./routes/user");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

const corsOptions = {
origin: [
    "http://localhost:5173",             
    "https://projectweb-68a6b.web.app",  
  ],
  methods: "GET,POST,PUT,DELETE,OPTIONS",
  credentials: true,
};
app.use(cors(corsOptions));

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL, {
    });
    console.log(" Connected to MongoDB");
  } catch (error) {
    console.error(" MongoDB connection error:", error);
    process.exit(1);
  }
};

connectDB();

app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));// log requests to the console

app.use("/",authRoute);
app.use("/",userRoute);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


//AUTHENTICATION
//AUTHORIZATION
//JWT
