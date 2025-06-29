import hamChung from "./model.hamChung.js";
import { GlobalStore, DoiTuyen } from "/frontend/global/global.js";
//C:\Users\vanti\Desktop\mvc_project\frontend\global\global.js

const hamChiTiet = {
    //==============Quan ly============================
    async dangNhap(formData) {
        return await dangNhap(formData);
    },
    async layDoiBongTheoQL(ma_ql_doi_bong) {
        return await layDoiBongTheoQL(ma_ql_doi_bong);
    },


};


async function dangNhap(formData) {
    const { tenDangNhap, matKhau } = formData;
    const url = GlobalStore.getLinkCongAPI() + 'dang-nhap';
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                ten_dang_nhap: tenDangNhap,
                mat_khau: matKhau
            })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("Đăng nhập thất bại:", data.message);
        //    alert("Sai tên đăng nhập hoặc mật khẩu");
            return null;
        }

        console.log("Đăng nhập thành công:", data);
        return data; // Trả về thông tin người dùng nếu thành công
    } catch (error) {
        console.error("Lỗi khi gọi API đăng nhập:", error);
        alert("Lỗi kết nối tới máy chủ");
        return null;
    }
}
// async function getThongtinUser(formData) {
//     const dataNguoiDung = await hamChung.layDanhSach("nguoi_dung");
//     // lấy ra 1 người thôi
//     const dataUser = dataNguoiDung.filter(item => item.ten_dang_nhap === formData.tenDangNhap);
// }

async function layDoiBongTheoQL(ma_ql_doi_bong) {
    const dataDoiBong = await hamChung.layDanhSach("doi_bong");
    const dataDoiBong_theoIdQuanLy = dataDoiBong.filter((item) => item.ma_ql_doi_bong === ma_ql_doi_bong);
    return dataDoiBong_theoIdQuanLy;
}
export default hamChiTiet;