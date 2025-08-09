import hamChung from "../../../model/global/model.hamChung.js";
import hamChiTiet from "../../../model/global/model.hamChiTiet.js";
import thongBao from "/frontend/assets/components/thongBao.js";
import { GlobalStore } from "/frontend/global/global.js";
import {
    getElementIds,
    viewTbody,
    fillForm,
    loadDanhSachTrongTai,
    loadDanhSachLoaiTrongTai,
    loadDanhGiaiDau,
    loadDanhTranDau,
    loadDanhSachGiaiDau_chon_viewbody,
    loadDanhSachTranDauTheoGiaiDau_chon_viewbody,
    // ... các hàm view khác
} from "../../../view/view_js/quanly_admin/tran_dau/trongTai_tranDau.view.js";

const {
    btnLuuThayDoi, btnTaiLaiTrang, maGiaiDau, maTranDau, maTrongTai, maLoaiTrongTai, form,
    maGiaiDau_chon_viewbody, maTranDau_chon_viewbody, tableBody
} = getElementIds();
let ROLE_USER = "";
let DATA_TRONG_TAI_TRAN_DAU = [];
let DATA_GIAI_DAU = [];

document.addEventListener("DOMContentLoaded", async function () {
    ROLE_USER = await hamChung.getRoleUser();
    await reset_data_toanCuc();

    await loadDanhSachLoaiTrongTai();
    await loadDanhGiaiDau(DATA_GIAI_DAU);
    await loadDanhSachGiaiDau_chon_viewbody(DATA_GIAI_DAU);

    await load_viewTbody();

    maGiaiDau.addEventListener("change", async function () {
        await loadDanhTranDau(maGiaiDau.value);
        await loadDanhSachTrongTai(maGiaiDau.value);

    });
    maTrongTai.addEventListener("change", async function () {
        const data1TrongTai = await hamChung.layThongTinTheo_ID("trong_tai", maTrongTai.value);
        maLoaiTrongTai.value = data1TrongTai.ma_loai_trong_tai || "";
    });





    maGiaiDau_chon_viewbody.addEventListener("change", async function () {
        await loadDanhSachTranDauTheoGiaiDau_chon_viewbody(maGiaiDau_chon_viewbody.value);

        await load_viewTbody();
    });

    maTranDau_chon_viewbody.addEventListener("change", async function () {

        await load_viewTbody();
    });

    btnLuuThayDoi.addEventListener("click", handleLuuThayDoi);
    btnTaiLaiTrang.addEventListener("click", handleTaiLaiTrang);

});
async function reset_data_toanCuc() {
    DATA_TRONG_TAI_TRAN_DAU = await hamChung.layDanhSach("trong_tai_tran_dau");
    DATA_GIAI_DAU = await hamChung.layDanhSach("giai_dau");
    // lấy ra danh sách trọng tài trận đấu theo giải đấu của quản lý
    // console.log("DATA_TRONG_TAI_TRAN_DAU", DATA_TRONG_TAI_TRAN_DAU);
    // const danhSachTrongTai_trong_1tranDau = await hamChiTiet.danhSachTrongTai_theo_1tranDau() 
    if (ROLE_USER === "VT02") {
        const danhSachTranDau_theoQLy = await hamChiTiet.danhSachTranDau_theoQL(GlobalStore.getUsername());
        DATA_GIAI_DAU = DATA_GIAI_DAU.filter(item => item.ma_nguoi_tao === GlobalStore.getUsername());
        // lấy ra dataTrongTai_tranDau  danhSachTrongTai_theo_1tranDau
        let dataTrongTai_all_tranDau = [];
        for (const tranDau of danhSachTranDau_theoQLy) {
            dataTrongTai_all_tranDau = dataTrongTai_all_tranDau.concat(await hamChiTiet.danhSachTrongTai_theo_1tranDau(tranDau.ma_tran_dau));
        }
        console.log("danhSachTranDau_theoQLy", danhSachTranDau_theoQLy);
        console.log("dataTrongTai_all_tranDau", dataTrongTai_all_tranDau);
        DATA_TRONG_TAI_TRAN_DAU = dataTrongTai_all_tranDau;
    }

}

async function load_viewTbody() {
    await reset_data_toanCuc();
    const data = DATA_TRONG_TAI_TRAN_DAU;
    console.log("DATA_TRONG_TAI_TRAN_DAU", data);
    await viewTbody(data, handleEdit, handleDelete);
}

function handleEdit(item) {
    fillForm(item);
}

async function handleDelete(item) {
    if (confirm(`Bạn có chắc chắn muốn xóa trọng tài ${item.ma_trong_tai} khỏi trận đấu ${item.ma_tran_dau}?`)) {
        await hamChung.xoa({
            ma_tran_dau: item.ma_tran_dau,
            ma_trong_tai: item.ma_trong_tai,
            ma_loai_trong_tai: item.ma_loai_trong_tai
        }, "trong_tai_tran_dau");
        await load_viewTbody();
    }
}

async function handleLuuThayDoi(event) {
    event.preventDefault();
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    let formData = {
        ma_tran_dau: maTranDau.value,
        ma_trong_tai: maTrongTai.value,
        ma_loai_trong_tai: maLoaiTrongTai.value,
    };
    if (maTranDau.disabled && maTrongTai.disabled) {
        await hamChung.sua(formData, "trong_tai_tran_dau");
        alert("Sửa thành công!");
    } else {
        const isExist = await isExistTrongTaiTranDau(
            formData.ma_tran_dau,
            formData.ma_trong_tai,
        );
        if (isExist) {
             thongBao.thongBao_error("Trọng tài này đã được phân công cho trận đấu! - KHÔNG THỂ THÊM!", 3000, "error");
            return;
        }
        await hamChung.them(formData, "trong_tai_tran_dau");
        alert("Thêm thành công!");
    }
    await load_viewTbody();
}
async function isExistTrongTaiTranDau(ma_tran_dau, ma_trong_tai, ma_loai_trong_tai) {
    const data = await hamChung.layDanhSach("trong_tai_tran_dau");
    return data.some(item =>
        item.ma_tran_dau === ma_tran_dau &&
        item.ma_trong_tai === ma_trong_tai 
    );
}

function handleTaiLaiTrang(event) {
    event.preventDefault();
    location.reload();
}