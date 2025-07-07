import hamChung from "../../../model/global/model.hamChung.js";
import {
    getElementIds,
    viewTbody,
    fillForm,
    loadDanhSachTrongTai,
    loadDanhSachLoaiTrongTai,
    loadDanhTranDau,
    loadDanhSachGiaiDau_chon_viewbody,
    loadDanhSachTranDauTheoGiaiDau_chon_viewbody,
    // ... các hàm view khác
} from "../../../view/view_js/quanly_admin/tran_dau/trongTai_tranDau.view.js";

const {
    btnLuuThayDoi, btnTaiLaiTrang, maTranDau, maTrongTai, maLoaiTrongTai, form,
    maGiaiDau_chon_viewbody, maTranDau_chon_viewbody, tableBody
} = getElementIds();

document.addEventListener("DOMContentLoaded", async function () {
    await loadDanhTranDau();
    await loadDanhSachTrongTai();
    await loadDanhSachLoaiTrongTai();
    await loadDanhSachGiaiDau_chon_viewbody();
    await load_viewTbody();
    btnLuuThayDoi.addEventListener("click", handleLuuThayDoi);
    btnTaiLaiTrang.addEventListener("click", handleTaiLaiTrang);

    maGiaiDau_chon_viewbody.addEventListener("change", async function () {
        await loadDanhSachTranDauTheoGiaiDau_chon_viewbody( maGiaiDau_chon_viewbody.value);
        let data = await hamChung.layDanhSach("trong_tai_tran_dau");
        await load_viewTbody(data);
    });

    maTranDau_chon_viewbody.addEventListener("change", async function () {
        let data = await hamChung.layDanhSach("trong_tai_tran_dau");
        await load_viewTbody(data);
    });
});

async function load_viewTbody(data) {
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
        await hamChung.them(formData, "trong_tai_tran_dau");
        alert("Thêm thành công!");
    }
    await load_viewTbody();
}

function handleTaiLaiTrang(event) {
    event.preventDefault();
    location.reload();
}