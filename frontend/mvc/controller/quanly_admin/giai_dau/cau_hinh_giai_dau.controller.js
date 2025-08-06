import hamChung from "/frontend/mvc/model/global/model.hamChung.js";
import hamChiTiet from "/frontend/mvc/model/global/model.hamChiTiet.js";
import thongBao from "/frontend/assets/components/thongBao.js";


import { GlobalStore } from "/frontend/global/global.js";
import { getElementIds, loadDanhSachGiaiDau, viewTbody, fillForm } from "../../../view/view_js/quanly_admin/giai_dau/cau_hinh_giai_dau.view.js";


const { btnLuu, btnTaiLai, form } = getElementIds();

let ROLE_USER = "";
let DATA = [];
let DATA_CAU_HINH_GIAI_DAU = [];



document.addEventListener("DOMContentLoaded", async function () {
    ROLE_USER = await hamChung.getRoleUser();
    await reset_data_toanCuc();

    await loadDanhSachGiaiDau(DATA);
    loadTbody();


    btnLuu.addEventListener("click", handleLuu);
    btnTaiLai.addEventListener("click", () => location.reload());
    form.addEventListener("submit", e => e.preventDefault());
});

async function reset_data_toanCuc() {
    DATA = await hamChung.layDanhSach("giai_dau");
    console.log("DATA", DATA);
    DATA_CAU_HINH_GIAI_DAU = await hamChung.layDanhSach("cau_hinh_giai_dau");
    if (ROLE_USER === "VT02") {
        DATA = DATA.filter(item => item.ma_nguoi_tao === GlobalStore.getUsername());

        let dataCauHinh_theo_ql = [];
        for (const item of DATA) {
            const dataCauHinh_theoGiaiDau = DATA_CAU_HINH_GIAI_DAU.filter(bang => bang.ma_giai_dau === item.ma_giai_dau);
            dataCauHinh_theo_ql = dataCauHinh_theo_ql.concat(dataCauHinh_theoGiaiDau);
        }
        DATA_CAU_HINH_GIAI_DAU = dataCauHinh_theo_ql;
    }
}


async function loadTbody() {
    await reset_data_toanCuc();
    await viewTbody(DATA_CAU_HINH_GIAI_DAU, handleEdit, handleDelete);
}

function handleEdit(item) {
    fillForm(item);
}

async function handleDelete(item) {
    if (confirm("Bạn có chắc chắn muốn xóa cấu hình này?")) {
        await hamChung.xoa({ ma_giai_dau: item.ma_giai_dau }, "cau_hinh_giai_dau");
        loadTbody();
    }
}

async function handleLuu(event) {
    event.preventDefault();
    const {
        maGiaiDau, thoiGianMoiHiep, soHiep, gioiTinhYeuCau,
        soLuongCauThuToiDa, soLuongCauThuToiThieu, soLuongDoiBongToiDa, ghiChu, form
    } = getElementIds();

    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const formData = {
        ma_giai_dau: maGiaiDau.value,
        thoi_gian_moi_hiep: thoiGianMoiHiep.value,
        so_hiep: soHiep.value,
        gioi_tinh_yeu_cau: gioiTinhYeuCau.value,
        so_luong_cau_thu_toi_da_moi_doi: soLuongCauThuToiDa.value,
        so_luong_cau_thu_toi_thieu_moi_doi: soLuongCauThuToiThieu.value,
        so_luong_doi_bong_toi_da_dang_ky: soLuongDoiBongToiDa.value,
        ghi_chu: ghiChu.value
    };
    console.log("Dữ liệu gửi đi:", formData);

    if (!maGiaiDau.disabled) {
        const exists = await hamChiTiet.check_id_form_tonTai(maGiaiDau.value, "cau_hinh_giai_dau");
        if (exists) {
            thongBao.thongBao_error("Cấu hình giải đấu đã tồn tại trong giải đấu - KHÔNG THỂ THÊM!", 3000, "error");
            return;
        }
        await hamChung.them(formData, "cau_hinh_giai_dau");
        alert("Thêm thành công!");
    } else {
        await hamChung.sua(formData, "cau_hinh_giai_dau");
        alert("Sửa thành công!");
    }
    loadTbody();
}

