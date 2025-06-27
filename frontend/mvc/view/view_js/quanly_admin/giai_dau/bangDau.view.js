export function getElementIds() {
    return {
        btnLuuThayDoi: document.getElementById("button_luu"),
        btnTaiLaiTrang: document.getElementById("button_taiLaiTrang"),
        maBangDau: document.getElementById("maBangDau"),
        tenBangDau: document.getElementById("tenBangDau"),
        maGiaiDau: document.getElementById("maGiaiDau"),
        maGiaiDau_chon_viewbody: document.getElementById("maGiaiDau_chon_viewbody"),
        form: document.getElementById("inputForm"),
        tableBody: document.getElementById("dataTable"),
    };
}

export async function viewTbody(data, hamChung, onEdit, onDelete) {
    const { tableBody, maGiaiDau_chon_viewbody } = getElementIds();
    if (!data) data = await hamChung.layDanhSach("bang_dau");
    if (maGiaiDau_chon_viewbody && maGiaiDau_chon_viewbody.value !== "All") {
        data = data.filter(item => item.ma_giai_dau === maGiaiDau_chon_viewbody.value);
    }
    tableBody.innerHTML = "";
    for (const item of data) {
        const data1giaiDau = await hamChung.layThongTinTheo_ID("giai_dau", item.ma_giai_dau);
        const row = document.createElement("tr");
        row.innerHTML = `
           <td style="text-align: center;">${data1giaiDau.ten_giai_dau}</td>
           <td style="text-align: center;">${item.ten_bang_dau}</td>
           <td style="text-align: center;"><button class="edit-btn btn btn-warning btn-sm">Sửa</button></td>
           <td style="text-align: center;"><button class="delete-btn btn btn-danger btn-sm">Xóa</button></td>
        `;
        tableBody.appendChild(row);

        row.querySelector(".edit-btn").addEventListener("click", () => onEdit(item));
        row.querySelector(".delete-btn").addEventListener("click", () => onDelete(item));
    }
}

export function fillForm(item) {
    const { maBangDau, tenBangDau, maGiaiDau } = getElementIds();
    maBangDau.value = item.ma_bang_dau;
    tenBangDau.value = item.ten_bang_dau;
    maGiaiDau.value = item.ma_giai_dau;
    window.scrollTo({ top: 0, behavior: "smooth" });
}

export async function loadDanhSachGiaiDau(hamChung) {
    const selectElement = document.getElementById("maGiaiDau");
    selectElement.innerHTML = '<option value="">-- Chọn Mã Giải Đấu --</option>';
    const data = await hamChung.layDanhSach("giai_dau");
    data.forEach(item => {
        const option = document.createElement("option");
        option.value = item.ma_giai_dau;
        option.textContent = `${item.ten_giai_dau}`;
        selectElement.appendChild(option);
    });
}

export async function loadDanhSachGiaiDau_chon_viewBody(hamChung) {
    const selectElement = document.getElementById("maGiaiDau_chon_viewbody");
    selectElement.innerHTML = '<option value="All">Tất Cả</option>';
    const data = await hamChung.layDanhSach("giai_dau");
    data.forEach(item => {
        const option = document.createElement("option");
        option.value = item.ma_giai_dau;
        option.textContent = `${item.ten_giai_dau}`;
        selectElement.appendChild(option);
    });
}