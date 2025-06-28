import hamChung from "/frontend/mvc/model/global/model.hamChung.js";
export function getElementIds() {
    return {
        btnLuuThayDoi: document.getElementById("button_luu"),
        btnTaiLaiTrang: document.getElementById("button_taiLaiTrang"),
        maNguoiDung: document.getElementById("maNguoiDung"),
        taiKhoan: document.getElementById("taiKhoan"),
        hoTen: document.getElementById("hoTen"),
        gioiTinh: document.getElementById("gioiTinh"),
        email: document.getElementById("email"),
        soDienThoai: document.getElementById("soDienThoai"),
        ngayTao: document.getElementById("ngayTao"),
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
            <td>${item.tai_khoan ?? "---"}</td>
            <td>${item.ho_ten}</td>
            <td>${item.gioi_tinh}</td>
            <td>${item.email}</td>
            <td>${item.so_dien_thoai}</td>
            <td>${item.ngay_tao}</td>
            <td style="text-align: center;"><button class="edit-btn btn btn-warning btn-sm">Sửa</button></td>
            <td style="text-align: center;"><button class="delete-btn btn btn-danger btn-sm">Xóa</button></td>
        `;
        tableBody.appendChild(row);

        row.querySelector(".edit-btn").addEventListener("click", () => onEdit(item));
        row.querySelector(".delete-btn").addEventListener("click", () => onDelete(item));
    }
}

export function fillForm(item) {
    const { maNguoiDung, taiKhoan, hoTen, gioiTinh, email, soDienThoai, ngayTao } = getElementIds();
    maNguoiDung.value = item.ma_nguoi_dung;
    taiKhoan.value = item.tai_khoan;
    hoTen.value = item.ho_ten;
    gioiTinh.value = item.gioi_tinh.charAt(0).toUpperCase() + item.gioi_tinh.slice(1);
    email.value = item.email;
    soDienThoai.value = item.so_dien_thoai;
    ngayTao.value = item.ngay_tao;
    window.scrollTo({ top: 0, behavior: "smooth" });
}

export async function loadDanhSachTaiKhoan() {
    const selectElement = document.getElementById("taiKhoan");
    selectElement.innerHTML = '<option value="">-- Chọn Tài Khoản --</option>';
    const data = await hamChung.layDanhSach("tai_khoan");
    data.forEach(item => {
        const option = document.createElement("option");
        option.value = item.tai_khoan;
        option.textContent = `${item.tai_khoan}`;
        selectElement.appendChild(option);
    });
}