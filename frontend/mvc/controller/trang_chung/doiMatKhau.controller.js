import bcrypt from 'bcrypt';  // Nếu dùng môi trường Node.js, hoặc gọi bcrypt client nếu có
import hamChung from "/frontend/mvc/model/global/model.hamChung.js";
import { GlobalStore, DoiTuyen } from "/frontend/global/global.js";
import thongBao from "/frontend/assets/components/thongBao.js";

document.addEventListener("DOMContentLoaded", function () {
    const form_changePassword = document.getElementById("form_changePassword");
    const oldPass = document.getElementById("old_password").value.trim();
    const newPass = document.getElementById("new_password").value.trim();
    const confirm = document.getElementById("confirm_password").value.trim();
    const btn_trangChu = document.getElementById("btn_trangChu");
    form_changePassword.addEventListener("submit", async function (e) {
        e.preventDefault(); // Ngăn submit form mặc định
        const data1TaiKhoan = await hamChung.layThongTinTheo_ID("tai_khoan", GlobalStore.getUsername());
        console.log("Dữ liệu tài khoản:", data1TaiKhoan);

        console.log(localStorage.getItem("token"));
        if (!data1TaiKhoan) {
            thongBao.thongBao_error("Không tìm thấy thông tin tài khoản!", null, "error");
            return;
        }
        if (newPass !== confirm) {
            thongBao.thongBao_error("Mật khẩu mới và xác nhận không khớp!", null, "error");
            return;
        }
        
        if (oldPass !== data1TaiKhoan.mat_khau) {
            thongBao.thongBao_error("Mật khẩu không chính xác!", null, "error");
            return;
        }
        if (oldPass === newPass) {
            thongBao.thongBao_error("Mật khẩu mới giống mật khẩu hiện tại!", null, "error");
            return;
        }

        console.log(data1TaiKhoan);
        const formData = {
            ma_nguoi_dung: data1TaiKhoan.ma_nguoi_dung,
            mat_khau: newPass, // Cập nhật mật khẩu mới
        };
        await hamChung.sua(formData, "tai_khoan");
        thongBao.thongBao_error("Sửa thông tin thành công!", 3000, "success");
        console.log(formData);

        window.location.href = "/frontend/mvc/view/view_html/trang_chung/dangNhap.html";
    });
    btn_trangChu.addEventListener("click", async function () {
        const data1TaiKhoan = await hamChung.layThongTinTheo_ID("tai_khoan", GlobalStore.getUsername());
        if (data1TaiKhoan.ma_vai_tro === "VT01") {
            window.location.href = "/frontend/mvc/view/view_html/quanly_admin/trang_chu.html";
        }
        else if (data1TaiKhoan.ma_vai_tro === "VT02") {
            window.location.href = "/frontend/mvc/view/view_html/quanly_doiBong/trang_chu.html";
        }
        else {
            window.location.href = "/frontend/mvc/view/view_html/trang_chung/dangNhap.html";
        }
    });

});

