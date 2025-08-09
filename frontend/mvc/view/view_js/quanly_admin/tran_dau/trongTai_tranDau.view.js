import hamChung from "/frontend/mvc/model/global/model.hamChung.js";
import hamChiTiet from "/frontend/mvc/model/global/model.hamChiTiet.js";
import thongBao from "/frontend/assets/components/thongBao.js";
export function getElementIds() {
    return {
        btnLuuThayDoi: document.getElementById("button_luu"),
        btnTaiLaiTrang: document.getElementById("button_taiLaiTrang"),
        maGiaiDau: document.getElementById("maGiaiDau"),
        maTranDau: document.getElementById("maTranDau"),
        maTrongTai: document.getElementById("maTrongTai"),
        maLoaiTrongTai: document.getElementById("maLoaiTrongTai"),
        form: document.getElementById("inputForm"),
        maGiaiDau_chon_viewbody: document.getElementById("maGiaiDau_chon_viewbody"),
        maTranDau_chon_viewbody: document.getElementById("maTranDau_chon_viewbody"),
        tableBody: document.getElementById("dataTable"),
    };
}

export async function viewTbody(data, onEdit, onDelete) {
    const { tableBody, maGiaiDau_chon_viewbody, maTranDau_chon_viewbody } = getElementIds();

    // Lọc theo giải đấu và trận đấu nếu có chọn
    if (maGiaiDau_chon_viewbody && maGiaiDau_chon_viewbody.value !== "All") {
        const danhSachTrongTai_theoGiai = await hamChiTiet.danhSachTrongTai_theoGiai(maGiaiDau_chon_viewbody.value);
        const maTrongTaiHopLe = danhSachTrongTai_theoGiai.map(item => item.ma_trong_tai);
        data = data.filter(item => maTrongTaiHopLe.includes(item.ma_trong_tai));
        console.log("Danh sách trọng tài :", data);

    }
    if (maTranDau_chon_viewbody && maTranDau_chon_viewbody.value !== "All") {
        data = data.filter(item => item.ma_tran_dau === maTranDau_chon_viewbody.value);
    }
    console.log("Filtered data:", data);
    // Hiển thị dữ liệu vào bảng
    tableBody.innerHTML = "";
    for (const item of data) {
        //   console.log("Processing item:", item);
        const data1TranDau = await hamChung.layThongTinTheo_ID("tran_dau", item.ma_tran_dau);
        const data1GiaiDau = await hamChung.layThongTinTheo_ID("giai_dau", data1TranDau.ma_giai_dau);
        const data1TrongTai = await hamChung.layThongTinTheo_ID("trong_tai", item.ma_trong_tai);
        const data1LoaiTrongTai = await hamChung.layThongTinTheo_ID("loai_trong_tai", item.ma_loai_trong_tai);
        const row = document.createElement("tr");
        row.innerHTML = `
            <td style="text-align: center;">${data1GiaiDau.ten_giai_dau || "---"}</td>
            <td style="text-align: center;">${data1TranDau.ma_tran_dau || "---"}</td>
            <td style="text-align: center;">${data1TrongTai.ho_ten || "---"}</td>
            <td style="text-align: center;">${data1LoaiTrongTai.ten_loai_trong_tai || "---"}</td>
            <td style="text-align: center;"><button class="edit-btn btn btn-warning btn-sm">Sửa</button></td>
            <td style="text-align: center;"><button class="delete-btn btn btn-danger btn-sm">Xóa</button></td>
        `;
        tableBody.appendChild(row);

        row.querySelector(".edit-btn").addEventListener("click", () => onEdit(item));
        row.querySelector(".delete-btn").addEventListener("click", () => onDelete(item));
    }
}

export function fillForm(item) {
    const { maTranDau, maTrongTai, maLoaiTrongTai } = getElementIds();
    maTranDau.value = item.ma_tran_dau;
    maTrongTai.value = item.ma_trong_tai;
    maLoaiTrongTai.value = item.ma_loai_trong_tai;
    maTranDau.setAttribute("disabled", true);
    maTrongTai.setAttribute("disabled", true);
    window.scrollTo({ top: 0, behavior: "smooth" });
}


export async function loadDanhGiaiDau(data) {
    const selectElement = document.getElementById("maGiaiDau");
    selectElement.innerHTML = '<option value="">-- Chọn giai đấu --</option>';
    data.forEach(item => {
        const option = document.createElement("option");
        option.value = item.ma_giai_dau;
        option.textContent = item.ten_giai_dau;
        selectElement.appendChild(option);
    });
}

export async function loadDanhTranDau(maGiaiDau) {
    const selectElement = document.getElementById("maTranDau");
    selectElement.innerHTML = '<option value="">-- Chọn trận đấu --</option>';
    let data = await hamChung.layDanhSach("tran_dau");
    data = data.filter(item => item.ma_giai_dau === maGiaiDau);
    data.forEach(item => {
        const option = document.createElement("option");
        option.value = item.ma_tran_dau;
        option.textContent = item.ma_tran_dau;
        selectElement.appendChild(option);
    });
}

export async function loadDanhSachTrongTai(maGiaiDau) {
    const selectElement = document.getElementById("maTrongTai");
    selectElement.innerHTML = '<option value="">-- Chọn trọng tài --</option>';
    let data = await hamChung.layDanhSach("trong_tai");
    data = data.filter(item => item.ma_giai_dau === maGiaiDau);
    data.forEach(item => {
        const option = document.createElement("option");
        option.value = item.ma_trong_tai;
        option.textContent = item.ho_ten;
        selectElement.appendChild(option);
    });
}

export async function loadDanhSachLoaiTrongTai() {
    const selectElement = document.getElementById("maLoaiTrongTai");
    selectElement.innerHTML = '<option value="">-- Chọn chức vụ--</option>';
    const data = await hamChung.layDanhSach("loai_trong_tai");
    data.forEach(item => {
        const option = document.createElement("option");
        option.value = item.ma_loai_trong_tai;
        option.textContent = item.ten_loai_trong_tai;
        selectElement.appendChild(option);
    });
}

export async function loadDanhSachGiaiDau_chon_viewbody(data) {
    const selectElement = document.getElementById("maGiaiDau_chon_viewbody");
    selectElement.innerHTML = '<option value="All">Tất Cả</option>';
    data.forEach(item => {
        const option = document.createElement("option");
        option.value = item.ma_giai_dau;
        option.textContent = item.ten_giai_dau;
        selectElement.appendChild(option);
    });
}

export async function loadDanhSachTranDauTheoGiaiDau_chon_viewbody(maGiaiDau) {
    const selectElement = document.getElementById("maTranDau_chon_viewbody");
    selectElement.innerHTML = '<option value="All">Tất Cả</option>';
    let data = await hamChung.layDanhSach("tran_dau");
    if (maGiaiDau && maGiaiDau !== "All") data = data.filter(item => item.ma_giai_dau === maGiaiDau);
    else data = [];
    data.forEach(item => {
        const option = document.createElement("option");
        option.value = item.ma_tran_dau;
        option.textContent = item.ma_tran_dau;
        selectElement.appendChild(option);
    });
}