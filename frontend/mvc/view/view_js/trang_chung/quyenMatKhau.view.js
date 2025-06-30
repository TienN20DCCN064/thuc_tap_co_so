import hamChung from "/frontend/mvc/model/global/model.hamChung.js";

export function getElementIds() {
    return {
        newPasswordSection: document.getElementById("newPasswordSection"),
        loginSection: document.getElementById("loginSection"),

        btnDangNhap: document.getElementById("btnDangNhap"),
        btnNhapMa: document.getElementById("btnNhapMa"),
        taiKhoan: document.getElementById("taiKhoan"),
        email: document.getElementById("EmailDangKy"),
        activation_code: document.getElementById("activation_code"),
        form: document.getElementById("loginForm"),
        newPassword_Form: document.getElementById("newPassword_Form"),
        newPassword: document.getElementById("newPassword"),
        confirmPassword: document.getElementById("confirmPassword"),
        btnDoiMatKhau: document.getElementById("btnDoiMatKhau"),
        btnQuayLai: document.getElementById("btnQuayLai")

    };
}

export function showActivationInput() {
    const { activation_code } = getElementIds();
    activation_code.style.display = "block";
    activation_code.focus();
}

export function hideActivationInput() {
    const { activation_code, btnNhapMa } = getElementIds();
    activation_code.style.display = "none";
    btnNhapMa.style.display = "none";
}

export function resetForm() {
    const { taiKhoan, email, activation_code } = getElementIds();
    taiKhoan.value = "";
    email.value = "";
    activation_code.value = "";
    hideActivationInput();
}

export function doi_section_login_password() {
    const { newPasswordSection, loginSection } = getElementIds();
    if (newPasswordSection.style.display === "none") {
        newPasswordSection.style.display = "block";
        loginSection.style.display = "none";
    }
    else{
        newPasswordSection.style.display = "none";
        loginSection.style.display = "block";
    }
}