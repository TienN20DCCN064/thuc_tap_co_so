import hamChung from "../../../model/global/model.hamChung.js";
import hamChiTiet from "../../../model/global/model.hamChiTiet.js";
import thongBao from "/frontend/assets/components/thongBao.js";
import { GlobalStore } from "/frontend/global/global.js";

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

let ROLE_USER = "";
let DATA = [];
let DATA_CAU_THU_GIAI_DAU = [];



document.addEventListener("DOMContentLoaded", async function () {
    ROLE_USER = await hamChung.getRoleUser();
    await reset_data_toanCuc();

    await loadDanhSachGiaiDau(DATA);
    // await loadDanhSachDoiBong();
    // await loadDanhSachCauThu();
    await loadDanhSachViTri();
    await loadDanhSachGiaiDau_chon_viewbody(DATA);

    maGiaiDau.addEventListener("change", async function () {
        await loadDanhSachDoiBong(maGiaiDau.value);
        await loadDanhSachCauThu();
        hoTen.value = "";
        viTri.value = "";
        hinhAnh.value = "";
        soAo.value = "";

    });
    maDoiBong.addEventListener("change", async function () {
        await loadDanhSachCauThu(maDoiBong.value);
        hoTen.value = "";
        viTri.value = "";
        hinhAnh.value = "";
        soAo.value = "";

    });
    maCauThu.addEventListener("change", async function () {
        const data1CauThu = await hamChung.layThongTinTheo_ID("cau_thu", maCauThu.value);
        hoTen.value = data1CauThu.ho_ten || "";
        viTri.value = data1CauThu.ma_vi_tri || "";
        hinhAnh.value = data1CauThu.hinh_anh || "";
        soAo.value = data1CauThu.so_ao || "";


    });
    maGiaiDau_chon_viewbody.addEventListener("change", async function () {
        await loadDanhSachDoiBongTheoGiaiDau_chon_viewbody(maGiaiDau_chon_viewbody.value);
        load_viewTbody();
    });
    maDoiBong_chon_viewbody.addEventListener("change", async function () {
        load_viewTbody();
    });

    load_viewTbody();
    btnLuuThayDoi.addEventListener("click", handleLuuThayDoi);
    btnTaiLaiTrang.addEventListener("click", handleTaiLaiTrang);
});
async function reset_data_toanCuc() {
    DATA = await hamChung.layDanhSach("giai_dau");
    console.log("DATA", DATA);
    DATA_CAU_THU_GIAI_DAU = await hamChung.layDanhSach("cau_thu_giai_dau");
    if (ROLE_USER === "VT02") {
        DATA = DATA.filter(item => item.ma_nguoi_tao === GlobalStore.getUsername());

        let dataCTGD_theo_ql = [];
        for (const item of DATA) {
            const dataCTGD_theoGiaiDau = DATA_CAU_THU_GIAI_DAU.filter(bang => bang.ma_giai_dau === item.ma_giai_dau);
            dataCTGD_theo_ql = dataCTGD_theo_ql.concat(dataCTGD_theoGiaiDau);
        }
        DATA_CAU_THU_GIAI_DAU = dataCTGD_theo_ql;
    }
}

async function load_viewTbody() {
    await reset_data_toanCuc();
    const data = await hamChung.layDanhSach("cau_thu_giai_dau");
    await viewTbody(data, handleEdit, handleDelete);
}

function handleEdit(item) {
    fillForm(item);
}

async function handleDelete(item) {
    if (confirm(`Bạn có chắc chắn muốn xóa cầu thủ ${item.ma_cau_thu} khỏi giải đấu?`)) {
        await hamChung.xoa({ ma_cau_thu: item.ma_cau_thu, ma_giai_dau: item.ma_giai_dau }, "cau_thu_giai_dau");
        load_viewTbody();
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
        if (check_cauThu_tonTai_trongGiaiDau(maCauThu.value, maGiaiDau.value)) {
            thongBao.thongBao_error("Cầu thủ đã tồn tại trong giải đấu - KHÔNG THỂ THÊM!", 3000, "error");
            return;
        }
        await hamChung.them(formData, "cau_thu_giai_dau");
        alert("Thêm thành công!");
    }
    if (inputFile.value != "") {
        await hamChung.uploadImage(inputFile.files[0]);
    }
    await load_viewTbody();
}
function check_cauThu_tonTai_trongGiaiDau(maCauThu, maGiaiDau) {
    return DATA_CAU_THU_GIAI_DAU.some(item => item.ma_cau_thu === maCauThu && item.ma_giai_dau === maGiaiDau);
}

function handleTaiLaiTrang(event) {
    event.preventDefault();
    location.reload();
}