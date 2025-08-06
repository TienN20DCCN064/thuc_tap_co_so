import hamChung from "/frontend/mvc/model/global/model.hamChung.js";
import { GlobalStore, DoiTuyen } from "/frontend/global/global.js";
import {
    getElementIds,
    viewTbody,
    fillForm,
    loadDanhSachViTri,
    loadDanhSachDoiBong,
    loadDanhSachDoiBong_chon_viewbody
} from "../../../view/view_js/quanly_admin/doi_bong/cauThu.view.js";

const {
    btnLuuThayDoi, btnTaiLaiTrang, maCauThu, hoTen, ngaySinh, soAo,
    maGioiTinh, maViTri, maDoiBong, hinhAnh, inputFile, form, maDoiBong_chon_viewbody
} = getElementIds();

document.addEventListener("DOMContentLoaded", async function () {
    await loadDanhSachViTri();
    await loadDanhSachDoiBong();
    await loadDanhSachDoiBong_chon_viewbody();
    await load_viewTbody();
    btnLuuThayDoi.addEventListener("click", handleLuuThayDoi);
    btnTaiLaiTrang.addEventListener("click", handleTaiLaiTrang);
    maDoiBong_chon_viewbody.addEventListener("change", load_viewTbody);
});

async function load_viewTbody() {
    let data = await hamChung.layDanhSach("cau_thu");
    console.log("Danh sách cầu thủ:", data);
    console.log("DoiTuyen.getDoiTuyen_dangChon", DoiTuyen.getDoiTuyen_dangChon());
    const dataCauThu_theoMaQuanLy = data.filter(item => item.ma_doi_bong === DoiTuyen.getDoiTuyen_dangChon());
    await viewTbody(dataCauThu_theoMaQuanLy, handleEdit, handleDelete);
}

function handleEdit(item) {
    fillForm(item);
}

async function handleDelete(item) {
    if (confirm(`Bạn có chắc chắn muốn xóa cầu thủ ${item.ma_cau_thu}?`)) {
        await hamChung.xoa({ ma_cau_thu: item.ma_cau_thu }, "cau_thu");
        load_viewTbody();
    }
}

async function handleLuuThayDoi(event) {
    event.preventDefault();
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    let formData = {};
    let id_Hinh_anh_thay = inputFile.value === "" ? hinhAnh.value : inputFile.files[0].name;
    id_Hinh_anh_thay = hamChung.doiKhoangTrangThanhGachDuoi(id_Hinh_anh_thay);

    if (maCauThu.value === "") {
        formData = {
            ma_cau_thu: await hamChung.taoID_theoBang("cau_thu"),
            ho_ten: hoTen.value,
            ngay_sinh: ngaySinh.value,
            so_ao: soAo.value,
            gioi_tinh: maGioiTinh.value,
            ma_vi_tri: maViTri.value,
            ma_doi_bong: maDoiBong.value,
            hinh_anh: id_Hinh_anh_thay
        };
        await hamChung.them(formData, "cau_thu");
        alert("Thêm thành công!");
    } else {
        formData = {
            ma_cau_thu: maCauThu.value,
            ho_ten: hoTen.value,
            ngay_sinh: ngaySinh.value,
            so_ao: soAo.value,
            gioi_tinh: maGioiTinh.value,
            ma_vi_tri: maViTri.value,
            ma_doi_bong: maDoiBong.value,
            hinh_anh: id_Hinh_anh_thay
        };
        await hamChung.sua(formData, "cau_thu");
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