import hamChung from "/frontend/mvc/model/global/model.hamChung.js";
export function getElementIds() {
    return {
        dangKyForm: document.getElementById("dangKyForm"),
        // email: document.getElementById("email"),
        maTruong: document.getElementById("maTruong"),
        hoTen: document.getElementById("hoTen"),
        ngaySinh: document.getElementById("ngaySinh"),
        emailInput: document.getElementById("emailInput"),
        taiKhoan: document.getElementById("taiKhoan"),
        matKhau: document.getElementById("matKhau"),
        nhapLaiMatKhau: document.getElementById("nhapLaiMatKhau"),

        btnDangKy: document.getElementById("btnDangKy"),

    };
}
export async function loadDanhSachTruong() {
    const selectElement = document.getElementById("maTruong");
    selectElement.innerHTML = '<option value="">-- Chọn Trường --</option>';
    const data = await hamChung.layDanhSach("truong");
    data.forEach(item => {
        const option = document.createElement("option");
        option.value = item.ma_truong;
        option.textContent = `${item.ten_truong} (${item.ma_truong})`;
        selectElement.appendChild(option);
    });
}
export function lock_unlock_nhap_if_taiKhoan(isLocked) {
    const form_nguoiDung = [
        maTruong,
        hoTen,
        ngaySinh
    ];

    const form_taiKhoan = [
        emailInput,
        taiKhoan,
        matKhau,
        nhapLaiMatKhau
    ];

    if (isLocked) {
        // Ẩn & khóa phần tài khoản
        form_taiKhoan.forEach(field => {
            field.setAttribute("disabled", "disabled");
            field.style.display = "none";
            field.removeAttribute("required");
            field.value = "";
        });

        // Mở khóa phần người dùng
        form_nguoiDung.forEach(field => {
            // Nếu là select hoặc date → bỏ disabled
            if (field.tagName === "SELECT" || field.type === "date") {
                field.removeAttribute("disabled");
            } else {
                field.removeAttribute("readonly");
            }

            field.setAttribute("required", "required");
            field.style.display = "";
        });

    } else {
        // Khóa phần người dùng sau khi nhập
        form_nguoiDung.forEach(field => {
            if (field.tagName === "SELECT" || field.type === "date") {
                field.setAttribute("disabled", "disabled");
            } else {
                field.setAttribute("readonly", "readonly");
            }

            field.setAttribute("required", "required");
            field.style.display = "";
        });

        // Hiện & mở khóa phần tài khoản
        form_taiKhoan.forEach(field => {
            field.removeAttribute("disabled");
            field.style.display = "";
            field.setAttribute("required", "required");
        });
    }
}
