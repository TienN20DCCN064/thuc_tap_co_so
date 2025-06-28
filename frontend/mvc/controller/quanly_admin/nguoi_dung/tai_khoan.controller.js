import hamChung from "../../../model/global/model.hamChung.js";
import {
    getElementIds,
    viewTbody,
    fillForm,
    loadDanhSachNguoiDung,
    loadDanhSachVaiTro
} from "../../../view/view_js/quanly_admin/nguoi_dung/tai_khoan.view.js";

const {
    btnLuuThayDoi, btnTaiLaiTrang, maNguoiDung, tenDangNhap, matKhau, trangThai, maVaiTro, ngayTao, form
} = getElementIds();

document.addEventListener("DOMContentLoaded", async function () {
    await loadDanhSachNguoiDung(hamChung);
    await loadDanhSachVaiTro(hamChung);
    await load_viewTbody();
    btnLuuThayDoi.addEventListener("click", handleLuuThayDoi);
    btnTaiLaiTrang.addEventListener("click", handleTaiLaiTrang);
});

async function load_viewTbody() {
    const data = await hamChung.layDanhSach("tai_khoan");
    viewTbody(data, handleEdit, handleDelete);
}

function handleEdit(item) {
    fillForm(item);
}

async function handleDelete(item) {
    if (confirm(`Bạn có chắc chắn muốn xóa tài khoản của người dùng "${item.ma_nguoi_dung}"?`)) {
        await hamChung.xoa({ ma_nguoi_dung: item.ma_nguoi_dung }, "tai_khoan");
        load_viewTbody();
    }
}

async function handleLuuThayDoi(event) {
    event.preventDefault();
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    let formData = {
        ma_nguoi_dung: maNguoiDung.value,
        ten_dang_nhap: tenDangNhap.value,
        mat_khau: matKhau.value,
        trang_thai: trangThai.value,
        ma_vai_tro: maVaiTro.value,
        ngay_tao: ngayTao.value
    };
    if (maNguoiDung.disabled && tenDangNhap.disabled) {
        await hamChung.sua(formData, "tai_khoan");
        alert("Sửa thành công!");
    } else {
        await hamChung.them(formData, "tai_khoan");
        alert("Thêm thành công!");
    }
    load_viewTbody();
}

function handleTaiLaiTrang(event) {
    event.preventDefault();
    location.reload();
}