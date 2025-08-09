import hamChung from "/frontend/mvc/model/global/model.hamChung.js";
import { GlobalStore } from "/frontend/global/global.js";
export function getElementIds() {
    return {
        btnLuuThayDoi: document.getElementById("button_luu"),
        btnTaiLaiTrang: document.getElementById("button_taiLaiTrang"),
        btnLocDanhSach: document.getElementById("button_locDanhSach"),
        maYeuCau: document.getElementById("ma_yeu_cau"),
        tenGiaiDau: document.getElementById("ten_giai_dau"),
        maNguoiGui: document.getElementById("ma_nguoi_gui"),
        ngayBatDau: document.getElementById("ngay_bat_dau"),
        ngayKetThuc: document.getElementById("ngay_ket_thuc"),
        ngayBatDauDangKy: document.getElementById("ngay_bat_dau_dang_ky_giai"),
        ngayHetDangKy: document.getElementById("ngay_ket_thuc_dang_ky_giai"),
        hinhAnh: document.getElementById("hinh_anh"),
        inputFile: document.getElementById("hinh_anhFile"),
        moTa: document.getElementById("mo_ta"),
        trangThai: document.getElementById("trang_thai"),
        maNguoiDuyet: document.getElementById("ma_nguoi_duyet"),
        thoiGianGui: document.getElementById("thoi_gian_gui"),
        thoiGianDuyet: document.getElementById("thoi_gian_duyet"),
        tableBody: document.getElementById("dataTable"),
        form: document.getElementById("inputForm"),
        // filter
        ngayBatDau_chon_viewbody: document.getElementById("ngayBatDau_chon_viewbody"),
        ngayKetThuc_chon_viewbody: document.getElementById("ngayKetThuc_chon_viewbody"),
        trangThai_chon_viewbody: document.getElementById("trangThai_chon_viewbody"),
        maGiaiDau_chon: document.getElementById("maGiaiDau_chon"),
        maDoiBong_chon: document.getElementById("maDoiBong_chon"),

    };
}

// Hiển thị danh sách yêu cầu tạo giải đấu
export async function viewTbody(data, onXemMoTa, onEdit, onDelete) {
    const { tableBody } = getElementIds();
    tableBody.innerHTML = "";

    for (const item of data) {
        let hinh_anh;
        if (!item.hinh_anh) {
            hinh_anh = "/frontend/assets/public/images/user-icon.png";
        } else {
            hinh_anh = await hamChung.getImage(item.hinh_anh);
        }

        const row = document.createElement("tr");
        // Lấy tên người gửi và người duyệt
        const nguoiGui = item.ma_nguoi_gui
            ? (await hamChung.layThongTinTheo_ID("nguoi_dung", item.ma_nguoi_gui))?.ho_ten || ""
            : "";
        const nguoiDuyet = item.ma_nguoi_duyet
            ? (await hamChung.layThongTinTheo_ID("nguoi_dung", item.ma_nguoi_duyet))?.ho_ten || ""
            : "";

        row.innerHTML = `
            <td style="text-align: center;">${item.ma_yeu_cau}</td>
            <td style="text-align: center;">${item.ten_giai_dau}</td>
            <td style="text-align: center;">${nguoiGui}</td>
            <td style="text-align:center">${item.ngay_bat_dau ? item.ngay_bat_dau.replace('T', ' ').slice(0, 16) : ""}</td>
            <td style="text-align: center;">${item.ngay_ket_thuc ? item.ngay_ket_thuc.replace('T', ' ').slice(0, 16) : ""}</td>
            <td style="text-align:center">${item.ngay_bat_dau_dang_ky_giai ? item.ngay_bat_dau_dang_ky_giai.replace('T', ' ').slice(0, 16) : ""}</td>
            <td style="text-align: center;">${item.ngay_ket_thuc_dang_ky_giai ? item.ngay_ket_thuc_dang_ky_giai.replace('T', ' ').slice(0, 16) : ""}</td>
            <td style="text-align: center;"><img src="${hinh_anh}" alt="Hình ảnh" width="50"></td>

            <td style="text-align: center;">${item.trang_thai || "---"}</td>
            <td style="text-align: center;">${nguoiDuyet || "---"}</td>
            <td style="text-align: center;">${item.thoi_gian_gui ? item.thoi_gian_gui.replace('T', ' ').slice(0, 16) : ""}</td>
            <td style="text-align: center;">${item.thoi_gian_duyet ? item.thoi_gian_duyet.replace('T', ' ').slice(0, 16) : "" || "---"}</td>
            <td style="text-align: center;"><button class="btn btn-secondary btn-sm btn-xemMoTa">Xem</button></td>
            <td style="text-align: center;"><button class="edit-btn btn btn-warning btn-sm">Sửa</button></td>
            <td style="text-align: center;"><button class="delete-btn btn btn-danger btn-sm">Xóa</button></td>
        `;
        tableBody.appendChild(row);
        row.querySelector(".btn-xemMoTa").addEventListener("click", () => onXemMoTa(item));
        row.querySelector(".edit-btn").addEventListener("click", () => onEdit(item));
        row.querySelector(".delete-btn").addEventListener("click", () => onDelete(item));
    }
}

// Điền dữ liệu vào form
export async function fillForm(item) {
    const {
        maYeuCau, tenGiaiDau, maNguoiGui, ngayBatDau, ngayKetThuc,
        ngayBatDauDangKy, ngayHetDangKy, hinhAnh, moTa, trangThai,
        maNguoiDuyet, thoiGianGui, thoiGianDuyet
    } = getElementIds();
    const data1NguoiDung = await hamChung.layThongTinTheo_ID("nguoi_dung", GlobalStore.getUsername());
    console.log( GlobalStore.getUsername());
    console.log(data1NguoiDung);
    
    maYeuCau.value = item.ma_yeu_cau || "";
    tenGiaiDau.value = item.ten_giai_dau || "";
    maNguoiGui.value = item.ma_nguoi_gui || "";
    ngayBatDau.value = item.ngay_bat_dau || "";
    ngayKetThuc.value = item.ngay_ket_thuc || "";
    ngayBatDauDangKy.value = item.ngay_bat_dau_dang_ky_giai || "";
    ngayHetDangKy.value = item.ngay_ket_thuc_dang_ky_giai || "";
    hinhAnh.value = item.hinh_anh || "";
    moTa.value = item.mo_ta || "";
    trangThai.value = item.trang_thai || "";
    maNguoiDuyet.value =  GlobalStore.getUsername() || "";
    thoiGianGui.value = item.thoi_gian_gui || "";
    // thời gian duyệt sẽ lấy thời gian hiện tại
    thoiGianDuyet.value = new Date().toISOString().slice(0, 16);
    window.scrollTo({ top: 0, behavior: "smooth" });
}

// Load danh sách người gửi/duyệt
export async function loadDanhSachNguoiGui() {
    const selectElement = document.getElementById("ma_nguoi_gui");
    selectElement.innerHTML = '<option value="">-- Chọn Người Gửi --</option>';
    const data = await hamChung.layDanhSach("nguoi_dung");
    data.forEach(item => {
        const option = document.createElement("option");
        option.value = item.ma_nguoi_dung;
        option.textContent = `${item.ma_nguoi_dung} - ${item.ho_ten}`;
        selectElement.appendChild(option);
    });
}
export async function loadDanhSachNguoiDuyet() {
    const selectElement = document.getElementById("ma_nguoi_duyet");
    selectElement.innerHTML = '<option value="">-- Chọn Người Duyệt --</option>';
    const data = await hamChung.layDanhSach("nguoi_dung");
    data.forEach(item => {
        const option = document.createElement("option");
        option.value = item.ma_nguoi_dung;
        option.textContent = `${item.ma_nguoi_dung} - ${item.ho_ten}`;
        selectElement.appendChild(option);
    });
}





