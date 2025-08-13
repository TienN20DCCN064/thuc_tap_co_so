import hamChung from "/frontend/mvc/model/global/model.hamChung.js";
import { GlobalStore } from "/frontend/global/global.js";
export function getElementIds() {
    return {
      
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
           
        `;
        tableBody.appendChild(row);
        row.querySelector(".btn-xemMoTa").addEventListener("click", () => onXemMoTa(item));
      
    }
}




