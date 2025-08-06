import hamChung from "/frontend/mvc/model/global/model.hamChung.js";
import { GlobalStore, DoiTuyen } from "/frontend/global/global.js";

import {
    getElementIds,
    viewTbody,
    fillForm,
    loadDanhSachGiaiDau,
    loadDanhSachGiaiDau_chon_viewBody
} from "../../../view/view_js/quanly_admin/giai_dau/bangDau.view.js";

const {
    btnLuuThayDoi, btnTaiLaiTrang, maBangDau, tenBangDau, maGiaiDau, maGiaiDau_chon_viewbody, form
} = getElementIds();

let ROLE_USER = "";
let DATA = [];
let DATA_BANG_DAU = [];


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
    DATA_BANG_DAU = await hamChung.layDanhSach("bang_dau");
    if (ROLE_USER === "VT02") {
        DATA = DATA.filter(item => item.ma_nguoi_tao === GlobalStore.getUsername());

        let dataBangDau_theo_ql = [];
        for (const item of DATA) {
           const dataBangDau_theoGiaiDau = DATA_BANG_DAU.filter(bang => bang.ma_giai_dau === item.ma_giai_dau);
           dataBangDau_theo_ql = dataBangDau_theo_ql.concat(dataBangDau_theoGiaiDau);
        }
        DATA_BANG_DAU = dataBangDau_theo_ql;
    }
}


async function load_viewTbody() {
    await reset_data_toanCuc();

    if (maGiaiDau_chon_viewbody.value !== "All") {
        DATA_BANG_DAU = DATA_BANG_DAU.filter(item => item.ma_giai_dau === maGiaiDau_chon_viewbody.value);
    }
    await viewTbody(DATA_BANG_DAU, handleEdit, handleDelete);
}

function handleEdit(item) {
    fillForm(item);
}

async function handleDelete(item) {
    if (confirm(`Bạn có chắc chắn muốn xóa bảng đấu "${item.ten_bang_dau}"?`)) {
        await hamChung.xoa({ ma_bang_dau: item.ma_bang_dau }, "bang_dau");

        load_viewTbody();
    }
}

async function handleLuuThayDoi(event) {
    event.preventDefault();
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    if (!maGiaiDau.value) {
        alert("Vui lòng chọn một giải đấu!");
        return;
    }
    let formData = {};
    if (maBangDau.value === "") {
        formData = {
            ma_bang_dau: await hamChung.taoID_theoBang("bang_dau"),
            ten_bang_dau: tenBangDau.value,
            ma_giai_dau: maGiaiDau.value
        };
        await hamChung.them(formData, "bang_dau");
        alert("Thêm thành công!");
    } else {
        formData = {
            ma_bang_dau: maBangDau.value,
            ten_bang_dau: tenBangDau.value,
            ma_giai_dau: maGiaiDau.value
        };
        await hamChung.sua(formData, "bang_dau");
        alert("Sửa thành công!");
    }
    load_viewTbody();
}

function handleTaiLaiTrang(event) {
    event.preventDefault();
    location.reload();
}