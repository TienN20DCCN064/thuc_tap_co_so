import hamChung from "/frontend/mvc/model/global/model.hamChung.js";

export function getElementIds() {
    return {
        btnLuuThayDoi: document.getElementById("button_luu"),
        btnTaiLaiTrang: document.getElementById("button_taiLaiTrang"),
        maCauHinhGiaoDien: document.getElementById("maCauHinhGiaoDien"),
        tenCauHinhGiaoDien: document.getElementById("tenCauHinhGiaoDien"),
        background: document.getElementById("background"),
        backgroundFile: document.getElementById("backgroundFile"),

        maGiaiDau: document.getElementById("maGiaiDau"),
        maVongDau: document.getElementById("maVongDau"),
        maTranDau: document.getElementById("maTranDau"),
        isDangSuDung: document.getElementById("isDangSuDung"),
        form: document.getElementById("inputForm"),
        tableBody: document.getElementById("dataTable"),
    };
}

export async function viewTbody(data, onEdit, onDelete) {
    const { tableBody } = getElementIds();
    if (!data) data = await hamChung.layDanhSach("cau_hinh_giao_dien");
    tableBody.innerHTML = "";
    for (const item of data) {
        let hinh_anh;
        if (item.background === null || item.background === "") {
            // hinh_anh = "/frontend/assets/public/images/cat-2.png";
            hinh_anh = "/frontend/assets/public/images/user-icon.png";
            // C:\Users\vanti\Desktop\mvc_project\frontend\assets\public\images\cat-2.png
        } else {
            hinh_anh = await hamChung.getImage(item.background);
        }
        const row = document.createElement("tr");
        row.innerHTML = `
            <td style="text-align: center;">${item.ma_cau_hinh_giao_dien}</td>
            <td>${item.ten_cau_hinh_giao_dien || "---"}</td>
            <td style="text-align: center;"><img src="${hinh_anh}" alt="Hình ảnh" width="50"></td>
            <td>${item.ma_tran_dau || "---"}</td>
            <td>${item.is_dang_su_dung == 1 ? "Có" : "Không"}</td>
            <td><button class="edit-btn btn btn-warning btn-sm">Sửa</button></td>
            <td><button class="delete-btn btn btn-danger btn-sm">Xóa</button></td>
        `;
        tableBody.appendChild(row);

        row.querySelector(".edit-btn").addEventListener("click", () => onEdit(item));
        row.querySelector(".delete-btn").addEventListener("click", () => onDelete(item));
    }
}

export async function fillForm(item) {
    const { maCauHinhGiaoDien, tenCauHinhGiaoDien, background, maGiaiDau, maVongDau, maTranDau, isDangSuDung } = getElementIds();
    const data1TranDau = await hamChung.layThongTinTheo_ID("tran_dau", item.ma_tran_dau);
    await loadDanhSachVongDau(data1TranDau.ma_giai_dau);
    await loadDanhSachTranDau(data1TranDau.ma_giai_dau, data1TranDau.ma_vong_dau);

    maCauHinhGiaoDien.value = item.ma_cau_hinh_giao_dien;
    tenCauHinhGiaoDien.value = item.ten_cau_hinh_giao_dien;
    background.value = item.background;
    maGiaiDau.value = data1TranDau.ma_giai_dau;
    maVongDau.value = data1TranDau.ma_vong_dau;
    maTranDau.value = data1TranDau.ma_tran_dau;
    isDangSuDung.value = item.is_dang_su_dung;
    window.scrollTo({ top: 0, behavior: "smooth" });
}
export async function loadDanhSachGiaiDau() {
    const selectElement = document.getElementById("maGiaiDau");
    selectElement.innerHTML = '<option value="">-- Chọn Giải Đấu --</option>';
    const data = await hamChung.layDanhSach("giai_dau");
    data.forEach(item => {
        const option = document.createElement("option");
        option.value = item.ma_giai_dau;
        option.textContent = `${item.ten_giai_dau}`;
        selectElement.appendChild(option);
    });
}
export async function loadDanhSachVongDau(maGiaiDau) {
    const selectElement = document.getElementById("maVongDau");
    selectElement.innerHTML = '<option value="">-- Chọn Vòng Đấu --</option>';
    const dataVongDau = await hamChung.layDanhSach("vong_dau");
    let data = maGiaiDau ? dataVongDau.filter(item => item.ma_giai_dau === maGiaiDau) : [];
    data.forEach(item => {
        const option = document.createElement("option");
        option.value = item.ma_vong_dau;
        option.textContent = `${item.ma_vong_dau} - ${item.ten_vong_dau}`;
        selectElement.appendChild(option);
    });
}

export async function loadDanhSachTranDau(maGiaiDau, maVongDau) {
    const selectElement = document.getElementById("maTranDau");
    selectElement.innerHTML = '<option value="">-- Chọn Trận Đấu --</option>';
    const dataTranDau = await hamChung.layDanhSach("tran_dau");
    let data = dataTranDau;
    if (maGiaiDau) {
        data = data.filter(item => item.ma_giai_dau === maGiaiDau);
    }
    if (maVongDau) {
        data = data.filter(item => item.ma_vong_dau === maVongDau);
    }
    data.forEach(item => {
        const option = document.createElement("option");
        option.value = item.ma_tran_dau;
        option.textContent = `${item.ma_tran_dau} - ${item.ten_tran_dau}`;
        selectElement.appendChild(option);
    });
}   