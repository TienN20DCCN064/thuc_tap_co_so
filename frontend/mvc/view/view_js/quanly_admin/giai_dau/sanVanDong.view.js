import hamChung from "/frontend/mvc/model/global/model.hamChung.js";
export function getElementIds() {
    return {
        btnLuuThayDoi: document.getElementById("button_luu"),
        btnTaiLaiTrang: document.getElementById("button_taiLaiTrang"),
        maSan: document.getElementById("maSan"),
        maGiaiDau: document.getElementById("maGiaiDau"),
        tenSan: document.getElementById("tenSan"),
        diaChi: document.getElementById("diaChi"),
        sucChua: document.getElementById("sucChua"),
        moTa: document.getElementById("moTa"),
        maGiaiDau_chon_viewbody: document.getElementById("maGiaiDau_chon"),
        form: document.getElementById("inputForm"),
        tableBody: document.getElementById("dataTable"),
    };
}

export async function viewTbody(data, onEdit, onDelete) {
    const { tableBody } = getElementIds();
    tableBody.innerHTML = "";
    for (const item of data) {
        const row = document.createElement("tr");
       const data1giaiDau = await hamChung.layThongTinTheo_ID("giai_dau", item.ma_giai_dau);
        row.innerHTML = `
            <td style="text-align: center;">${item.ma_san}</td>
            <td style="text-align: center;">${data1giaiDau.ten_giai_dau}</td>
            <td style="text-align: center;">${item.ten_san}</td>
            <td style="text-align: center;">${item.dia_chi}</td>
            <td style="text-align: center;">${item.suc_chua}</td>
            <td style="text-align: center;">${item.mo_ta || ""}</td>
            <td style="text-align: center;"><button class="edit-btn btn btn-warning btn-sm">Sửa</button></td>
            <td style="text-align: center;"><button class="delete-btn btn btn-danger btn-sm">Xóa</button></td>
        `;
        tableBody.appendChild(row);

        row.querySelector(".edit-btn").addEventListener("click", () => onEdit(item));
        row.querySelector(".delete-btn").addEventListener("click", () => onDelete(item));
    }
}

export function fillForm(item) {
    const { maSan, maGiaiDau, tenSan, diaChi, sucChua, moTa } = getElementIds();
    maSan.value = item.ma_san;
    maGiaiDau.value = item.ma_giai_dau;
    tenSan.value = item.ten_san;
    diaChi.value = item.dia_chi;
    sucChua.value = item.suc_chua;
    moTa.value = item.mo_ta || "";
    window.scrollTo({ top: 0, behavior: "smooth" });
}

export async function loadDanhSachGiaiDau() {
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

export async function loadDanhSachGiaiDau_chon_viewBody() {
    const selectElement = document.getElementById("maGiaiDau_chon");
    selectElement.innerHTML = '<option value="All">-- Tất cả Giải Đấu --</option>';
    const data = await hamChung.layDanhSach("giai_dau");
    data.forEach(item => {
        const option = document.createElement("option");
        option.value = item.ma_giai_dau;
        option.textContent = `${item.ten_giai_dau}`;
        selectElement.appendChild(option);
    });
}