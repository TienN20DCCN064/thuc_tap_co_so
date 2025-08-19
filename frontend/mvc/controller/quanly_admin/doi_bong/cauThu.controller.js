import hamChung from "/frontend/mvc/model/global/model.hamChung.js";
import { GlobalStore } from "/frontend/global/global.js";
// import { hamChiTiet } from "../../../model/global/model.hamChiTiet.js";
// import thongBao from "/frontend/assets/components/thongBao.js";

import {
    getElementIds,
    viewTbody,
    fillForm,
    loadDanhSachViTri,
    loadDanhSachDoiBong,
    loadDanhSachDoiBong_chon_viewbody
} from "../../../view/view_js/quanly_admin/doi_bong/cauThu.view.js";
let ROLE_USER = "";
let DATA_CAU_THU = [];
let DATA_DOI_BONG = [];


const {
    btnLuuThayDoi, btnTaiLaiTrang, maCauThu, hoTen, ngaySinh, soAo,
    maGioiTinh, maViTri, maDoiBong, hinhAnh, inputFile, form, maDoiBong_chon_viewbody
} = getElementIds();

document.addEventListener("DOMContentLoaded", async function () {
    ROLE_USER = await hamChung.getRoleUser();
    await reset_data_toanCuc();

    await loadDanhSachViTri();
    await loadDanhSachDoiBong(DATA_DOI_BONG);
    await loadDanhSachDoiBong_chon_viewbody(DATA_DOI_BONG);
    await load_viewTbody();
    btnLuuThayDoi.addEventListener("click", handleLuuThayDoi);
    btnTaiLaiTrang.addEventListener("click", handleTaiLaiTrang);
    maDoiBong_chon_viewbody.addEventListener("change", load_viewTbody);
});
async function reset_data_toanCuc() {

    DATA_CAU_THU = await hamChung.layDanhSach("cau_thu");
    DATA_DOI_BONG = await hamChung.layDanhSach("doi_bong");
    console.log("ROLE_USER", ROLE_USER);
    console.log("DATA_CAU_THU", DATA_CAU_THU);
    console.log("DATA_DOI_BONG", DATA_DOI_BONG);
    if (ROLE_USER === "VT02") {
        DATA_DOI_BONG = DATA_DOI_BONG.filter(item => item.ma_ql_doi_bong === GlobalStore.getUsername());
        // DATA_CAU_THU = DATA_CAU_THU.filter(item => item.ma_doi_bong === maDoiBong.value);
        console.log("DATA_DOI_BONG", DATA_DOI_BONG);
        // lấy ra danh sách cầu thủ có ma_doi_bong === DATA_DOI_BONG[i]
        let dataCauThu_theoDoiBong = [];
        for(const item of DATA_DOI_BONG) {
            dataCauThu_theoDoiBong = dataCauThu_theoDoiBong.concat(DATA_CAU_THU.filter(cauThu => cauThu.ma_doi_bong === item.ma_doi_bong));
        }
        DATA_CAU_THU = dataCauThu_theoDoiBong;
    }

}


async function load_viewTbody() {
    await reset_data_toanCuc();
    let data = DATA_CAU_THU;
    console.log("DATA_CAU_THU", data);
    await viewTbody(data, handleEdit, handleDelete);
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