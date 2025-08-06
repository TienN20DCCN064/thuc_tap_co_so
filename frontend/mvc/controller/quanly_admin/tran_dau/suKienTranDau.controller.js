import hamChung from "../../../model/global/model.hamChung.js";
import hamChiTiet from "../../../model/global/model.hamChiTiet.js";
import { GlobalStore } from "/frontend/global/global.js";
import {
    getElementIds,
    viewTbody,
    fillForm,
    loadDanhSachGiaiDau,
    loadDanhSachTranDau,
    loadDanhSachCauThu,
    loadDanhSachDoiBong,

    loadDanhSachGiaiDau_chon_viewbody,
    //  loadDanhSachVongDau_chon_viewbody,
    loadDanhSachTranDau_chon_viewbody
} from "../../../view/view_js/quanly_admin/tran_dau/suKienTranDau.view.js";

const {
    btnLuuThayDoi, btnTaiLaiTrang, maSuKien, maGiaiDau, maTranDau, maDoiBong, thoiDiem, loaiSuKien, maCauThu, ghiChu,
    maGiaiDau_chon_viewbody, maTranDau_chon_viewbody, form
} = getElementIds();
let ROLE_USER = "";
let DATA_GIAI_DAU = [];
let DATA_SU_KIEN_TRAN_DAU = [];



document.addEventListener("DOMContentLoaded", async function () {
    ROLE_USER = await hamChung.getRoleUser();
    await reset_data_toanCuc();

    await loadDanhSachGiaiDau(DATA_GIAI_DAU);
    await loadDanhSachGiaiDau_chon_viewbody(DATA_GIAI_DAU);

    await load_viewTbody();

    maGiaiDau.addEventListener("change", async function () {
        await loadDanhSachTranDau(maGiaiDau.value);
    });



    maTranDau.addEventListener("change", async function () {
        await loadDanhSachDoiBong(maTranDau.value);
        maDoiBong.value = ""; // Reset đội bóng khi thay đổi trận đấu
    });
    // loadDanhSachCauThu(maDoiBong, maGiaiDau)
    maDoiBong.addEventListener("change", async function () {
        console.log("maDoiBong.value", maDoiBong.value);
        await loadDanhSachCauThu(maDoiBong.value, maGiaiDau.value);
    });


    // check lại
    maGiaiDau_chon_viewbody.addEventListener("change", async function () {
        //  await loadDanhSachVongDau_chon_viewbody(maGiaiDau_chon_viewbody.value);
        //  maVongDau_chon_viewbody.value = "All"; // Reset vòng đấu khi thay đổi giải đấu
        await loadDanhSachTranDau_chon_viewbody(maGiaiDau_chon_viewbody.value);
        maTranDau_chon_viewbody.value = "All"; // Reset trận đấu khi thay đổi vòng đấu
        await load_viewTbody();
    });
    // maVongDau_chon_viewbody.addEventListener("change", async function () {
    //     await loadDanhSachTranDau_chon_viewbody(maVongDau_chon_viewbody.value);
    //     maTranDau_chon_viewbody.value = "All"; // Reset trận đấu khi thay đổi vòng đấu
    //     await load_viewTbody();
    // });
    maTranDau_chon_viewbody.addEventListener("change", async function () {
        await loadDanhSachCauThu(maTranDau_chon_viewbody.value);
        await load_viewTbody();
    });


    btnLuuThayDoi.addEventListener("click", handleLuuThayDoi);
    btnTaiLaiTrang.addEventListener("click", handleTaiLaiTrang);
});
async function reset_data_toanCuc() {
    DATA_GIAI_DAU = await hamChung.layDanhSach("giai_dau");
    DATA_SU_KIEN_TRAN_DAU = await hamChung.layDanhSach("su_kien_tran_dau");
    if (ROLE_USER === "VT02") {
        console.log(GlobalStore.getUsername());
        DATA_GIAI_DAU = DATA_GIAI_DAU.filter(item => item.ma_nguoi_tao === GlobalStore.getUsername());
        let dataSuKienTrong_allGiaiDau = [];
        // lấy danh sách sự kiện giải đấu
        for (const item of DATA_GIAI_DAU) {
            const tt = await layDanhSach_suKien_trong_giaiDau(item.ma_giai_dau);
            dataSuKienTrong_allGiaiDau = dataSuKienTrong_allGiaiDau.concat(tt);
        }
        DATA_SU_KIEN_TRAN_DAU = dataSuKienTrong_allGiaiDau;
    }
}
async function layDanhSach_suKien_trong_giaiDau(maGiaiDau) {
    const dataTranDau = await hamChung.layDanhSach("tran_dau");


    const dataTranDauTrongGiaiDau = dataTranDau.filter(item => item.ma_giai_dau === maGiaiDau);
    let danhSachSuKienTheo_giaiDau = [];
    // lấy ra danh sách sự kiện của tất cả trận đâu
    for (const tranDau of dataTranDauTrongGiaiDau) {
        const tt = await hamChiTiet.danhSachSukien_trong_1_tranDau(tranDau.ma_tran_dau);
        danhSachSuKienTheo_giaiDau = danhSachSuKienTheo_giaiDau.concat(tt);
    }
    return danhSachSuKienTheo_giaiDau;

}



async function load_viewTbody() {
    await reset_data_toanCuc();

    const data = DATA_SU_KIEN_TRAN_DAU;
    console.log("DATA_SU_KIEN_TRAN_DAU", data);
    await viewTbody(data, handleEdit, handleDelete);
}

function handleEdit(item) {
    fillForm(item);
}
// export async function fillForm(item) {
//     // const { maSuKien, maGiaiDau, maTranDau, thoiDiem, loaiSuKien, maCauThu, ghiChu } = getElementIds();
//     console.log("fillForm item", item);
//     console.log("item.ma_giai_dau", item.ma_giai_dau);
//     console.log("DATA_GIAI_DAU item", DATA_GIAI_DAU);


//     maSuKien.value = item.ma_su_kien;

//     await loadDanhSachGiaiDau(DATA_GIAI_DAU);
//     maGiaiDau.value = item.ma_giai_dau;
//     maTranDau.value = item.ma_tran_dau;
//     thoiDiem.value = item.thoi_diem;
//     loaiSuKien.value = item.loai_su_kien;
//     maCauThu.value = item.ma_cau_thu;
//     ghiChu.value = item.ghi_chu || "";
//     maSuKien.setAttribute("disabled", true);
// }

async function handleDelete(item) {
    if (confirm(`Bạn có chắc chắn muốn xóa sự kiện ${item.ma_su_kien}?`)) {
        await hamChung.xoa({ ma_su_kien: item.ma_su_kien }, "su_kien_tran_dau");
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
        ma_su_kien: maSuKien.value,
        ma_tran_dau: maTranDau.value,
        thoi_diem: thoiDiem.value,
        loai_su_kien: loaiSuKien.value,
        ma_cau_thu: maCauThu.value,
        ghi_chu: ghiChu.value
    };
    if (maSuKien.disabled) {
        await hamChung.sua(formData, "su_kien_tran_dau");
        alert("Sửa thành công!");
    } else {
        formData.ma_su_kien = await hamChung.taoID_theoBang("su_kien_tran_dau");
        await hamChung.them(formData, "su_kien_tran_dau");
        alert("Thêm thành công!");
    }
    await load_viewTbody();
}

function handleTaiLaiTrang(event) {
    event.preventDefault();
    location.reload();
}