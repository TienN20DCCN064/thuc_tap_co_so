import hamChung from "../../../model/global/model.hamChung.js";
import hamChiTiet from "../../../model/global/model.hamChiTiet.js";
import thongBao from "/frontend/assets/components/thongBao.js";
import { GlobalStore } from "/frontend/global/global.js";

import { getElementIds, viewTbody, fillForm, loadDanhSachGiaiDau, loadDanhSachGiaiDau_chon_viewBody } from "../../../view/view_js/quanly_admin/giai_dau/sanVanDong.view.js";

const {
    btnLuuThayDoi, btnTaiLaiTrang, maSan, maGiaiDau, tenSan, diaChi, sucChua, moTa, maGiaiDau_chon_viewbody, form
} = getElementIds();


let ROLE_USER = "";
let DATA = [];
let DATA_SAN_VAN_DONG = [];


document.addEventListener("DOMContentLoaded", async function () {
    ROLE_USER = await hamChung.getRoleUser();
    await reset_data_toanCuc();

    await loadDanhSachGiaiDau(DATA);
    await loadDanhSachGiaiDau_chon_viewBody(DATA);

    load_viewTbody();
    btnLuuThayDoi.addEventListener("click", handleLuuThayDoi);
    btnTaiLaiTrang.addEventListener("click", handleTaiLaiTrang);
    maGiaiDau_chon_viewbody.addEventListener("change", load_viewTbody);
});
async function reset_data_toanCuc() {
    DATA = await hamChung.layDanhSach("giai_dau");
    console.log("DATA", DATA);
    DATA_SAN_VAN_DONG = await hamChung.layDanhSach("san_van_dong");
    if (ROLE_USER === "VT02") {
        DATA = DATA.filter(item => item.ma_nguoi_tao === GlobalStore.getUsername());

        let dataSVD_theo_ql = [];
        for (const item of DATA) {
            const dataSVD_theoGiaiDau = DATA_SAN_VAN_DONG.filter(bang => bang.ma_giai_dau === item.ma_giai_dau);
            dataSVD_theo_ql = dataSVD_theo_ql.concat(dataSVD_theoGiaiDau);
        }
        DATA_SAN_VAN_DONG = dataSVD_theo_ql;
    }
}

async function load_viewTbody() {
    await reset_data_toanCuc();
    let data_loc = DATA_SAN_VAN_DONG;
    console.log("DATA_SAN_VAN_DONG", data_loc);
    // let data = await hamChung.layDanhSach("san_van_dong");
    if (maGiaiDau_chon_viewbody.value !== "All") {
        data_loc = data_loc.filter(item => item.ma_giai_dau === maGiaiDau_chon_viewbody.value);
    }
    viewTbody(data_loc, handleEdit, handleDelete);
}

function handleEdit(item) {
    fillForm(item);
}

async function handleDelete(item) {
    if (confirm(`Bạn có chắc chắn muốn xóa sân "${item.ten_san}"?`)) {
        await hamChung.xoa({ ma_san: item.ma_san }, "san_van_dong");
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
    if (maSan.value === "") {
        formData = {
            ma_san: await hamChung.taoID_theoBang("san_van_dong"),
            ma_giai_dau: maGiaiDau.value,
            ten_san: tenSan.value,
            dia_chi: diaChi.value,
            suc_chua: parseInt(sucChua.value),
            mo_ta: moTa.value
        };
        // check tên sân có trùng với  DATA_SAN_VAN_DONG
        const isTenSanTrung = DATA_SAN_VAN_DONG.some(item => item.ten_san === tenSan.value);
        if (isTenSanTrung) {
            thongBao.thongBao_error("Sân vận động đã tồn tại trong giải đấu - KHÔNG THỂ THÊM!", 3000, "error");
            return;
        }

        await hamChung.them(formData, "san_van_dong");
        alert("Thêm thành công!");
    } else {
        formData = {
            ma_san: maSan.value,
            ma_giai_dau: maGiaiDau.value,
            ten_san: tenSan.value,
            dia_chi: diaChi.value,
            suc_chua: parseInt(sucChua.value),
            mo_ta: moTa.value
        };
        await hamChung.sua(formData, "san_van_dong");
        alert("Sửa thành công!");
    }
    console.log(formData);
    load_viewTbody();
    //   form.reset();

}

function handleTaiLaiTrang(event) {
    event.preventDefault();
    location.reload();
}