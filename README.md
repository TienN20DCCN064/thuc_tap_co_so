# 🏆 API - Quản Lý Giải Đấu Bóng Đá

Đây là service backend viết bằng Node.js và MySQL, phục vụ cho Mini App quản lý giải đấu bóng đá. Hướng dẫn dưới đây giúp bạn cài đặt và cấu hình server để chạy trên máy cục bộ và cho phép máy khác trong cùng mạng LAN truy cập được.

---

## 🎥 Video demo

Xem video hướng dẫn tại: [![Video demo](https://img.youtube.com/vi/kNEQzcXxYTs/0.jpg)](https://www.youtube.com/watch?v=kNEQzcXxYTs)

---

## 🎥Thêm thư mục “.env”

JWT_SECRET=XXXX # Khóa bí mật dùng để ký và xác thực JSON Web Token (JWT)
JWT_EXPIRES_IN=XXXX # Thời gian hết hạn của JWT (ví dụ: "1h", "7d")

DTB_HOST=XXXX # Địa chỉ máy chủ cơ sở dữ liệu (database host)
DTB_USER=XXXX # Tên đăng nhập cơ sở dữ liệu
DTB_PASSWORD=XXXX # Mật khẩu đăng nhập cơ sở dữ liệu
DTB_NAME=XXXX # Tên cơ sở dữ liệu đang sử dụng

PASSWORD_CRYPTO=XXXX # Chuỗi dùng để mã hóa mật khẩu (có thể là salt hoặc secret key)
SALT_ROUNDS_CRYPTO=XXXX # Số vòng salt dùng trong hàm băm mật khẩu (ví dụ: 10)

EMAIL_SENDER=XXXX@gmail.com # Địa chỉ email gửi đi (thường dùng cho chức năng gửi mail xác nhận, reset mật khẩu)
EMAIL_PASSWORD=XXXX # Mật khẩu hoặc mã app của email gửi đi

CLOUD_NAME=XXXX # Tên tài khoản/ứng dụng trên dịch vụ lưu trữ đám mây (ví dụ: Cloudinary)
CLOUD_API_KEY=XXXX # Khóa API để truy cập dịch vụ lưu trữ đám mây
CLOUD_API_SECRET=XXXX # Bí mật API để xác thực với dịch vụ lưu trữ đám mây

## 📦 1. Cài đặt thư viện

### ⚙️ Yêu cầu

- Node.js >= 16
- MySQL Server đang chạy và có sẵn database
- phpadmin, xampp

### 🧱 Cài đặt

Mở terminal và chạy:
npm install express mysql2 cors moment jsonwebtoken
python -m ensurepip --default-pip
python -m pip install flask
python -m pip install flask-cors
python -m pip install cloudinary

##### 🧱 Chạy

- Chạy sql trên xampp
- Mở terminal và chạy:
  ipconfig lấy IPv4 Address. . . . . . . . . . . : 192.168.1.40
  Vào file : backend\services\global\global.js  
   Cập nhật : const IPv4_Address = "192.168.1.40";
- Chạy API  
   Mở terminal và chạy: cd "C:\Users\vanti\Desktop\tt\quan_ly_tran_dau\service\"
  node api.js
  python api_gmail.py
  python api_image.py
  python api_taoTranDau.py
                <<  Sửa lại 2 file api gmail với image >>

<!-- // test -->
