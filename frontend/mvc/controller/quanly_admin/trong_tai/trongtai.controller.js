// frontend/mvc/controller/view/quanly_admin/trong_tai.controller.js

import hamChung from "../../../model/global/model.hamChung.js";
import { getElementIds, viewTbody, fillForm, loadDanhSachGiaiDau, loadDanhSachLoaiTrongTai, loadDanhSachGiaiDau_chon_viewbody } from "../../../view/view_js/quanly_admin/trong_tai/trongTai.view.js";


const {
    btnLuuThayDoi,
    btnTaiLaiTrang,
    form,
    maGiaiDau,
    maTrongTai,
    hoTen,
    ngaySinh,
    maGioiTinh,
    maLoaiTrongTai,
    hinhAnh,
    inputFile,
    giaiDau_chon_viewbody
} = getElementIds();

document.addEventListener("DOMContentLoaded", async () => {
    await loadDanhSachGiaiDau();
    await loadDanhSachLoaiTrongTai();
    await loadDanhSachGiaiDau_chon_viewbody();

    load_viewTbody();

    btnLuuThayDoi.addEventListener("click", handleLuuThayDoi);
    btnTaiLaiTrang.addEventListener("click", handleTaiLaiTrang);

    giaiDau_chon_viewbody.addEventListener("change", load_viewTbody);
});

async function handleLuuThayDoi(event) {
    event.preventDefault();
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    let idHinhAnh = inputFile.value === ""
        ? hinhAnh.value
        : inputFile.files[0].name;

    idHinhAnh = hamChung.doiKhoangTrangThanhGachDuoi(idHinhAnh);

    const formData = {
        ma_giai_dau: maGiaiDau.value,
        ma_trong_tai: maTrongTai.value || await hamChung.taoID_theoBang("trong_tai"),
        ho_ten: hoTen.value,
        ngay_sinh: ngaySinh.value,
        gioi_tinh: maGioiTinh.value,
        ma_loai_trong_tai: maLoaiTrongTai.value,
        hinh_anh: idHinhAnh,
    };

    if (maTrongTai.value === "") {
        await hamChung.them(formData, "trong_tai");
        alert("Thêm thành công!");
    } else {
        await hamChung.sua(formData, "trong_tai");
        alert("Sửa thành công!");
    }

    if (inputFile.value !== "") {
        await hamChung.uploadImage(inputFile.files[0]);
    }

    load_viewTbody();
}

function handleTaiLaiTrang(event) {
    event.preventDefault();
    location.reload();
}

async function load_viewTbody() {
    const data = await hamChung.layDanhSach("trong_tai");
    viewTbody(data, handleEdit, handleDelete);
}

function handleEdit(item) {
    fillForm(item);
}

async function handleDelete(item) {
    if (confirm(`Bạn có chắc chắn muốn xóa trọng tài ${item.ho_ten}?`)) {
        await hamChung.xoa({ ma_trong_tai: item.ma_trong_tai }, "trong_tai");
        load_viewTbody();
    }
}
