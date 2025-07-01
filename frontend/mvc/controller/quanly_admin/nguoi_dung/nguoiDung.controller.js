import hamChung from "../../../model/global/model.hamChung.js";
import { getElementIds, viewTbody, fillForm, loadDanhSachTruong } from "../../../view/view_js/quanly_admin/nguoi_dung/nguoiDung.view.js";

const {
    btnLuuThayDoi,
    btnTaiLaiTrang,
    maNguoiDung,
    maTruong,
    hoTen,
    gioiTinh,
    email,
    soDienThoai,
    ngaySinh,
    form
} = getElementIds();

document.addEventListener("DOMContentLoaded", async function () {
    await loadDanhSachTruong();
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
        form.reset();
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
            ma_truong: maTruong.value,
            ho_ten: hoTen.value,
            gioi_tinh: gioiTinh.value,
            email: email.value,
            so_dien_thoai: soDienThoai.value,
            ngay_sinh: ngaySinh.value
        };
    } else {
        formData = {
            ma_nguoi_dung: maNguoiDung.value,
            ma_truong: maTruong.value,
            ho_ten: hoTen.value,
            gioi_tinh: gioiTinh.value,
            email: email.value,
            so_dien_thoai: soDienThoai.value,
            ngay_sinh: ngaySinh.value
        };
    }

    console.log(formData);

    if (maNguoiDung.value === "") {
        // check gmail đã tồn tại chưa
        const dataNguoiDung = await hamChung.layDanhSach("nguoi_dung");
        const isEmailExists = dataNguoiDung.some(item => item.email === formData.email);
        if (isEmailExists) {
            alert("Email đã tồn tại!");
            return;
        }

        await hamChung.them(formData, "nguoi_dung");
        alert("Thêm thành công!");
    } else {
        // check gmail đã tồn tại chưa  // nếu là sửa thì không cần kiểm tra trùng với chính nó
        const dataNguoiDung = await hamChung.layDanhSach("nguoi_dung");
        const isEmailExists = dataNguoiDung.some(item => item.email === formData.email && item.ma_nguoi_dung !== formData.ma_nguoi_dung);
        if (isEmailExists) {
            alert("Email đã tồn tại!");
            return;
        }

        await hamChung.sua(formData, "nguoi_dung");
        alert("Sửa thành công!");
    }

    load_viewTbody();
}

function handleTaiLaiTrang(event) {
    event.preventDefault();
    location.reload();
}