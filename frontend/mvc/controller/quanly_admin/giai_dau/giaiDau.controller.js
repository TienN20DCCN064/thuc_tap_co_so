import hamChung from "../../../model/global/model.hamChung.js";
import { getElementIds, viewTbody, fillForm } from "../../../view/view_js/quanly_admin/giai_dau/giaiDau.view.js";

const {
    btnLuuThayDoi, btnTaiLaiTrang, btnLocDanhSach, form,
    maGiaiDau, tenGiaiDau, tenToChuc, ngayBatDau, ngayKetThuc,
    ngayHetDangKy, maGioiTinh, hinhAnh, inputFile, moTa,
    maGioiTinh_viewBody, ngayBatDau_chon_viewbody, ngayKetThuc_chon_viewbody
} = getElementIds();

document.addEventListener("DOMContentLoaded", function () {
    load_viewTbody();
    btnLuuThayDoi.addEventListener("click", handleLuuThayDoi);
    btnTaiLaiTrang.addEventListener("click", handleTaiLaiTrang);
    // ...gắn các sự kiện lọc, popup, v.v...
});

async function load_viewTbody() {
    let data = await hamChung.layDanhSach("giai_dau");
    // ...lọc theo ngày, giới tính nếu cần...
    await viewTbody(data, hamChung, {}, handleEdit, handleDelete);
}

function handleEdit(item) {
    fillForm(item);
}

async function handleDelete(item) {
    if (confirm(`Bạn có chắc chắn muốn xóa giải đấu "${item.ten_giai_dau}"?`)) {
        await hamChung.xoa({ ma_giai_dau: item.ma_giai_dau }, "giai_dau");
        load_viewTbody();
    }
}

async function handleLuuThayDoi(event) {
    event.preventDefault();
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    // ...validate ngày/tháng...
    let formData = {};
    let id_Hinh_anh_thay = inputFile.value === "" ? hinhAnh.value : inputFile.files[0].name;
    id_Hinh_anh_thay = hamChung.doiKhoangTrangThanhGachDuoi(id_Hinh_anh_thay);

    if (maGiaiDau.value === "") {
        formData = {
            ma_giai_dau: await hamChung.taoID_theoBang("giai_dau"),
            ten_giai_dau: tenGiaiDau.value,
            ten_to_chuc: tenToChuc.value,
            ngay_bat_dau: ngayBatDau.value,
            ngay_ket_thuc: ngayKetThuc.value,
            ngay_ket_thuc_dang_ky_giai: ngayHetDangKy.value,
            gioi_tinh: maGioiTinh.value,
            hinh_anh: id_Hinh_anh_thay,
            mo_ta: moTa.value,
        };
        await hamChung.them(formData, "giai_dau");
        alert("Thêm thành công!");
    } else {
        formData = {
            ma_giai_dau: maGiaiDau.value,
            ten_giai_dau: tenGiaiDau.value,
            ten_to_chuc: tenToChuc.value,
            ngay_bat_dau: ngayBatDau.value,
            ngay_ket_thuc: ngayKetThuc.value,
            ngay_ket_thuc_dang_ky_giai: ngayHetDangKy.value,
            gioi_tinh: maGioiTinh.value,
            hinh_anh: id_Hinh_anh_thay,
            mo_ta: moTa.value
        };
        await hamChung.sua(formData, "giai_dau");
        alert("Sửa thành công!");
    }
    if (inputFile.value != "") {
        await hamChung.uploadImage(inputFile.files[0]);
    }
    load_viewTbody();
}

function handleTaiLaiTrang(event) {
    event.preventDefault();
    location.reload();
}