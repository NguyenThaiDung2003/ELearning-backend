// Import các thư viện cần thiết
import express from "express";                  // Framework web chính
import mongoose from "mongoose";                // Kết nối MongoDB
import dotenv from "dotenv";                    // Đọc biến môi trường từ .env
import cors from "cors";                        // Xử lý CORS
import cookieParser from "cookie-parser";       // Đọc cookie từ request
import routes from "./routes/router.js";         // Import các route của ứng dụng

// Đọc các biến môi trường từ file .env
dotenv.config();

// Khởi tạo ứng dụng Express
const app = express();

// Cấu hình CORS - chỉ cho phép các origin nằm trong danh sách
const allowedOrigins = [process.env.CLIENT_URL];
app.use(
  cors({
    origin: function (origin, callback) {
      // Cho phép nếu origin hợp lệ hoặc không có origin 
      if (allowedOrigins.includes(origin) || !origin) {
        callback(null, true);
      } else {
        // Từ chối CORS nếu origin không được phép
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // Cho phép gửi cookie từ client
  })
);

// Middleware xử lý cookie và JSON
app.use(cookieParser());                         // Giải mã cookie trong request
app.use(express.json());                         // Phân tích body dạng JSON
app.use(express.urlencoded({ extended: true })); // Phân tích form-urlencoded

// Định nghĩa các route trong hệ thống
routes(app);

// Kết nối tới MongoDB
try {
  await mongoose.connect(process.env.MONGODB_URL); // URL MongoDB từ .env
  console.log("Connected to Database successfully!");
} catch (error) {
  console.error("Couldn't connect to Database: " + error.message);
  process.exit(1); // Thoát nếu kết nối DB thất bại
}

// Khởi động server
app.listen(process.env.PORT, (err) => {
  if (err) {
    console.error(`Error occurred: ${err.message}`); // Lỗi khi khởi động
  } else {
    console.log(`Server is running on port ${process.env.PORT}`); // Thành công
  }
});