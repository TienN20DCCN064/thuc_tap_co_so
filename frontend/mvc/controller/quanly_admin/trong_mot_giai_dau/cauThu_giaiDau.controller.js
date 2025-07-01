import hamChung from "../../../model/global/model.hamChung.js";
import {
    getElementIds,
    viewTbody,
    fillForm,
    loadDanhSachCauThu,
    loadDanhSachDoiBong,
    loadDanhSachGiaiDau,
    loadDanhSachViTri,
    loadDanhSachGiaiDau_chon_viewbody,
    loadDanhSachDoiBongTheoGiaiDau_chon_viewbody
} from "../../../view/view_js/quanly_admin/trong_mot_giai_dau/cauThu_giaiDau.view.js";

const {
    btnLuuThayDoi, btnTaiLaiTrang, maCauThu, maDoiBong, maGiaiDau, hoTen, soAo, viTri, hinhAnh, inputFile, form,
    maGiaiDau_chon_viewbody, maDoiBong_chon_viewbody
} = getElementIds();

document.addEventListener("DOMContentLoaded", async function () {
    await loadDanhSachGiaiDau();
    await loadDanhSachViTri();
    await loadDanhSachGiaiDau_chon_viewbody();

    maGiaiDau.addEventListener("change", async function () {
        await loadDanhSachDoiBong(maGiaiDau.value);
        await loadDanhSachCauThu();
    });
    maDoiBong.addEventListener("change", async function () {
        await loadDanhSachCauThu(maDoiBong.value);

    });
    maGiaiDau_chon_viewbody.addEventListener("change", async function () {
        await loadDanhSachDoiBongTheoGiaiDau_chon_viewbody(maGiaiDau_chon_viewbody.value);
        await load_viewTbody();
    });
    maDoiBong_chon_viewbody.addEventListener("change", async function () {
        await load_viewTbody();
    });

    await load_viewTbody();
    btnLuuThayDoi.addEventListener("click", handleLuuThayDoi);
    btnTaiLaiTrang.addEventListener("click", handleTaiLaiTrang);
});

async function load_viewTbody() {
    const data = await hamChung.layDanhSach("cau_thu_giai_dau");
    await viewTbody(data, handleEdit, handleDelete);
}

function handleEdit(item) {
    fillForm(item);
}

async function handleDelete(item) {
    if (confirm(`Bạn có chắc chắn muốn xóa cầu thủ ${item.ma_cau_thu} khỏi giải đấu?`)) {
        await hamChung.xoa({ ma_cau_thu: item.ma_cau_thu, ma_giai_dau: item.ma_giai_dau }, "cau_thu_giai_dau");
        await load_viewTbody();
    }
}

async function handleLuuThayDoi(event) {
    event.preventDefault();
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    let id_Hinh_anh_thay = inputFile.value === "" ? hinhAnh.value : inputFile.files[0].name;
    id_Hinh_anh_thay = hamChung.doiKhoangTrangThanhGachDuoi(id_Hinh_anh_thay);

    let formData = {
        ma_cau_thu: maCauThu.value,
        ma_doi_bong: maDoiBong.value,
        ma_giai_dau: maGiaiDau.value,
        ho_ten: hoTen.value,
        so_ao: soAo.value,
        ma_vi_tri: viTri.value,
        hinh_anh: id_Hinh_anh_thay
    };
    if (maCauThu.disabled && maGiaiDau.disabled) {
        await hamChung.sua(formData, "cau_thu_giai_dau");
        alert("Sửa thành công!");
    } else {
        await hamChung.them(formData, "cau_thu_giai_dau");
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