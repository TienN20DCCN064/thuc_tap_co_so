import hamChung from "/frontend/mvc/model/global/model.hamChung.js";

export function getElementIds() {
    return {
        form: document.getElementById("formCauHinh"),
        btnLuu: document.getElementById("btnLuu"),
        btnTaiLai: document.getElementById("btnTaiLai"),
        maGiaiDau: document.getElementById("maGiaiDau"),
        thoiGianMoiHiep: document.getElementById("thoiGianMoiHiep"),
        soHiep: document.getElementById("soHiep"),
        gioiTinhYeuCau: document.getElementById("gioiTinhYeuCau"),
        soLuongCauThuToiDa: document.getElementById("soLuongCauThuToiDa"),
        soLuongCauThuToiThieu: document.getElementById("soLuongCauThuToiThieu"),
        soLuongDoiBongToiDa: document.getElementById("soLuongDoiBongToiDa"),
        ghiChu: document.getElementById("ghiChu"),
        tbody: document.getElementById("tbodyCauHinh"),
    };
}

export async function loadDanhSachGiaiDau(data) {
    const select = document.getElementById("maGiaiDau");
    select.innerHTML = '<option value="">-- Chọn giải đấu --</option>';
    // const data = await hamChung.layDanhSach("giai_dau");
    data.forEach(item => {
        const option = document.createElement("option");
        option.value = item.ma_giai_dau;
        option.textContent = item.ten_giai_dau;
        select.appendChild(option);
    });
}

export async function viewTbody(data, onEdit, onDelete) {
    const { tbody } = getElementIds();
    tbody.innerHTML = "";
    for (const item of data) {
        // Lấy tên giải đấu
        const giaiDau = await hamChung.layThongTinTheo_ID("giai_dau", item.ma_giai_dau);
        console.log("Thông tin giải đấu:", giaiDau);
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${giaiDau ? giaiDau.ten_giai_dau : item.ma_giai_dau}</td>
            <td>${item.thoi_gian_moi_hiep}</td>
            <td>${item.so_hiep}</td>
            <td>${item.gioi_tinh_yeu_cau}</td>
            <td>${item.so_luong_cau_thu_toi_da_moi_doi}</td>
            <td>${item.so_luong_cau_thu_toi_thieu_moi_doi}</td>
            <td>${item.so_luong_doi_bong_toi_da_dang_ky}</td>
            <td>${item.ghi_chu || ""}</td>
            <td><button class="btn btn-warning btn-sm edit-btn">Sửa</button></td>
            <td><button class="btn btn-danger btn-sm delete-btn">Xóa</button></td>
        `;
        tbody.appendChild(row);
        row.querySelector(".edit-btn").addEventListener("click", () => onEdit(item));
        row.querySelector(".delete-btn").addEventListener("click", () => onDelete(item));
    }
}

export function fillForm(item) {
    const {
        maGiaiDau, thoiGianMoiHiep, soHiep, gioiTinhYeuCau,
        soLuongCauThuToiDa, soLuongCauThuToiThieu, soLuongDoiBongToiDa, ghiChu
    } = getElementIds();
    maGiaiDau.disabled = true; // Disable the field to prevent editing
    maGiaiDau.value = item.ma_giai_dau;
    thoiGianMoiHiep.value = item.thoi_gian_moi_hiep;
    soHiep.value = item.so_hiep;
    gioiTinhYeuCau.value = item.gioi_tinh_yeu_cau;
    soLuongCauThuToiDa.value = item.so_luong_cau_thu_toi_da_moi_doi;
    soLuongCauThuToiThieu.value = item.so_luong_cau_thu_toi_thieu_moi_doi;
    soLuongDoiBongToiDa.value = item.so_luong_doi_bong_toi_da_dang_ky;
    ghiChu.value = item.ghi_chu || "";
}