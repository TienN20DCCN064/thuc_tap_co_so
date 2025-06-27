import hamChung from "../../../model/global/model.hamChung.js";
import { getElementIds, viewTbody, fillForm, loadDanhSachVaiTro } from "../../../view/view_js/quanly_admin/nguoi_dung/tai_khoan.view.js";

const {
    btnLuuThayDoi,
    btnTaiLaiTrang,
    taiKhoan,
    matKhau,
    trangThai,
    maVaiTro,
    form
} = getElementIds();

document.addEventListener("DOMContentLoaded", async function () {
    await loadDanhSachVaiTro(hamChung);
    load_viewTbody();
    btnLuuThayDoi.addEventListener("click", handleLuuThayDoi);
    btnTaiLaiTrang.addEventListener("click", handleTaiLaiTrang);
});

async function load_viewTbody() {
    const data = await hamChung.layDanhSach("tai_khoan");
    await viewTbody(data, hamChung, handleEdit, handleDelete);
}

function handleEdit(item) {
    fillForm(item);
}

async function handleDelete(item) {
    if (confirm(`Bạn có chắc chắn muốn xóa tài khoản ${item.tai_khoan}?`)) {
        await hamChung.xoa({ tai_khoan: item.tai_khoan }, "tai_khoan");
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
    if (taiKhoan.value === "") {
        formData = {
            tai_khoan: await hamChung.taoID_theoBang("tai_khoan"),
            mat_khau: matKhau.value,
            trang_thai: trangThai.value,
            ma_vai_tro: maVaiTro.value
        };
        await hamChung.them(formData, "tai_khoan");
        alert("Thêm thành công!");
    } else {
        formData = {
            tai_khoan: taiKhoan.value,
            mat_khau: matKhau.value,
            trang_thai: trangThai.value,
            ma_vai_tro: maVaiTro.value
        };
        await hamChung.sua(formData, "tai_khoan");
        alert("Sửa thành công!");
    }
    load_viewTbody();
}

function handleTaiLaiTrang(event) {
    event.preventDefault();
    location.reload();
}