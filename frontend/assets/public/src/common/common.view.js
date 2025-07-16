import hamChung from "/frontend/mvc/model/global/model.hamChung.js";
import { GlobalStore, DoiTuyen } from "/frontend/global/global.js";
document.addEventListener("DOMContentLoaded", async function () {
    // Your code here
    let url_common = "";
    const currentUrl = window.location.pathname;
    const pathParts = currentUrl.split('/');
    const role_web = pathParts[5]; // lấy phần thứ 5 trong đường dẫn
    //C:\Users\vanti\Desktop\mvc_project\frontend\assets\public\src\common\quanly_admin\header.html
    if (role_web === "quanly_admin") {
        url_common = "/frontend/assets/public/src/common/quanly_admin/header.html";
    }
    //C:\Users\vanti\Desktop\mvc_project\frontend\assets\public\src\common\quanly_doiBong\header.html
    else if (role_web === "quanly_doiBong") {
        url_common = "/frontend/assets/public/src/common/quanly_doiBong/header.html";
    }
    fetch(url_common)
        .then(response => response.text())
        .then(data => {
            document.getElementById('chen').innerHTML = data;
        })
        .catch(error => console.error('Error loading HTML:', error));
    // Kiểm tra và chuyển hướng người dùng đến trang tương ứng với vai trò
    await redirectToRolePage(role_web);

});

// Hàm để chuyển hướng người dùng đến trang tương ứng với vai trò
async function redirectToRolePage(role_web) {
    const data1TaiKhoan = await hamChung.layThongTinTheo_ID("tai_khoan", GlobalStore.getUsername());

    if (!data1TaiKhoan.ma_nguoi_dung) {
        window.location.href = "/frontend/mvc/view/view_html/trang_chung/dangNhap.html";
    }
    else {
        if (data1TaiKhoan.trang_thai === "Bị khóa") {
            window.location.href = "/frontend/mvc/view/view_html/trang_chung/dangNhap.html";
            return;
        }
        if (data1TaiKhoan.ma_vai_tro === "VT01" && role_web === "quanly_doiBong") {
           // console.log("redirect to quanly_admin");
            window.location.href = "/frontend/mvc/view/view_html/quanly_admin/trang_chu.html";
            return;
        }
        if (data1TaiKhoan.ma_vai_tro === "VT02" && role_web === "quanly_admin") {
         //   console.log("redirect to quanly_doiBong");
            window.location.href = "/frontend/mvc/view/view_html/quanly_doiBong/trang_chu.html";
            return;
        }
    }

}