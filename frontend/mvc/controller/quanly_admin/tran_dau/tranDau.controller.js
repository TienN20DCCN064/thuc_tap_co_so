import hamChung from "../../../model/global/model.hamChung.js";
import {
    getElementIds,
    viewTbody,
    fillForm,
    loadDanhSachGiaiDau,
    loadDanhSachDoiBong_maDoi1_end,
    loadDanhSachDoiBong_maDoi2_end,
    loadDanhSachVongDau,
    loadDanhSachSanVanDong,
    loadDanhSach_hinhThuc_xepTranDau,
    loadDanhSachGiaiDau_chon_viewbody,
    loadDanhSachVongDau_chon_viewbody,
    // ... các hàm view khác
} from "../../../view/view_js/quanly_admin/tran_dau/tranDau.view.js";

const {
    btnLuuThayDoi, btnTaiLaiTrang, button_xepLich, maTranDau, maGiaiDau, maDoi1, maDoi2,
    ngayDienRa, gioDienRa, sanVanDong, button_xem_ds_trongTai, button_luu_danhSachTranDau,
    trangThai, maVongDau, maGiaiDau_chon_viewbody, maVongDau_chon_viewbody, form
} = getElementIds();

document.addEventListener("DOMContentLoaded", async function () {
    await loadDanhSachGiaiDau();
    await loadDanhSachVongDau();
    await loadDanhSachSanVanDong();
    await loadDanhSach_hinhThuc_xepTranDau();
    await loadDanhSachGiaiDau_chon_viewbody();
    await loadDanhSachVongDau_chon_viewbody();
    await load_viewTbody();

    // Gắn các sự kiện như file cũ
    btnLuuThayDoi.addEventListener("click", handleLuuThayDoi);
    btnTaiLaiTrang.addEventListener("click", handleTaiLaiTrang);
    button_xepLich.addEventListener("click", handleXepLich);
    // ... các sự kiện khác
});

async function load_viewTbody() {
    let data = await hamChung.layDanhSach("tran_dau");
    await viewTbody(data, hamChung, {}, handleEdit, handleDelete);
}

function handleEdit(item) {
    fillForm(item, hamChung);
}

async function handleDelete(item) {
    if (confirm(`Bạn có chắc chắn muốn xóa trận đấu ${item.ma_tran_dau}?`)) {
        await hamChung.xoa({ ma_tran_dau: item.ma_tran_dau }, "tran_dau");
        let data = await hamChung.layDanhSach("tran_dau");
        await load_viewTbody(data);
        alert("Xóa thành công!");
    }
}

async function handleLuuThayDoi(event) {
    event.preventDefault();
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    let formData = {};
    if (maTranDau.value === "") {
        formData = {
            ma_tran_dau: await hamChung.taoID_theoBang("tran_dau"),
            ma_giai_dau: maGiaiDau.value,
            ma_doi_1: maDoi1.value,
            ma_doi_2: maDoi2.value,
            ngay_dien_ra: ngayDienRa.value,
            gio_dien_ra: gioDienRa.value,
            ma_san: sanVanDong.value,
            trang_thai: trangThai.value,
            ma_vong_dau: maVongDau.value
        };
        await hamChung.them(formData, "tran_dau");
        alert("Thêm thành công!");
    } else {
        formData = {
            ma_tran_dau: maTranDau.value,
            ma_giai_dau: maGiaiDau.value,
            ma_doi_1: maDoi1.value,
            ma_doi_2: maDoi2.value,
            ngay_dien_ra: ngayDienRa.value,
            gio_dien_ra: gioDienRa.value,
            ma_san: sanVanDong.value,
            trang_thai: trangThai.value,
            ma_vong_dau: maVongDau.value
        };
        await hamChung.sua(formData, "tran_dau");
        alert("Sửa thành công!");
    }
    await load_viewTbody();
}

function handleTaiLaiTrang(event) {
    event.preventDefault();
    location.reload();
}