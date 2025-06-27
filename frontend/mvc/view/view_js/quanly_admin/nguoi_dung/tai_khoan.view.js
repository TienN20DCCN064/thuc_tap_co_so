export function getElementIds() {
    return {
        btnLuuThayDoi: document.getElementById("button_luu"),
        btnTaiLaiTrang: document.getElementById("button_taiLaiTrang"),
        taiKhoan: document.getElementById("taiKhoan"),
        matKhau: document.getElementById("matKhau"),
        trangThai: document.getElementById("trangThai"),
        maVaiTro: document.getElementById("maVaiTro"),
        form: document.getElementById("inputForm"),
        tableBody: document.getElementById("dataTable"),
    };
}

export async function viewTbody(data, hamChung, onEdit, onDelete) {
    const { tableBody } = getElementIds();
    tableBody.innerHTML = "";

    for (const item of data) {
        const row = document.createElement("tr");
        const data1vaiTro = await hamChung.layThongTinTheo_ID("vai_tro", item.ma_vai_tro);
        row.innerHTML = `
            <td style="text-align: center;">${item.tai_khoan}</td>
            <td style="text-align: center;">${item.mat_khau}</td>
            <td style="text-align: center;">${item.trang_thai}</td>
            <td style="text-align: center;">${data1vaiTro.ten_vai_tro}</td>
            <td style="text-align: center;"><button class="edit-btn btn btn-warning btn-sm">Sửa</button></td>
            <td style="text-align: center;"><button class="delete-btn btn btn-danger btn-sm">Xóa</button></td>
        `;
        tableBody.appendChild(row);

        row.querySelector(".edit-btn").addEventListener("click", () => onEdit(item));
        row.querySelector(".delete-btn").addEventListener("click", () => onDelete(item));
    }
}

export function fillForm(item) {
    const { taiKhoan, matKhau, trangThai, maVaiTro } = getElementIds();
    taiKhoan.value = item.tai_khoan;
    matKhau.value = item.mat_khau;
    trangThai.value = item.trang_thai;
    maVaiTro.value = item.ma_vai_tro;
    window.scrollTo({ top: 0, behavior: "smooth" });
}

export async function loadDanhSachVaiTro(hamChung) {
    const selectElement = document.getElementById("maVaiTro");
    selectElement.innerHTML = '<option value="">-- Chọn Vai Trò --</option>';
    const data = await hamChung.layDanhSach("vai_tro");
    data.forEach(item => {
        const option = document.createElement("option");
        option.value = item.ma_vai_tro;
        option.textContent = `${item.ten_vai_tro}`;
        selectElement.appendChild(option);
    });
}