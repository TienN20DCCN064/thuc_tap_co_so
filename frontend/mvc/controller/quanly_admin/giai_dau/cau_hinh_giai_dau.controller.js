import hamChung from "/frontend/mvc/model/global/model.hamChung.js";
import { getElementIds, loadDanhSachGiaiDau, viewTbody, fillForm } from "../../../view/view_js/quanly_admin/giai_dau/cau_hinh_giai_dau.view.js";



document.addEventListener("DOMContentLoaded", async function () {
    await loadDanhSachGiaiDau();
    loadTbody();

    const { btnLuu, btnTaiLai, form } = getElementIds();
    btnLuu.addEventListener("click", handleLuu);
    btnTaiLai.addEventListener("click", () => location.reload());
    form.addEventListener("submit", e => e.preventDefault());
});

async function loadTbody() {
    const data = await hamChung.layDanhSach("cau_hinh_giai_dau");
    console.log("Danh sách cấu hình giải đấu:", data);
    await viewTbody(data, handleEdit, handleDelete);
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
        await hamChung.them(formData, "cau_hinh_giai_dau");
        alert("Thêm thành công!");
    } else {
        await hamChung.sua(formData, "cau_hinh_giai_dau");
        alert("Sửa thành công!");
    }
    loadTbody();
}