import hamChung from "/frontend/mvc/model/global/model.hamChung.js";
import hamChiTiet from "/frontend/mvc/model/global/model.hamChiTiet.js";
import * as controller_view from "/frontend/mvc/view/view_js/trang_chung/dangKyTaiKhoan.view.js";
import { GlobalStore, DoiTuyen } from "/frontend/global/global.js";

//C:\Users\vanti\Desktop\mvc_project\frontend\mvc\controller\trang_chung\dangNhap.controller.js


const {
    dangKyForm,
    maTruong,
    hoTen,
    ngaySinh,
    emailInput,
    taiKhoan,
    matKhau,
    nhapLaiMatKhau,
    btnDangKy
} = controller_view.getElementIds();


document.addEventListener("DOMContentLoaded", async function () {
    console.log("Đã tải trang đăng ký");
    console.log("TaiKhoan" + taiKhoan.value);

    await controller_view.loadDanhSachTruong();

    controller_view.lock_unlock_nhap_if_taiKhoan(true);
    console.log("TaiKhoan" + taiKhoan.value);


    btnDangKy.addEventListener("click", async function (event) {
        event.preventDefault(); // Ngừng hành động gửi form mặc định
        if (!dangKyForm.checkValidity()) {
            dangKyForm.reportValidity();
            return;
        }
        console.log("TaiKhoan" + taiKhoan.value.trim());

        if (taiKhoan.style.display === "none") {
           
            controller_view.lock_unlock_nhap_if_taiKhoan(false);
            return;
        }
        await check_dangKy();
    });


    //   controller_view.setupDialogCloseHandler();
});

async function check_dangKy() {


    const dataNguoiDung = await hamChung.layDanhSach("nguoi_dung");
    const dataTaiKhoan = await hamChung.layDanhSach("tai_khoan");
    // kiểm tra email đã tồn tại
    const checkEmail = dataNguoiDung.find(user => user.email === emailInput.value.trim());
    const checkTaiKhoan = dataTaiKhoan.find(user => user.ten_dang_nhap === taiKhoan.value.trim());
    if (checkEmail) {
        alert("Email đã tồn tại. Vui lòng sử dụng email khác.");
        return;
    }
    if (checkTaiKhoan) {
        alert("Tài khoản đã tồn tại. Vui lòng sử dụng tài khoản khác.");
        return;
    }
    if (matKhau.value.trim() !== nhapLaiMatKhau.value.trim()) {
        alert("Mật khẩu không khớp. Vui lòng kiểm tra lại.");
        return;
    }
    await dangKyTaiKhoan();

}

async function dangKyTaiKhoan() {
    const maNguoiDung = await hamChung.taoID_theoBang("nguoi_dung");
    const formTaiKhoan = {
        ma_nguoi_dung: maNguoiDung,
        ten_dang_nhap: taiKhoan.value.trim(),
        mat_khau: matKhau.value.trim(),
        ma_vai_tro: "VT01",

    };
    const formNguoiDung = {
        ma_nguoi_dung: maNguoiDung,
        ma_truong: maTruong.value.trim(),
        ho_ten: hoTen.value.trim(),
        email: emailInput.value.trim(),
        ngay_sinh: ngaySinh.value.trim(),
    };
    console.log("Form tài khoản:", formTaiKhoan);
    console.log("Form người dùng:", formNguoiDung);
    await hamChung.them(formNguoiDung, "nguoi_dung");
    await hamChung.them(formTaiKhoan, "tai_khoan");

    
    // const isTaiKhoan = await check_maNguoiDung_co_taiKhoan(maNguoiDung);
    // if (isTaiKhoan) {
    //     alert("Đăng ký tài khoản thành công!");
    //     // Chuyển hướng đến trang đăng nhập
    //     console.log(`Tài khoản với mã người dùng: ${maNguoiDung} đã được tạo.`);
    // } else {
    //     alert("Đăng ký tài khoản không thành công. Vui lòng thử lại sau.");
    //     await xoa_taiKhoan_va_nguoiDung(maNguoiDung);

    // }
}
async function check_maNguoiDung_co_taiKhoan(ma_nguoi_dung) {
    const data1NguoiDung = await hamChung.layThongTinTheo_ID("nguoi_dung", ma_nguoi_dung);
    if (!data1NguoiDung) {
        console.log(`Không tìm thấy người dùng với mã: ${ma_nguoi_dung}`);
        return false;
    }

    const data1TaiKhoan = await hamChung.layDanhSach("tai_khoan");
    if (!data1TaiKhoan) {
        console.log(`Không tìm thấy tài khoản với mã người dùng: ${ma_nguoi_dung}`);
        return false;
    }
    return true;
}

async function xoa_taiKhoan_va_nguoiDung(ma_nguoi_dung) {
    const data1TaiKhoan = await hamChung.layThongTinTheo_ID("tai_khoan", ma_nguoi_dung);
    if (data1TaiKhoan) {
        await hamChung.xoa(data1TaiKhoan, "tai_khoan");
    } else {
        console.log(`Không tìm thấy tài khoản với mã người dùng: ${ma_nguoi_dung}`);
    }

    const data1NguoiDung = await hamChung.layThongTinTheo_ID("nguoi_dung", ma_nguoi_dung);
    if (data1NguoiDung) {
        await hamChung.xoa(data1NguoiDung, "nguoi_dung");
    } else {
        console.log(`Không tìm thấy người dùng với mã: ${ma_nguoi_dung}`);
    }
}