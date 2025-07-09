
async function redirectToRolePage() {
    const data1TaiKhoan = await hamChung.layThongTinTheo_ID("tai_khoan", GlobalStore.getUsername());
    // lấy đường dẫn trang web hiện tại
    const currentUrl = window.location.pathname;
    const pathParts = currentUrl.split('/');
    const role_web = pathParts[5]; // lấy phần thứ 5 trong đường dẫn
    if (!data1TaiKhoan.ma_nguoi_dung) {

        window.location.href = "/frontend/mvc/view/view_html/trang_chung/dangNhap.html";

    }
    else {
        console.log("dang check tai khoan  và trang web:", data1TaiKhoan);
        if (data1TaiKhoan.trang_thai === "Bị khóa") {
            window.location.href = "/frontend/mvc/view/view_html/trang_chung/dangNhap.html";
            return;
        }
        if (data1TaiKhoan.ma_vai_tro === "VT01" && role_web === "quanly") {
            window.location.href = "/frontend/mvc/view/view_html/quanly_admin/trang_chu.html";
            return;
        }
        if (data1TaiKhoan.ma_vai_tro === "VT02" && role_web === "quanly_admin") {
            window.location.href = "/frontend/mvc/view/view_html/quanly/trang_chu.html";
            return;
        }
    }

}