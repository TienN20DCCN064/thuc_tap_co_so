
const express = require("express");
const mysql = require("mysql2");    // kết nối trực tiếp với mysql
const cors = require("cors");   // cho phép các tài nguyên được tải từ một tên miền khác với tên miền mà trang web đang chạy
const jwt = require("jsonwebtoken");
const moment = require("moment");

require("dotenv").config(); // Đọc biến môi trường từ .env

const app = express();       // tạo 1 ứng dụng express
const port = 4002;           // api chạy trên cổng
app.use(cors());

app.use(express.json());
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "bong_da",
});

// Kiểm tra kết nối
db.connect((err) => {
    if (err) {
        console.error("Không thể kết nối cơ sở dữ liệu:", err);
        return;
    }
    console.log("Kết nối cơ sở dữ liệu thành công!");
});

function verifyToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Token không được cung cấp" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: "Token không hợp lệ hoặc đã hết hạn" });

        req.user = user;
        next();
    });
}



const tables_not_token = {
    "truong": ["ma_truong"],                                // Trường học
    "vai_tro": ["ma_vai_tro"],                              // Vai trò người dùng
    "nguoi_dung": ["ma_nguoi_dung"],                        // Người dùng
    "tai_khoan": ["ma_nguoi_dung"],                         // Tài khoản (dùng chung mã người dùng)

    "doi_bong": ["ma_doi_bong"],                            // Đội bóng
    "vi_tri_cau_thu": ["ma_vi_tri"],                        // Vị trí cầu thủ
    "cau_thu": ["ma_cau_thu"],                              // Cầu thủ

    "loai_trong_tai": ["ma_loai_trong_tai"],                // Loại trọng tài
    "trong_tai": ["ma_trong_tai"],                          // Trọng tài

    "giai_dau": ["ma_giai_dau"],                            // Giải đấu
    "cau_hinh_giai_dau": ["ma_giai_dau"],                   // Cấu hình giải đấu
    "vong_dau": ["ma_vong_dau"],                            // Vòng đấu (đã chuyển sang dùng mã vòng đấu làm PK)
    "bang_dau": ["ma_bang_dau"],                            // Bảng đấu (đã chuyển sang dùng mã bảng đấu làm PK)
    "san_van_dong": ["ma_san"],                             // Sân vận động

    "doi_bong_giai_dau": ["ma_doi_bong", "ma_giai_dau"],    // Đội bóng tham gia giải
    "cau_thu_giai_dau": ["ma_cau_thu", "ma_giai_dau"],      // Cầu thủ tham gia giải
    "trong_tai_tran_dau": ["ma_tran_dau", "ma_trong_tai"],  // Phân công trọng tài trận

    "tran_dau": ["ma_tran_dau"],                            // Trận đấu
    "su_kien_tran_dau": ["ma_su_kien"],                     // Sự kiện trận đấu

    "bang_xep_hang_vong_dau": ["ma_giai_dau", "ma_vong_dau", "ma_doi_bong"], // BXH vòng đấu
    "quy_tac_tinh_diem": ["ma_giai_dau", "ma_vong_dau"],    // Quy tắc tính điểm
    "cau_hinh_giao_dien": ["ma_cau_hinh_giao_dien"],                // Cấu hình giao diện người dùng
    "yeu_cau_tao_giai_dau":["ma_yeu_cau "],
};

// get : /api/{name_table}/{id_tbale}

const tables = {
    "truong": ["ma_truong"],                                // Trường học
    "vai_tro": ["ma_vai_tro"],                              // Vai trò người dùng
    "nguoi_dung": ["ma_nguoi_dung"],                        // Người dùng
    "tai_khoan": ["ma_nguoi_dung"],                         // Tài khoản (dùng chung mã người dùng)

    "doi_bong": ["ma_doi_bong"],                            // Đội bóng
    "vi_tri_cau_thu": ["ma_vi_tri"],                        // Vị trí cầu thủ
    "cau_thu": ["ma_cau_thu"],                              // Cầu thủ

    "loai_trong_tai": ["ma_loai_trong_tai"],                // Loại trọng tài
    "trong_tai": ["ma_trong_tai"],                          // Trọng tài

    "giai_dau": ["ma_giai_dau"],                            // Giải đấu
    "cau_hinh_giai_dau": ["ma_giai_dau"],                   // Cấu hình giải đấu
    "vong_dau": ["ma_vong_dau"],                            // Vòng đấu (đã chuyển sang dùng mã vòng đấu làm PK)
    "bang_dau": ["ma_bang_dau"],                            // Bảng đấu (đã chuyển sang dùng mã bảng đấu làm PK)
    "san_van_dong": ["ma_san"],                             // Sân vận động

    "doi_bong_giai_dau": ["ma_doi_bong", "ma_giai_dau"],    // Đội bóng tham gia giải
    "cau_thu_giai_dau": ["ma_cau_thu", "ma_giai_dau"],      // Cầu thủ tham gia giải
    "trong_tai_tran_dau": ["ma_tran_dau", "ma_trong_tai"],  // Phân công trọng tài trận

    "tran_dau": ["ma_tran_dau"],                            // Trận đấu
    "su_kien_tran_dau": ["ma_su_kien"],                     // Sự kiện trận đấu

    "bang_xep_hang_vong_dau": ["ma_giai_dau", "ma_vong_dau", "ma_doi_bong"], // BXH vòng đấu
    "quy_tac_tinh_diem": ["ma_giai_dau", "ma_vong_dau"],    // Quy tắc tính điểm
    "cau_hinh_giao_dien": ["ma_cau_hinh_giao_dien"],                // Cấu hình giao diện người dùng
    "yeu_cau_tao_giai_dau":["ma_yeu_cau "],
};


app.post("/api/dang-nhap", (req, res) => {
    const { ten_dang_nhap, mat_khau } = req.body;

    if (!ten_dang_nhap || !mat_khau) {
        return res.status(400).json({ message: "Thiếu tên đăng nhập hoặc mật khẩu" });
    }

    const sql = `SELECT * FROM tai_khoan WHERE ten_dang_nhap = ? AND mat_khau = ?`;

    db.query(sql, [ten_dang_nhap, mat_khau], (err, results) => {
        if (err) {
            return res.status(500).json({ message: "Lỗi server", error: err });
        }

        if (results.length === 0) {
            return res.status(401).json({ message: "Sai tên đăng nhập hoặc mật khẩu" });
        }

        const user = results[0];

        // Tạo JWT Token
        const token = jwt.sign(
            { ma_nguoi_dung: user.ma_nguoi_dung, vai_tro: user.vai_tro },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        return res.json({
            message: "Đăng nhập thành công",
            token,
            user
        });
    });
});
// đây là api không cần tocken // trả về nguyên bản

Object.entries(tables_not_token).forEach(([table, keys]) => {
    // GET - Lấy tất cả dữ liệu
    app.get(`/api_not_token/${table}`, (req, res) => {
        db.query(`SELECT * FROM ??`, [table], (err, results) => {
            if (err) return res.status(500).send(`Lỗi khi lấy dữ liệu từ ${table}`);
            res.json(results);
        });
    });

    // GET - Lấy một bản ghi theo khóa chính
    app.get(`/api_not_token/${table}/:${keys.map((_, i) => `id${i + 1}`).join("/:")}`, (req, res) => {
        const conditions = keys.map((key, i) => `?? = ?`).join(" AND ");
        const params = [table, ...keys.flatMap((key, i) => [key, req.params[`id${i + 1}`]])];

        db.query(`SELECT * FROM ?? WHERE ${conditions}`, params, (err, results) => {
            if (err) return res.status(500).send(`Lỗi khi lấy dữ liệu từ ${table}`);
            if (results.length === 0) return res.status(404).send(`Không tìm thấy dữ liệu trong ${table}`);
            res.json(results[0]);
        });
    });
});

Object.entries(tables).forEach(([table, keys]) => {
    // GET - Lấy tất cả dữ liệu
    // const moment = require("moment");

    function convertToYYYYMMDD(isoString) {
        if (typeof isoString === "string" && !isNaN(Date.parse(isoString))) {
            return new Date(isoString).toISOString().split("T")[0]; // YYYY-MM-DD
        }
        return isoString; // Nếu không phải ngày hợp lệ, giữ nguyên
    }

    function convertToMySQLDate(dateString) {
        if (typeof dateString === "string" && /^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
            return dateString; // Nếu đã là YYYY-MM-DD thì giữ nguyên
        }
        if (typeof dateString === "string" && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(dateString)) {
            return dateString.split("T")[0]; // Cắt bỏ phần giờ để lưu vào MySQL
        }
        return dateString; // Nếu không hợp lệ, giữ nguyên
    }
    // Chuyển ISO string hoặc Date về dạng datetime-local (YYYY-MM-DDTHH:mm)
    function convertToDatetimeLocal(dateInput) {
        let date = dateInput;
        if (typeof dateInput === "string" && !isNaN(Date.parse(dateInput))) {
            date = new Date(dateInput);
        }
        if (date instanceof Date && !isNaN(date)) {
            // Lấy phần YYYY-MM-DDTHH:mm
            return date.toISOString().slice(0, 16);
        }
        return dateInput;
    }// ...existing code...
    // Chuyển từ dạng datetime-local (YYYY-MM-DDTHH:mm) sang timestamp MySQL (YYYY-MM-DD HH:mm:ss)
    function convertToMySQLTimestamp(datetimeLocal) {
        if (typeof datetimeLocal === "string" && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(datetimeLocal)) {
            // Thêm :00 cho giây
            return datetimeLocal.replace("T", " ") + ":00";
        }
        // Nếu là dạng đầy đủ ISO, cắt lấy phần ngày giờ
        if (typeof datetimeLocal === "string" && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/.test(datetimeLocal)) {
            const d = new Date(datetimeLocal);
            return d.toISOString().replace("T", " ").slice(0, 19).replace("Z", "");
        }
        return datetimeLocal;
    }
    // ...existing code...
    app.get("/api", (req, res) => {
        const apiList = Object.entries(tables).map(([table, columns]) => {
            const idParams = columns.map((_, i) => `id${i + 1}`).join(":");
            return {
                tableName: table,
                endpoints: {
                    getAll: { path: `/api/${table}`, httpType: "GET" },
                    getOne: { path: `/api/${table}/:${idParams}`, httpType: "GET" },
                    create: { path: `/api/${table}`, httpType: "POST" },
                    update: { path: `/api/${table}/:${idParams}`, httpType: "PUT" },
                    delete: { path: `/api/${table}/:${idParams}`, httpType: "DELETE" }
                }
            };
        });

        apiList.push(
            {
                name: "imageCloudinary",
                endpoints: {
                    uploadImage: { path: "/api/imageCloudinary", httpType: "POST" },
                    getImage: { path: "/api/imageCloudinary/:public_id", httpType: "GET" },
                    updateImage: { path: "/api/imageCloudinary/:public_id", httpType: "PUT" },
                    deleteImage: { path: "/api/imageCloudinary/:public_id", httpType: "DELETE" }
                }
            }
        );

        res.json(apiList);
    });

    app.get("/api", (req, res) => {
        const apiList = Object.entries(tables).map(([table, columns]) => {
            const idParams = columns.map((_, i) => `id${i + 1}`).join(":");
            return {
                getAll: `/api/${table}`,
                getOne: `/api/${table}/:${idParams}`,
                create: `/api/${table}`,
                update: `/api/${table}/:${idParams}`,
                delete: `/api/${table}/:${idParams}`,
            };
        });

        apiList.push(
            { uploadImage: "/api/imageCloudinary" },
            { getImage: "/api/imageCloudinary/:public_id" },
            { updateImage: "/api/imageCloudinary/:public_id" },
            { deleteImage: "/api/imageCloudinary/:public_id" }
        );

        res.json(apiList);
    });

    /// nếu ko xử lý ngaỳ thì nó trả về dạng :  :::::   "ngay_tao": "2025-03-22T13:53:18.000Z"
    app.get(`/api/${table}`, verifyToken, (req, res) => {
        db.query(`SELECT * FROM ??`, [table], (err, results) => {
            if (err) return res.status(500).send(`Lỗi khi lấy dữ liệu từ ${table}`);

            // Kiểm tra và xử lý các trường ngày tháng
            const updatedResults = results.map(row => {
                Object.keys(row).forEach(key => {
                    let value = row[key];

                    // Nếu là object (có thể là kiểu Date của MySQL), chuyển thành chuỗi ISO
                    if (value instanceof Date) {
                        value = value.toISOString();
                    }

                    console.log(`Trước: ${key} =`, value); // Debug giá trị trước khi sửa

                    if (typeof value === "string" && value.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/)) {
                        row[key] = convertToDatetimeLocal(moment.utc(value).add(1, 'day').toISOString());
                        console.log(`Sau: ${key} =`, row[key]); // Debug giá trị sau khi sửa
                    }
                });
                return row;
            });

            res.json(updatedResults);
        });
    });

    // GET - Lấy một bản ghi theo khóa chính
    app.get(`/api/${table}/:${keys.map((_, i) => `id${i + 1}`).join("/:")}`, verifyToken, (req, res) => {
        const conditions = keys.map((key, i) => `?? = ?`).join(" AND ");
        const params = [table, ...keys.flatMap((key, i) => [key, req.params[`id${i + 1}`]])];

        db.query(`SELECT * FROM ?? WHERE ${conditions}`, params, (err, results) => {
            if (err) return res.status(500).send(`Lỗi khi lấy dữ liệu từ ${table}`);
            if (results.length === 0) return res.status(404).send(`Không tìm thấy dữ liệu trong ${table}`);

            let row = results[0];
            Object.keys(row).forEach(key => {
                let value = row[key];

                if (value instanceof Date) {
                    value = value.toISOString();
                }

                console.log(`Trước: ${key} =`, value); // Debug giá trị trước khi sửa

                if (typeof value === "string" && value.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/)) {
                    row[key] = convertToDatetimeLocal(moment.utc(value).add(1, 'day').toISOString());
                    console.log(`Sau: ${key} =`, row[key]); // Debug giá trị sau khi sửa
                }
            });

            res.json(row);
        });
    });

    app.delete(`/api/${table}/:${keys.map((_, i) => `id${i + 1}`).join("/:")}`, verifyToken, (req, res) => {

        const conditions = keys.map((key) => `\`${key}\` = ?`).join(" AND ");
        const params = [...keys.map((key, i) => req.params[`id${i + 1}`])];

        const sql = `DELETE FROM \`${table}\` WHERE ${conditions}`;
        console.log("SQL Query:", sql, "Params:", params); // Debug

        db.query(sql, params, (err) => {
            if (err) return res.status(500).send(`Lỗi khi xóa từ ${table}: ${err.message}`);
            res.send(`Xóa từ ${table} thành công`); // ✅ Phải có
        });

    });

    app.put(`/api/${table}/:${keys.map((_, i) => `id${i + 1}`).join("/:")}`, verifyToken, (req, res) => {
        if (Object.keys(req.body).length === 0) {
            return res.status(400).send("Không có dữ liệu để cập nhật.");
        }

        // Chuyển đổi dữ liệu ngày tháng sang định dạng MySQL (YYYY-MM-DD)
        Object.keys(req.body).forEach(key => {
            req.body[key] = convertToMySQLTimestamp(req.body[key]);
        });

        const updates = Object.keys(req.body).map(key => `\`${key}\` = ?`).join(", ");
        const values = [...Object.values(req.body), ...keys.map((_, i) => req.params[`id${i + 1}`])];

        const conditions = keys.map(key => `\`${key}\` = ?`).join(" AND ");
        const sql = `UPDATE \`${table}\` SET ${updates} WHERE ${conditions}`;

        db.query(sql, values, (err, result) => {
            if (err) {
                return res.status(500).send(`Lỗi khi cập nhật ${table}: ${err.message}`);
            }
            if (result.affectedRows === 0) {
                return res.status(404).send(`Không tìm thấy bản ghi để cập nhật.`);
            }
            res.status(200).end(); // Thành công, không gửi nội dung

        });
    });



    app.post(`/api/${table}`, verifyToken, (req, res) => {
        // Chuyển đổi dữ liệu ngày tháng sang định dạng MySQL (YYYY-MM-DD)
        Object.keys(req.body).forEach(key => {
            req.body[key] = convertToMySQLTimestamp(req.body[key]); // Chuyển đổi nếu là ngày hợp lệ
        });

        const columns = Object.keys(req.body);
        const values = Object.values(req.body);

        if (columns.length === 0) return res.status(400).send("Không có dữ liệu để thêm.");

        const sql = `INSERT INTO \`${table}\` (${columns.map(col => `\`${col}\``).join(", ")}) VALUES (${columns.map(() => "?").join(", ")})`;

        db.query(sql, values, (err) => {
            if (err) return res.status(500).send(`Lỗi khi thêm vào ${table}: ${err.message}`);
            res.status(201).send(`Thêm vào ${table} thành công`);
            //res.send(`Xóa từ ${table} thành công`); // ✅ Phải có
        });
    });


});

// tạo 1 api lấy cấu hình giao diện không cần đăng nhập 





// // Khởi động server
// app.listen(port, () => {
//     console.log(`Server đang chạy tại http://localhost:${port}`);
// });
app.listen(port, "0.0.0.0", () => {
    console.log(`Server is running on http://0.0.0.0:${port}`);
});
