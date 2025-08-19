import hamChung from "../../../model/global/model.hamChung.js";
import {
    getElementIds,
    viewTbody,
    fillForm,
    loadDanhSachGiaiDau,
    loadDanhSachVongDau,
    loadDanhSachTranDau
} from "../../../view/view_js/quanly_admin/cau_hinh/cauHinhGiaoDien.view.js";

const {
    btnLuuThayDoi, btnTaiLaiTrang, maCauHinhGiaoDien, tenCauHinhGiaoDien, background, backgroundFile,
    maGiaiDau, maVongDau, maTranDau, isDangSuDung, form
} = getElementIds();

document.addEventListener("DOMContentLoaded", async function () {
    await load_viewTbody();
    await loadDanhSachGiaiDau();
    btnLuuThayDoi.addEventListener("click", handleLuuThayDoi);
    btnTaiLaiTrang.addEventListener("click", handleTaiLaiTrang);

    maGiaiDau.addEventListener("change", async function () {
        console.log("Chọn giải đấu:", maGiaiDau.value);
        await loadDanhSachVongDau(maGiaiDau.value);
        // Reset vòng đấu và trận đấu khi giải đấu thay đổi
        maTranDau.innerHTML = '<option value="">-- Chọn Trận Đấu --</option>';
    });
    maVongDau.addEventListener("change", async function () {
        console.log("Chọn vòng đấu:", maVongDau.value);
        await loadDanhSachTranDau(maGiaiDau.value, maVongDau.value);
    });


});

async function load_viewTbody(data) {
    await viewTbody(data, handleEdit, handleDelete);
}

async function handleEdit(item) {
    form.reset();
    fillForm(item);
}

async function handleDelete(item) {
    if (confirm(`Bạn có chắc chắn muốn xóa cấu hình "${item.ten_cau_hinh_giao_dien}"?`)) {
        await hamChung.xoa({
            ma_cau_hinh_giao_dien: item.ma_cau_hinh_giao_dien
        }, "cau_hinh_giao_dien");
        await load_viewTbody();
    }
}

async function handleLuuThayDoi(event) {
    event.preventDefault();
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    let id_Hinh_anh_thay = backgroundFile.value === "" ? background.value : backgroundFile.files[0].name;
    id_Hinh_anh_thay = hamChung.doiKhoangTrangThanhGachDuoi(id_Hinh_anh_thay);
    let formData = {
        ma_cau_hinh_giao_dien: maCauHinhGiaoDien.value,
        ten_cau_hinh_giao_dien: tenCauHinhGiaoDien.value,
        background: id_Hinh_anh_thay,
        ma_tran_dau: maTranDau.value,
        is_dang_su_dung: isDangSuDung.value,
    };

    if (maCauHinhGiaoDien.value === "") {
        formData.ma_cau_hinh_giao_dien = await hamChung.taoID_theoBang("cau_hinh_giao_dien");
        await hamChung.them(formData, "cau_hinh_giao_dien");
        alert("Thêm thành công!");

    } else {
        await hamChung.sua(formData, "cau_hinh_giao_dien");
        alert("Sửa thành công!");
    }
    console.log("formData", formData);
    if (backgroundFile.value != "") {
        await hamChung.uploadImage(backgroundFile.files[0]);
    }
    load_viewTbody();
}

function handleTaiLaiTrang(event) {
    event.preventDefault();
    location.reload();
}