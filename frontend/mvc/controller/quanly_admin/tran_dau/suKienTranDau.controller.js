import hamChung from "../../../model/global/model.hamChung.js";
import {
    getElementIds,
    viewTbody,
    fillForm,
    loadDanhSachTranDau,
    loadDanhSachCauThu,
    loadDanhSachDoiBong,
    loadDanhSachGiaiDau_chon_viewbody,
    loadDanhSachVongDau_chon_viewbody,
    loadDanhSachTranDau_chon_viewbody
} from "../../../view/view_js/quanly_admin/tran_dau/suKienTranDau.view.js";

const {
    btnLuuThayDoi, btnTaiLaiTrang, maSuKien, maTranDau, maDoiBong, thoiDiem, loaiSuKien, maCauThu, ghiChu,
    maGiaiDau_chon_viewbody, maVongDau_chon_viewbody, maTranDau_chon_viewbody, form
} = getElementIds();

document.addEventListener("DOMContentLoaded", async function () {
    await loadDanhSachTranDau();
    await loadDanhSachGiaiDau_chon_viewbody();
    await load_viewTbody();
    maTranDau.addEventListener("change", async function () {
        await loadDanhSachDoiBong(maTranDau.value);
        maDoiBong.value = ""; // Reset đội bóng khi thay đổi trận đấu
    });
    maDoiBong.addEventListener("change", async function () {
        await loadDanhSachCauThu(maDoiBong.value);
    });
    maGiaiDau_chon_viewbody.addEventListener("change", async function () {
        await loadDanhSachVongDau_chon_viewbody(maGiaiDau_chon_viewbody.value);
        maVongDau_chon_viewbody.value = "All"; // Reset vòng đấu khi thay đổi giải đấu
        maTranDau_chon_viewbody.value = "All"; // Reset trận đấu khi thay đổi vòng đấu
        await load_viewTbody();
    });
    maVongDau_chon_viewbody.addEventListener("change", async function () {
        await loadDanhSachTranDau_chon_viewbody(maVongDau_chon_viewbody.value);
        maTranDau_chon_viewbody.value = "All"; // Reset trận đấu khi thay đổi vòng đấu
        await load_viewTbody();
    });
    maTranDau_chon_viewbody.addEventListener("change", async function () {
        await loadDanhSachCauThu(maTranDau_chon_viewbody.value);
        await load_viewTbody();
    });


    btnLuuThayDoi.addEventListener("click", handleLuuThayDoi);
    btnTaiLaiTrang.addEventListener("click", handleTaiLaiTrang);
});

async function load_viewTbody() {
    const data = await hamChung.layDanhSach("su_kien_tran_dau");
    await viewTbody(data, handleEdit, handleDelete);
}

function handleEdit(item) {
    fillForm(item);
}

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