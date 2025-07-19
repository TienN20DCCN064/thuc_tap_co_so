import hamChung from "/frontend/mvc/model/global/model.hamChung.js";
export function getElementIds() {
    return {
        hoSoForm: document.getElementById("hoSoForm"),
        // email: document.getElementById("email"),
        maTruong: document.getElementById("maTruong"),
        hoTen: document.getElementById("hoTen"),
        gioiTinh: document.getElementById("gioiTinh"),

        emailInput: document.getElementById("emailInput"),
        soDienThoai: document.getElementById("soDienThoai"),
        ngaySinh: document.getElementById("ngaySinh"),

        btnCapNhat: document.getElementById("btnCapNhat"),

    };
}

export function fillForm(item) {
    const Ids = getElementIds();
    Ids.maTruong.value = item.ma_truong;
    Ids.hoTen.value = item.ho_ten;
    if (item.gioi_tinh) {

        Ids.gioiTinh.value = item.gioi_tinh;
    }
    Ids.emailInput.value = item.email;
    Ids.soDienThoai.value = item.so_dien_thoai;
    Ids.ngaySinh.value = item.ngay_sinh ? item.ngay_sinh.split("T")[0] : ""; // Chuyển đổi định dạng ngày

    window.scrollTo({ top: 0, behavior: "smooth" });
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
