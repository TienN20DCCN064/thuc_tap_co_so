import hamChung from "/frontend/mvc/model/global/model.hamChung.js";
import hamChiTiet from "/frontend/mvc/model/global/model.hamChiTiet.js";
import * as VIEW_JS from "/frontend/mvc/view/view_js/trang_chung/hoSoCaNhan.view.js";
import { GlobalStore, DoiTuyen } from "/frontend/global/global.js";

//C:\Users\vanti\Desktop\mvc_project\frontend\mvc\controller\trang_chung\dangNhap.controller.js
import {
    getElementIds,
    loadDanhSachTruong,
    fillForm,
} from "/frontend/mvc/view/view_js/trang_chung/hoSoCaNhan.view.js";
// C:\Users\vanti\Desktop\mvc_project\frontend\mvc\view\view_js\trang_chung\hoSoCaNhan.view.js

const IDS = VIEW_JS.getElementIds();
const URL_DANG_NHAP = "/frontend/mvc/view/view_html/trang_chung/dangNhap.html";
document.addEventListener("DOMContentLoaded", async function () {
    const check = await check_thongTin_nguoiDungWeb();
    if (!check) {
        alert("Thông tin người dùng không hợp lệ. Vui lòng đăng nhập lại.");
        window.location.href = URL_DANG_NHAP;
        return;
    }
    
    await loadDanhSachTruong();

    const data1NguoiDung = await hamChung.layThongTinTheo_ID("nguoi_dung", GlobalStore.getUsername());
    await fillForm(data1NguoiDung);
    console.log("data1NguoiDung", data1NguoiDung);
    IDS.btnCapNhat.addEventListener("click", async function (event) {
        event.preventDefault(); // Ngừng hành động gửi form mặc định
        await handleCapNhatThongTin();
    });
});

async function check_thongTin_nguoiDungWeb() {
    if (GlobalStore.getUsername() === null || GlobalStore.getUsername() === "null") {
        window.location.href = URL_DANG_NHAP;
        return false;
    }
    let data1NguoiDung;
    data1NguoiDung = await hamChung.layThongTinTheo_ID("nguoi_dung", GlobalStore.getUsername());
    if (!data1NguoiDung) {
        return false;
    }
    if (data1NguoiDung.message === 'Token không được cung cấp') {
        return false;
    }

    // check token
    return true;

}

async function handleCapNhatThongTin() {
    if (!IDS.hoSoForm.checkValidity()) {
        IDS.hoSoForm.reportValidity();
        return;
    }
    const formData = {
        ma_nguoi_dung: GlobalStore.getUsername(),
        ma_truong: IDS.maTruong.value,
        ho_ten: IDS.hoTen.value,
        gioi_tinh: IDS.gioiTinh.value,
        // email: IDS.emailInput.value,
        so_dien_thoai: IDS.soDienThoai.value,
        // ngày sinh dạng 2002-01-01T17:00
        ngay_sinh: IDS.ngaySinh.value ? IDS.ngaySinh.value + "T00:00" : "",
    };
    console.log("Cập nhật thông tin người dùng:", formData);
    await hamChung.sua(formData, "nguoi_dung");
    alert("Cập nhật thông tin thành công!");

}

