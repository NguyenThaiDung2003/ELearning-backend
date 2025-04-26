// Các import cần thiết
import bcrypt from "bcrypt"; // Thư viện mã hóa mật khẩu
import User from "../models/User.js"; // Model người dùng
import {
  generateAccessToken,
  generateRefreshToken,
  validateRefreshToken,
} from "./TokenService.js"; // Service xử lý JWT
import mongoose from "mongoose";
// import CourseReview from "../Models/CourseReview.js"; // Model đánh giá khóa học
// import RegisterCourseModel from "../Models/RegisterCourseModel.js"; // Model đăng ký khóa học
import { sendEmailResetPassword } from "./EmailService.js"; // Service gửi email
import otpGenerator from 'otp-generator'; // Thư viện tạo mã OTP

// Đăng ký người dùng
const register = async (userName, email, password) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error("Invalid email format"); // Kiểm tra định dạng email
  }

  const existingUser = await User.findOne({ $or: [{ userName }, { email }] });
  if (existingUser) {
    throw new Error("User already exists with this username or email"); // Kiểm tra trùng tên/email
  }

  if (!password || password.length < 6) {
    throw new Error("Password must be at least 6 characters long");
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10); // Mã hóa mật khẩu
    const user = new User({
      userName,
      email,
      passwordHash: hashedPassword,
    });
    await user.save();
    return { userName, email }; // Trả về thông tin cơ bản sau đăng ký
  } catch (error) {
    throw new Error("Registration failed: " + error.message);
  }
};

// Đăng nhập bằng userName
const loginUserName = async (userName, password) => {
  try {
    const user = await User.findOne({ userName }).select("+passwordHash");
    if (!user) throw new Error("User not found");

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) throw new Error("Incorrect password");

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    return { accessToken, refreshToken, role: user.role };
  } catch (error) {
    throw new Error("Login failed: " + error.message);
  }
};

// Làm mới access token từ refresh token
const refreshToken = async (refreshToken) => {
  try {
    const decoded = validateRefreshToken(refreshToken);
    if (!decoded) throw new Error("Invalid refresh token");

    const user = await User.findById(decoded.id);
    if (!user) throw new Error("User not found");

    const newAccessToken = generateAccessToken(user);
    return { accessToken: newAccessToken };
  } catch (error) {
    throw new Error("Token refresh failed: " + error.message);
  }
};

// Lấy thông tin người dùng
const getUserProfile = async (id) => {
  try {
    const user = await User.findById(id);
    if (!user) throw new Error("User not found");

    return {
      userName: user.userName,
      email: user.email,
      name: user.name,
      role: user.role,
      avatarUrl: user.avatarUrl,
    };
  } catch (error) {
    throw new Error("Error retrieving user profile");
  }
};

// Cập nhật ảnh đại diện
const updateAvatar = async (id, avatarUrl) => {
  try {
    await User.findByIdAndUpdate(id, { avatarUrl });
  } catch (error) {
    throw new Error("Error updating avatar");
  }
};

// Cập nhật thông tin người dùng
const updateUserProfile = async (id, newInfo) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(id, newInfo, { new: true });
    return {
      userName: updatedUser.userName,
      email: updatedUser.email,
      name: updatedUser.name,
      role: updatedUser.role,
      avatarUrl: updatedUser.avatarUrl,
    };
  } catch (error) {
    throw new Error("Error updating user info");
  }
};

// Lấy danh sách tất cả người dùng
const getUsers = async () => {
  try {
    return await User.find();
  } catch (error) {
    throw new Error("Error retrieving users: " + error.message);
  }
};

// Xóa người dùng (và dữ liệu liên quan)
const deleteUser = async (userId) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid userId");
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // await CourseReview.deleteMany({ userId }, { session });
    // await RegisterCourseModel.deleteMany({ userId }, { session });
    const deletedUser = await User.findByIdAndDelete(userId, { session });

    await session.commitTransaction();
    session.endSession();

    if (!deletedUser) throw new Error("User not found");
    return { message: "User deleted successfully" };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw new Error("Error deleting user: " + error.message);
  }
};

// Tạo người dùng mới (Admin dùng)
const createUser = async (userName, email, name = "", password, role) => {
  if (!userName) throw new Error("Username is required");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) throw new Error("Invalid email format");

  const existingUser = await User.findOne({ $or: [{ userName }, { email }] });
  if (existingUser) throw new Error("User already exists with this username or email");

  if (!password || password.length < 6) throw new Error("Password must be at least 6 characters long");
  if (!role || !["User", "Admin"].includes(role)) throw new Error("Invalid role");

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ userName, email, name, passwordHash: hashedPassword, role });
    await User.create(user);
    return {
      userName: user.userName,
      email: user.email,
      name: user.name,
      role: user.role,
      avatarUrl: user.avatarUrl,
    };
  } catch (error) {
    throw new Error("Failed to create admin: " + error.message);
  }
};

// Sửa thông tin người dùng (Admin dùng)
const editUserProfile = async (userId, { name, role }) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) throw new Error("Invalid userId");
  if (!role || !["User", "Admin"].includes(role)) throw new Error("Invalid role");

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, role },
      { new: true }
    );
    return updatedUser;
  } catch (error) {
    throw new Error("Error updating user profile: " + error.message);
  }
};

// Tìm kiếm người dùng theo điều kiện
const searchUsers = async (query) => {
  const { userName, name, email, role } = query;
  const queryObject = {};

  if (userName) queryObject.userName = new RegExp(userName, "i");
  if (name) queryObject.name = new RegExp(name, "i");
  if (email) queryObject.email = new RegExp(email, "i");
  if (role) queryObject.role = role;

  try {
    return await User.find(queryObject);
  } catch (error) {
    throw new Error("Error searching users:" + error.message);
  }
};

// Quên mật khẩu: Gửi OTP đến email
const forgotPassword = async (email) => {
  try {
    const user = await User.findOne({ email });
    if (!user) return;

    const resetPasswordOTP = otpGenerator.generate(6, {
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });

    user.resetPasswordToken = resetPasswordOTP;
    user.resetPasswordExpiresIn = Date.now() + 5 * 60 * 1000; // Hết hạn sau 5 phút
    await sendEmailResetPassword(email, resetPasswordOTP);
    await user.save();
  } catch (error) {
    console.error("Error while saving user:", error);
    throw new Error("Cannot create token!");
  }
};

// Xác minh token OTP
const verifyResetPasswordToken = async (email, token) => {
  try {
    const user = await User.findOne({ email, resetPasswordToken: token });
    if (!user) return false;
    if (Date.now() > new Date(user.resetPasswordExpiresIn).getTime()) return false;
    return true;
  } catch (error) {
    throw new Error("Token is invalid!");
  }
};

// Đặt lại mật khẩu mới bằng token
const resetPassword = async (email, token, password) => {
  const user = await User.findOne({ email, resetPasswordToken: token });
  if (!user) throw new Error("Reset password failed!");
  if (Date.now() > new Date(user.resetPasswordExpiresIn).getTime())
    throw new Error("OTP is expired!");
  if (password.length < 6) throw new Error("The password is at least 6 characters!");

  user.passwordHash = bcrypt.hashSync(password, 10);
  user.resetPasswordToken = null;
  user.resetPasswordExpiresIn = null;
  await user.save();
};

// Thay đổi mật khẩu khi đã đăng nhập
const changePassword = async (userId, currentPassword, newPassword) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) throw new Error("Invalid userId");

  const user = await User.findById(userId).select("+passwordHash");
  if (!user) throw new Error("Change password failed!");

  const isValidPassword = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!isValidPassword) throw new Error("Incorrect password");

  if (newPassword.length < 6) throw new Error("The password is at least 6 characters!");

  user.passwordHash = bcrypt.hashSync(newPassword, 10);
  try {
    await user.save();
  } catch (error) {
    throw new Error("Change password failed");
  }
};

// Thống kê tổng số người dùng
const getTotalUsers = async () => {
  try {
    return await User.countDocuments();
  } catch (error) {
    throw new Error("Error getting total users: " + error.message);
  }
};

// Xuất tất cả hàm dưới dạng service
export default {
  register,
  loginUserName,
  refreshToken,
  getUserProfile,
  updateAvatar,
  updateUserProfile,
  getUsers,
  deleteUser,
  createUser,
  editUserProfile,
  searchUsers,
  forgotPassword,
  verifyResetPasswordToken,
  resetPassword,
  changePassword,
  getTotalUsers,
};
