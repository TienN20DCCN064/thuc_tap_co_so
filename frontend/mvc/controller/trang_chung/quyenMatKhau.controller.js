import hamChung from "/frontend/mvc/model/global/model.hamChung.js";
import {
    getElementIds,
    showActivationInput,
    hideActivationInput,
    resetForm,
    doi_section_login_password
} from "/frontend/mvc/view/view_js/trang_chung/quyenMatKhau.view.js";

let maSo = ""; // Mã xác thực
let isActivationShown = false;

const { newPasswordSection, loginSection, btnDangNhap, btnNhapMa, taiKhoan, email, activation_code, form,
    newPassword,
    confirmPassword,
    btnDoiMatKhau,
    btnQuayLai, newPassword_Form,
} = getElementIds();

document.addEventListener("DOMContentLoaded", function () {
    hideActivationInput();
    btnDangNhap.addEventListener("click", handleCheckTk_email);
    btnNhapMa.addEventListener("click", handleNhapMa);
    if (btnDoiMatKhau) {
        btnDoiMatKhau.addEventListener("click", handleXacNhan_DoiMatKhau);
        btnQuayLai.addEventListener("click", handleQuayLai);
    }

});

async function handleCheckTk_email(event) {
    event.preventDefault();
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    const username = taiKhoan.value.trim();
    const emailValue = email.value.trim();

    if (!isActivationShown) {
        const ketQua = await check_tk_va_gmail(username, emailValue);
        if (ketQua !== "Hợp lệ") {
            alert(ketQua);
            return;
        }
        // alert("Đã gửi mã đến " + emailValue);
        maSo = random_numberCode();
        console.log("Mã kích hoạt:", maSo);
        await hamChung.sendEmail(emailValue, "Mã kích hoạt", maSo);
        showActivationInput();
        isActivationShown = true;
        // tôi muốn không cho nhập tài khoản lại
        taiKhoan.readOnly = true;
        email.readOnly = true;

        btnDangNhap.style.display = "none";
        btnNhapMa.style.display = "block";
        return;
    }



}
async function handleNhapMa(event) {
    activation_code.required = true;
    event.preventDefault();
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    if (activation_code.value.trim() !== maSo) {
        alert("Mã kích hoạt không đúng!");
        return;
    }
    // alert("Mã kích hoạt đúng!");
    // chuyển sang form nhập mật khẩu mới
    doi_section_login_password();
}
async function handleXacNhan_DoiMatKhau(event) {
    event.preventDefault();
    if (!newPassword_Form.checkValidity()) {
        newPassword_Form.reportValidity();
        return;
    }
    if (newPassword.value !== confirmPassword.value) {
        alert("Mật khẩu không khớp!");
        return;
    }
    const username = taiKhoan.value.trim();
    const newPasswordValue = newPassword.value.trim();

    // Cập nhật mật khẩu mới
    const dataTaiKhoan = await hamChung.layDanhSach_notToken("tai_khoan");
    const tonTai_tk = dataTaiKhoan.find(tk => tk.ten_dang_nhap === username);

    if (!tonTai_tk) {
        alert("Tài khoản không tồn tại!");
        return;
    }
    console.log(tonTai_tk);
    const formUpdate = {
        ma_nguoi_dung: tonTai_tk.ma_nguoi_dung,
        ten_dang_nhap: tonTai_tk.ten_dang_nhap,
        mat_khau: newPasswordValue
    }
    await hamChung.sua(formUpdate, "tai_khoan");

    alert("Đổi mật khẩu thành công!");
    resetForm();
}
async function handleQuayLai(event) {
    event.preventDefault(); // ngăn chặn hành vi mặc định (nếu là nút submit)
    location.reload();      // tải lại trang
}

function random_numberCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

async function check_tk_va_gmail(taiKhoan, email) {
    const dataTaiKhoan = await hamChung.layDanhSach_notToken("tai_khoan");
    const tonTai_tk = dataTaiKhoan.find(tk =>
        tk.ten_dang_nhap === taiKhoan
    );
    if (!tonTai_tk) {
        return "Tài khoản sai!";
    }
    const data1NguoiDung = await hamChung.layThongTinTheo_ID_notToken("nguoi_dung", tonTai_tk.ma_nguoi_dung);
    console.log(data1NguoiDung);
    if (data1NguoiDung.email != email) {
        return "Sai email!";
    }
    else {
        return "Hợp lệ";
    }
}


