import hamChung from "/frontend/mvc/model/global/model.hamChung.js";
import hamChiTiet from "../../../model/global/model.hamChiTiet.js";
import { GlobalStore, DoiTuyen } from "/frontend/global/global.js";
//C:\Users\vanti\Desktop\mvc_project\frontend\mvc\view\view_js\quanly_doibong\danhSachYeuCauTaoGiai.view.js
import { getElementIds, viewTbody }
    from "../../../view/view_js/quanly_doibong/danhSachYeuCauTaoGiai.view.js";
import thongBao from "/frontend/assets/components/thongBao.js";

const {
    ngayBatDau_chon_viewbody, ngayKetThuc_chon_viewbody, trangThai_chon_viewbody
} = getElementIds();

let DATA_YEU_CAU_TAO_GIAI_DAU = [];

document.addEventListener("DOMContentLoaded", async function () {

    await loadData();

    ngayBatDau_chon_viewbody.addEventListener("change", loadData);
    ngayKetThuc_chon_viewbody.addEventListener("change", loadData);
    trangThai_chon_viewbody.addEventListener("change", loadData);
});

async function loadData() {
    DATA_YEU_CAU_TAO_GIAI_DAU = await hamChung.layDanhSach("yeu_cau_tao_giai_dau");
    console.log(GlobalStore.getUsername());
    console.log(DATA_YEU_CAU_TAO_GIAI_DAU);
    // ...existing code...
    DATA_YEU_CAU_TAO_GIAI_DAU = DATA_YEU_CAU_TAO_GIAI_DAU.filter(item => item.ma_nguoi_gui === GlobalStore.getUsername());
    // ...existing code...

    console.log(DATA_YEU_CAU_TAO_GIAI_DAU);
    // Lọc theo ngày nếu có chọn
    if (ngayBatDau_chon_viewbody.value) {
        DATA_YEU_CAU_TAO_GIAI_DAU = DATA_YEU_CAU_TAO_GIAI_DAU.filter(item => item.ngay_bat_dau >= ngayBatDau_chon_viewbody.value);
    }
    if (ngayKetThuc_chon_viewbody.value) {
        DATA_YEU_CAU_TAO_GIAI_DAU = DATA_YEU_CAU_TAO_GIAI_DAU.filter(item => item.ngay_ket_thuc <= ngayKetThuc_chon_viewbody.value);
    }
    if (trangThai_chon_viewbody.value && trangThai_chon_viewbody.value !== "All") {
        DATA_YEU_CAU_TAO_GIAI_DAU = DATA_YEU_CAU_TAO_GIAI_DAU.filter(item => item.trang_thai === trangThai_chon_viewbody.value);
    }
    await viewTbody(DATA_YEU_CAU_TAO_GIAI_DAU, handleXemMoTa, handleEdit, handleDelete);
}

function handleEdit(item) {
    fillForm(item);
}

async function handleDelete(item) {
    if (confirm(`Bạn có chắc chắn muốn xóa yêu cầu "${item.ten_giai_dau}"?`)) {
        await hamChung.xoa({ ma_yeu_cau: item.ma_yeu_cau }, "yeu_cau_tao_giai_dau");
        loadData();
    }
}


function handleXemMoTa(item) {
    thongBao.thongBao_error(`${item.mo_ta}`);
}
// tạo 1 hàm kiểm tra xem trạng thái của yêu cầu tạo, và nếu yêu cầu tạo là đã duyệt thì thêm vào giải đấu mới
async function check_and_add_giai_dau(formNewGiaiDau, formData_yeuCauTaoGiaiDau, maYeuCau) {
    // console.log(formNewGiaiDau);
    // console.log(formData_yeuCauTaoGiaiDau.ma_yeu_cau);
    // console.log(maYeuCau);
    // console.log(formData_yeuCauTaoGiaiDau);
    if (formData_yeuCauTaoGiaiDau.trang_thai === "da_duyet") {
        await hamChung.them(formNewGiaiDau, "giai_dau");
        alert("Yêu cầu đã được duyệt, giải đấu sẽ được tạo!");
    }

    // đang cập nhật // cứ có thao tác thì cứ thông báo là được
    if (maYeuCau) {
        const dataGiaiDau_theoQl = await hamChiTiet.layGiaiDauTheoQL(formNewGiaiDau.ma_nguoi_gui);
        // kiểm tra trong dataGiaiDau_theoQl có dataGiaiDau_theoQl[i].ma_nguoi_tao === formData_yeuCauTaoGiaiDau.ma_nguoi_gui
        // và xem dataGiaiDau_theoQl[i].ten_giai_dau === formNewGiaiDau.ten_giai_dau
        let soGiaiDauCungTen = 0;
        for (let i = 0; i < dataGiaiDau_theoQl.length; i++) {
            if (dataGiaiDau_theoQl[i].ma_nguoi_tao === formData_yeuCauTaoGiaiDau.ma_nguoi_gui && dataGiaiDau_theoQl[i].ten_giai_dau === formNewGiaiDau.ten_giai_dau) {
                soGiaiDauCungTen++;
            }
        }
        if (soGiaiDauCungTen > 0) {
            alert(`Đã có ${soGiaiDauCungTen} giải đấu cùng tên được ${formData_yeuCauTaoGiaiDau.ma_nguoi_gui} tạo!`);
        }
    }


    // console.log(formData_yeuCauTaoGiaiDau);
    // console.log(formNewGiaiDau);
}