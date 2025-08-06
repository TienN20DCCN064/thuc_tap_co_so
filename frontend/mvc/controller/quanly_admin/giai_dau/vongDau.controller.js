import hamChung from "../../../model/global/model.hamChung.js";
import { GlobalStore } from "/frontend/global/global.js";
import {
    getElementIds, viewTbody, fillForm, loadDanhSachGiaiDau, loadDanhSachGiaiDau_chon_viewBody
} from "../../../view/view_js/quanly_admin/giai_dau/vongDau.view.js";

const {
    btnLuuThayDoi, btnTaiLaiTrang, maVongDau, tenVongDau, moTa, maGiaiDau, maGiaiDau_chon_viewbody, form
} = getElementIds();

let ROLE_USER = "";
let DATA = [];
let DATA_VONG_DAU = [];

document.addEventListener("DOMContentLoaded", async function () {
    ROLE_USER = await hamChung.getRoleUser();
    await reset_data_toanCuc();


    await loadDanhSachGiaiDau(DATA);
    await loadDanhSachGiaiDau_chon_viewBody(DATA);

    await load_viewTbody();
    btnLuuThayDoi.addEventListener("click", handleLuuThayDoi);
    btnTaiLaiTrang.addEventListener("click", handleTaiLaiTrang);
    maGiaiDau_chon_viewbody.addEventListener("change", load_viewTbody);
});
async function reset_data_toanCuc() {
    DATA = await hamChung.layDanhSach("giai_dau");
    DATA_VONG_DAU = await hamChung.layDanhSach("vong_dau");
    if (ROLE_USER === "VT02") {
        DATA = DATA.filter(item => item.ma_nguoi_tao === GlobalStore.getUsername());

        let dataBangDau_theo_ql = [];
        for (const item of DATA) {
            const dataBangDau_theoGiaiDau = DATA_VONG_DAU.filter(bang => bang.ma_giai_dau === item.ma_giai_dau);
            dataBangDau_theo_ql = dataBangDau_theo_ql.concat(dataBangDau_theoGiaiDau);
        }
        DATA_VONG_DAU = dataBangDau_theo_ql;
    }
}

async function load_viewTbody() {
    await reset_data_toanCuc();

    // let data = await hamChung.layDanhSach("vong_dau");

    if (maGiaiDau_chon_viewbody.value !== "All") {
        DATA_VONG_DAU = DATA_VONG_DAU.filter(item => item.ma_giai_dau === maGiaiDau_chon_viewbody.value);
    }
    viewTbody(DATA_VONG_DAU, handleEdit, handleDelete);
}

function handleEdit(item) {
    fillForm(item);
}

async function handleDelete(item) {
    if (confirm(`Bạn có chắc chắn muốn xóa vòng đấu "${item.ten_vong_dau}"?`)) {
        await hamChung.xoa({ ma_vong_dau: item.ma_vong_dau }, "vong_dau");
        load_viewTbody();
    }
}

async function handleLuuThayDoi(event) {
    event.preventDefault();
    let formData = {};
    if (maVongDau.value === "") {
        formData = {
            ma_vong_dau: await hamChung.taoID_theoBang("vong_dau"),
            ten_vong_dau: tenVongDau.value,
            ma_giai_dau: maGiaiDau.value,
            mo_ta: moTa.value
        };
        await hamChung.them(formData, "vong_dau");
        alert("Thêm thành công!");
    } else {
        formData = {
            ma_vong_dau: maVongDau.value,
            ten_vong_dau: tenVongDau.value,
            ma_giai_dau: maGiaiDau.value,
            mo_ta: moTa.value
        };
        await hamChung.sua(formData, "vong_dau");
        alert("Sửa thành công!");
    }
    load_viewTbody();
}

function handleTaiLaiTrang(event) {
    event.preventDefault();
    location.reload();
}