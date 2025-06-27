export function getElementIds() {
    return {
        btnLuuThayDoi: document.getElementById("button_luu"),
        btnTaiLaiTrang: document.getElementById("button_taiLaiTrang"),
        btnLocDanhSach: document.getElementById("button_locDanhSach"),
        maGiaiDau: document.getElementById("maGiaiDau"),
        tenGiaiDau: document.getElementById("tenGiaiDau"),
        tenToChuc: document.getElementById("tenToChuc"),
        ngayBatDau: document.getElementById("ngayBatDau"),
        ngayKetThuc: document.getElementById("ngayKetThuc"),
        ngayHetDangKy: document.getElementById("ngayHetDangKy"),
        maGioiTinh: document.getElementById("maGioiTinh"),
        hinhAnh: document.getElementById("hinhAnh"),
        inputFile: document.getElementById("hinhAnhFile"),
        moTa: document.getElementById("moTa"),
        maGioiTinh_viewBody: document.getElementById("maGioiTinh_viewBody"),
        ngayBatDau_chon_viewbody: document.getElementById("ngayBatDau_chon_viewbody"),
        ngayKetThuc_chon_viewbody: document.getElementById("ngayKetThuc_chon_viewbody"),
        tableBody: document.getElementById("dataTable"),
        form: document.getElementById("inputForm"),
    };
}

// Hiển thị danh sách giải đấu
export async function viewTbody(data, hamChung, filterValues, onEdit, onDelete) {
    const { tableBody } = getElementIds();
    tableBody.innerHTML = "";

    for (const item of data) {
        let hinh_anh;
        if (item.hinh_anh === null) {
            hinh_anh = "/frontend/public/images/cat-2.png";
        } else {
            hinh_anh = await hamChung.getImage(item.hinh_anh);
        }

        const row = document.createElement("tr");
        row.innerHTML = `
            <td style="text-align: center;">${item.ma_giai_dau}</td>
            <td style="text-align: center;">${item.ten_giai_dau}</td>
            <td style="text-align: center;">${item.ten_to_chuc}</td>
            <td style="text-align: center;">${item.ngay_bat_dau}</td>
            <td style="text-align: center;">${item.ngay_ket_thuc}</td>
            <td style="text-align: center;">${item.ngay_ket_thuc_dang_ky_giai}</td>
            <td style="text-align: center;">${item.gioi_tinh}</td>
            <td style="text-align: center;"><img src="${hinh_anh}" alt="Hình ảnh" width="50"></td>
            <td style="text-align: center;">${item.mo_ta || ""}</td>
            <td style="text-align: center;"><button class="edit-btn btn btn-warning btn-sm">Sửa</button></td>
            <td style="text-align: center;"><button class="delete-btn btn btn-danger btn-sm">Xóa</button></td>
        `;
        tableBody.appendChild(row);

        row.querySelector(".edit-btn").addEventListener("click", () => onEdit(item));
        row.querySelector(".delete-btn").addEventListener("click", () => onDelete(item));
    }
}

// Điền dữ liệu vào form
export function fillForm(item) {
    const {
        maGiaiDau, tenGiaiDau, tenToChuc, ngayBatDau, ngayKetThuc,
        ngayHetDangKy, maGioiTinh, hinhAnh, moTa
    } = getElementIds();
    maGiaiDau.value = item.ma_giai_dau;
    tenGiaiDau.value = item.ten_giai_dau;
    tenToChuc.value = item.ten_to_chuc;
    ngayBatDau.value = item.ngay_bat_dau;
    ngayKetThuc.value = item.ngay_ket_thuc;
    ngayHetDangKy.value = item.ngay_ket_thuc_dang_ky_giai;
    maGioiTinh.value = item.gioi_tinh;
    hinhAnh.value = item.hinh_anh;
    moTa.value = item.mo_ta || "";
    window.scrollTo({ top: 0, behavior: "smooth" });
}