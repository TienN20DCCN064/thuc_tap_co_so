import hamChung from "../../../model/global/model.hamChung.js";
import { getElementIds, viewTbody, fillForm, loadDanhSachTaiKhoan } from "../../../view/view_js/quanly_admin/nguoi_dung/nguoiDung.view.js";

const {
    btnLuuThayDoi,
    btnTaiLaiTrang,
    maNguoiDung,
    taiKhoan,
    hoTen,
    gioiTinh,
    email,
    soDienThoai,
    ngayTao,
    form
} = getElementIds();

document.addEventListener("DOMContentLoaded", function () {
    loadDanhSachTaiKhoan();
    load_viewTbody();
    btnLuuThayDoi.addEventListener("click", handleLuuThayDoi);
    btnTaiLaiTrang.addEventListener("click", handleTaiLaiTrang);
});

async function load_viewTbody() {
    const data = await hamChung.layDanhSach("nguoi_dung");
    viewTbody(data, handleEdit, handleDelete);
}

function handleEdit(item) {
    fillForm(item);
}

async function handleDelete(item) {
    if (confirm(`Bạn có chắc chắn muốn xóa người dùng ${item.tai_khoan}?`)) {
        await hamChung.xoa({ ma_nguoi_dung: item.ma_nguoi_dung }, "nguoi_dung");
        load_viewTbody();
    }
}

async function handleLuuThayDoi(event) {
    event.preventDefault();
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    let formData = {};
    if (maNguoiDung.value === "") {
        formData = {
            ma_nguoi_dung: await hamChung.taoID_theoBang("nguoi_dung"),
            ho_ten: hoTen.value,
            gioi_tinh: gioiTinh.value,
            email: email.value,
            so_dien_thoai: soDienThoai.value,
            ngay_tao: ngayTao.value
        };
    } else {
        formData = {
            ma_nguoi_dung: maNguoiDung.value,
            ho_ten: hoTen.value,
            gioi_tinh: gioiTinh.value,
            email: email.value,
            so_dien_thoai: soDienThoai.value,
            ngay_tao: ngayTao.value
        };
    }

    if (taiKhoan.value.trim() !== "") {
        formData.tai_khoan = taiKhoan.value;
    }

    if (maNguoiDung.value === "") {
        await hamChung.them(formData, "nguoi_dung");
        alert("Thêm thành công!");
    } else {
        await hamChung.sua(formData, "nguoi_dung");
        alert("Sửa thành công!");
    }
    load_viewTbody();
}

function handleTaiLaiTrang(event) {
    event.preventDefault();
    location.reload();
}