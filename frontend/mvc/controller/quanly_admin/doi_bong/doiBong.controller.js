import hamChung from "../../../model/global/model.hamChung.js";
import hamChiTiet from "../../../model/global/model.hamChiTiet.js";
import thongBao from "/frontend/assets/components/thongBao.js";
import { GlobalStore } from "/frontend/global/global.js";
import {
    getElementIds,
    viewTbody,
    fillForm,
    loadDanhSachNguoiDung,
    loadDanhSachQuanLy_view_body
} from "../../../view/view_js/quanly_admin/doi_bong/doiBong.view.js";

const {
    btnLuuThayDoi, btnTaiLaiTrang, maDoiBong, tenDoiBong, maGioiTinh,
    hinhAnh, maQlDoiBong, ghiChu, inputFile, form, maQlDoiBong_chon_viewbody, gioiTinh_chon_viewbody
} = getElementIds();
let ROLE_USER = "";
let DATA_DOI_BONG = [];



document.addEventListener("DOMContentLoaded", async function () {
    ROLE_USER = await hamChung.getRoleUser();
    await reset_data_toanCuc();

    await loadDanhSachNguoiDung();
    await loadDanhSachQuanLy_view_body();
    load_viewTbody();

    btnLuuThayDoi.addEventListener("click", handleLuuThayDoi);
    btnTaiLaiTrang.addEventListener("click", handleTaiLaiTrang);
    maQlDoiBong_chon_viewbody.addEventListener("change", load_viewTbody);
    gioiTinh_chon_viewbody.addEventListener("change", load_viewTbody);
});
async function reset_data_toanCuc() {
    DATA_DOI_BONG = await hamChung.layDanhSach("doi_bong");

    if (ROLE_USER === "VT02") {
        console.log(GlobalStore.getUsername());
        DATA_DOI_BONG = DATA_DOI_BONG.filter(item => item.ma_ql_doi_bong === GlobalStore.getUsername());
        maQlDoiBong.value = GlobalStore.getUsername();
        maQlDoiBong_chon_viewbody.value = GlobalStore.getUsername();
        // khóa lại
        maQlDoiBong.disabled = true;
        maQlDoiBong_chon_viewbody.disabled = true; // khóa lại
    }
}

async function load_viewTbody() {
    await reset_data_toanCuc();

    let data = DATA_DOI_BONG;
    if (gioiTinh_chon_viewbody.value !== "All") {
        data = data.filter(item => item.gioi_tinh === gioiTinh_chon_viewbody.value);
    }
    if (maQlDoiBong_chon_viewbody.value !== "All") {
        data = data.filter(item => item.ma_ql_doi_bong === maQlDoiBong_chon_viewbody.value);
    }
    console.log(data);
    await viewTbody(data, handleEdit, handleDelete);
}

function handleEdit(item) {
    fillForm(item);
}

async function handleDelete(item) {
    if (confirm(`Bạn có chắc chắn muốn xóa đội bóng ${item.ten_doi_bong}?`)) {
        await hamChung.xoa({ ma_doi_bong: item.ma_doi_bong }, "doi_bong");
        form.reset();
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

    if (maDoiBong.value === "") {
        formData = {
            ma_doi_bong: await hamChung.taoID_theoBang("doi_bong"),
            ten_doi_bong: tenDoiBong.value,
            gioi_tinh: maGioiTinh.value,
            hinh_anh: id_Hinh_anh_thay,
            ma_ql_doi_bong: maQlDoiBong.value,
            ghi_chu: ghiChu.value
        };
        if (await checkTenDoiBong_trong_doiBong(tenDoiBong.value, DATA_DOI_BONG)) {
            alert("Tên đội bóng đã tồn tại!");
            return;
        }
        await hamChung.them(formData, "doi_bong");
        alert("Thêm thành công!");
    } else {
        formData = {
            ma_doi_bong: maDoiBong.value,
            ten_doi_bong: tenDoiBong.value,
            gioi_tinh: maGioiTinh.value,
            hinh_anh: id_Hinh_anh_thay,
            ma_ql_doi_bong: maQlDoiBong.value,
            ghi_chu: ghiChu.value
        };
        await hamChung.sua(formData, "doi_bong");
        alert("Sửa thành công!");
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
async function checkTenDoiBong_trong_doiBong(tenDoiBong, dataDoiBong) {
    const result = dataDoiBong.find(item => item.ten_doi_bong === tenDoiBong);
    return result !== undefined;
}