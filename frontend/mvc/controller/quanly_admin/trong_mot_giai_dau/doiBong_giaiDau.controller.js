import hamChung from "../../../model/global/model.hamChung.js";
import {
    getElementIds,
    viewTbody,
    fillForm,
    loadDanhSachDoiBong,
    loadDanhSachGiaiDau,
    loadDanhSachGiaiDau_chon_viewbody,
    loadDanhSachBangDau,
    loadDanhSachBangDau_chon_viewbody,
    // ... các hàm view khác
} from "../../../view/view_js/quanly_admin/trong_mot_giai_dau/doiBong_giaiDau.view.js";

const {
    btnLuuThayDoi, btnTaiLaiTrang, maDoiBong, maGiaiDau, tenDoiBong, hinhAnh, inputFile, form, quocGia, hatGiong, maBangDau,
    maGiaiDau_chon_viewbody, maBangDau_chon_viewbody, btnLocDanhSach, popupOverlay, closePopup, tableBody
} = getElementIds();

document.addEventListener("DOMContentLoaded", async function () {
    await loadDanhSachDoiBong(hamChung);
    await loadDanhSachGiaiDau(hamChung);
    await loadDanhSachGiaiDau_chon_viewbody(hamChung);
    await load_viewTbody();
    btnLuuThayDoi.addEventListener("click", handleLuuThayDoi);
    btnTaiLaiTrang.addEventListener("click", handleTaiLaiTrang);
    maGiaiDau.addEventListener("change", () => loadDanhSachBangDau(hamChung));
    btnLocDanhSach.addEventListener("click", handle_view_locDanhSach);
    maGiaiDau_chon_viewbody.addEventListener("change", async function () {
        await loadDanhSachBangDau_chon_viewbody(hamChung, maGiaiDau_chon_viewbody.value);
        const data = await hamChung.layDanhSach("doi_bong_giai_dau");
        await load_viewTbody(data);
    });
    maBangDau_chon_viewbody.addEventListener("change", async function () {
        const data = await hamChung.layDanhSach("doi_bong_giai_dau");
        await load_viewTbody(data);
    });
});

async function load_viewTbody(data) {
    await viewTbody(data, hamChung, {}, handleEdit, handleDelete);
}

function handleEdit(item) {
    fillForm(item);
}

async function handleDelete(item) {
    if (confirm(`Bạn có chắc chắn muốn xóa đội bóng ${item.ma_doi_bong} khỏi giải đấu?`)) {
        await hamChung.xoa({ ma_doi_bong: item.ma_doi_bong, ma_giai_dau: item.ma_giai_dau }, "doi_bong_giai_dau");
        await load_viewTbody();
    }
}

async function handleLuuThayDoi(event) {
    event.preventDefault();
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    let id_Hinh_anh_thay = "";
    if (inputFile.value === "")
        id_Hinh_anh_thay = hinhAnh.value;
    else
        id_Hinh_anh_thay = inputFile.files[0].name;
    id_Hinh_anh_thay = hamChung.doiKhoangTrangThanhGachDuoi(id_Hinh_anh_thay);

    let formData = {
        ma_doi_bong: maDoiBong.value,
        ma_giai_dau: maGiaiDau.value,
        ma_bang_dau: maBangDau.value,
        ten_doi_bong: tenDoiBong.value,
        quoc_gia: quocGia.value,
        hat_giong: hatGiong.value,
        logo: id_Hinh_anh_thay
    };
    if (maBangDau.value === "") delete formData.ma_bang_dau;
    if (maDoiBong.disabled && maGiaiDau.disabled) {
        await hamChung.sua(formData, "doi_bong_giai_dau");
        alert("Sửa thành công!");
    } else {
        await hamChung.them(formData, "doi_bong_giai_dau");
        alert("Thêm thành công!");
    }
    if (inputFile.value != "") {
        await hamChung.uploadImage(inputFile.files[0]);
    }
    await load_viewTbody();
}

function handleTaiLaiTrang(event) {
    event.preventDefault();
    location.reload();
}

function handle_view_locDanhSach(event) {
    // Copy logic lọc danh sách popup từ file cũ vào đây
}