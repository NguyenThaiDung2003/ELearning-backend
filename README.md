# ELEARNING_BACKEND

## Bắt đầu

### Điều kiện tiên quyết

Chạy lệnh sau để cài đặt các pakage:

```shell
npm install
```

### Biến môi trường
Tạo file .env ở thư mục gốc

```
PORT=
MONGODB_URI=

JWT_ACCESS_SECRET= // Secret key để ký token (>32Byte)
JWT_REFRESH_SECRET=// Secret riêng để ký refresh token(>32Byte)

MAIL_ACCOUNT=
MAIL_PASSWORD=

CLIENT_URL=//url frontend

PAYPAL_API_BASE=
PAYPAL_CLIENT_ID=
PAYPAL_SECRET=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

NODE_ENV=
```
### Các bước cụ thể để tạo App Password cho Gmail:
Truy cập Google Tài khoản:
👉 https://myaccount.google.com/security

Kéo xuống mục "Đăng nhập vào Google"

Đảm bảo bạn đã bật "Xác minh 2 bước" (Two-Factor Authentication)

Nếu chưa bật, bạn phải bật nó trước thì phần "Mật khẩu ứng dụng" mới xuất hiện.

Sau khi đã bật 2FA, bạn sẽ thấy phần:

🔐 Mật khẩu ứng dụng (App Passwords)
👉 Truy cập trực tiếp: https://myaccount.google.com/apppasswords

Tạo mật khẩu ứng dụng mới:

Trong menu "Chọn ứng dụng": chọn "Thư" (Mail)

Trong menu "Chọn thiết bị": chọn "Máy tính Windows" hoặc chọn "Khác" và nhập tên (ví dụ: NodeMailer)

Nhấn "Tạo"

Google sẽ tạo một dãy mật khẩu gồm 16 ký tự (cách nhau mỗi 4 ký tự, nhưng khi sử dụng thì không cần khoảng trắng)
→ Ví dụ: abcd efgh ijkl mnop

Sao chép dãy này và đặt vào .env trong biến MAIL_PASSWORD.
### Cách lấy PayPal Client ID và Client Secret
Để lấy PayPal Client ID và Client Secret (password), bạn cần tạo một PayPal Developer App. Dưới đây là hướng dẫn chi tiết từng bước:

🔧 Bước 1: Truy cập trang dành cho Developer của PayPal
Truy cập: https://developer.paypal.com

Đăng nhập bằng tài khoản PayPal của bạn (nên dùng tài khoản Business hoặc Sandbox).

🔧 Bước 2: Tạo App mới để lấy Client ID và Secret
Vào mục "Dashboard".

Chọn tab "My Apps & Credentials".

Chọn môi trường:

Sandbox (dành cho test).

Live (dành cho production).

Nhấn "Create App".

Đặt tên cho App (ví dụ: My Online Course App) và chọn tài khoản Sandbox.

Sau khi tạo xong, bạn sẽ thấy:

Client ID (chuỗi dài) — dùng để xác thực ứng dụng.

Secret (click "Show" để thấy) — dùng để lấy access_token.

📦 Bước 3: Cấu hình vào project
Bạn nên đặt Client ID và Secret vào biến môi trường .env để bảo mật:

PAYPAL_API_BASE=https://api-m.sandbox.paypal.com
PAYPAL_CLIENT_ID=YOUR_CLIENT_ID_HERE
PAYPAL_SECRET=YOUR_SECRET_HERE
### Cách lấy cấu hình tài khoản Cloudinary:
Truy cập: https://cloudinary.com/

Đăng nhập hoặc đăng ký tài khoản.

Vào Dashboard (trang chủ sau khi đăng nhập).

Ở mục Account Details, bạn sẽ thấy thông tin sau:

CLOUD NAME       →  Tương ứng với CLOUDINARY_CLOUD_NAME  
API KEY          →  Tương ứng với CLOUDINARY_API_KEY  
API SECRET       →  Tương ứng với CLOUDINARY_API_SECRET
### Để lấy MongoDB URI trên MongoDB Atlas, bạn làm theo các bước sau:

✅ Bước 1: Đăng nhập MongoDB Atlas
Truy cập: https://www.mongodb.com/cloud/atlas

✅ Bước 2: Chọn Project và Cluster
Vào project bạn đang làm việc

Nhấn vào tên Cluster (ví dụ: Cluster0)

✅ Bước 3: Lấy Connection String (URI)
Nhấn nút "Connect"

Chọn "Connect your application"

Ở mục "Driver", chọn:

Language: Node.js

Version: >= 3.6 (nếu bạn dùng Mongoose hoặc MongoDB Native Driver)

Sao chép URI Connection string, ví dụ:
mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/myDatabase?retryWrites=true&w=majority
✅ Bước 4: Sửa lại URI cho phù hợp
Thay:

<username> = Tên user Atlas của bạn

<password> = Mật khẩu user đó

myDatabase = Tên database bạn muốn kết nối (ví dụ: test, e-learning, ...)

Ví dụ sau khi chỉnh:

mongodb+srv://admin:123456@cluster0.abcde.mongodb.net/e-learning?retryWrites=true&w=majority
📌 Lưu ý:
Bạn phải cấp quyền truy cập IP trong mục Network Access (bên trái → "IP Access List")

Chọn "Allow Access from Anywhere" (0.0.0.0/0) nếu đang phát triển

Đảm bảo user có quyền truy cập DB bạn cần

Nếu bạn đang dùng Node.js/Mongoose, bạn có thể dùng URI như sau:

mongoose.connect('mongodb+srv://admin:123456@cluster0.abcde.mongodb.net/e-learning', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

### Chạy máy chủ
Trong terminal, hãy chạy lệnh sau để khởi động server:
```shell
npm start
```