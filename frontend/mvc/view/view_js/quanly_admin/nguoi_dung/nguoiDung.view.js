import hamChung from "/frontend/mvc/model/global/model.hamChung.js";
export function getElementIds() {
    return {
        btnLuuThayDoi: document.getElementById("button_luu"),
        btnTaiLaiTrang: document.getElementById("button_taiLaiTrang"),

        maNguoiDung: document.getElementById("maNguoiDung"),
        maTruong: document.getElementById("maTruong"),
        hoTen: document.getElementById("hoTen"),
        gioiTinh: document.getElementById("gioiTinh"),
        email: document.getElementById("email"),
        soDienThoai: document.getElementById("soDienThoai"),
        ngaySinh: document.getElementById("ngaySinh"),
        form: document.getElementById("inputForm"),
        tableBody: document.getElementById("dataTable"),
    };
}

export function viewTbody(data, onEdit, onDelete) {
    const { tableBody } = getElementIds();
    tableBody.innerHTML = "";

    for (const item of data) {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td style="text-align: center;">${item.ma_nguoi_dung}</td>
            <td>${item.ma_truong ?? "---"}</td>
            <td>${item.ho_ten ?? "---"}</td>
            <td>${item.gioi_tinh ?? "---"}</td>
            <td>${item.email ?? "---"}</td>
            <td>${item.so_dien_thoai ?? "---"}</td>
            <td>${item.ngay_sinh ?? "---"}</td>
            <td style="text-align: center;"><button class="edit-btn btn btn-warning btn-sm">Sửa</button></td>
            <td style="text-align: center;"><button class="delete-btn btn btn-danger btn-sm">Xóa</button></td>
        `;
        tableBody.appendChild(row);

        row.querySelector(".edit-btn").addEventListener("click", () => onEdit(item));
        row.querySelector(".delete-btn").addEventListener("click", () => onDelete(item));
    }
}

export function fillForm(item) {
    const { maNguoiDung, maTruong, hoTen, gioiTinh, email, soDienThoai, ngaySinh } = getElementIds();
    maNguoiDung.value = item.ma_nguoi_dung;
    maTruong.value = item.ma_truong;
    hoTen.value = item.ho_ten;
    gioiTinh.value = item.gioi_tinh;;
    email.value = item.email;
    soDienThoai.value = item.so_dien_thoai;
    ngaySinh.value = item.ngay_sinh;
    window.scrollTo({ top: 0, behavior: "smooth" });
}

export async function loadDanhSachTruong() {
    const selectElement = document.getElementById("maTruong");
    selectElement.innerHTML = '<option value="">-- Chọn Trường --</option>';
    const data = await hamChung.layDanhSach("truong");
    data.forEach(item => {
        const option = document.createElement("option");
        option.value = item.ma_truong;
        option.textContent = `${item.ten_truong}`;
        selectElement.appendChild(option);
    });
}