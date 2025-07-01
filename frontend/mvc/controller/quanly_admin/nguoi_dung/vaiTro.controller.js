import hamChung from "../../../model/global/model.hamChung.js";
import { getElementIds, viewTbody, fillForm } from "../../../view/view_js/quanly_admin/nguoi_dung/vaiTro.view.js";

const {
    btnLuuThayDoi,
    btnTaiLaiTrang,
    form,
    maVaiTro,
    tenVaiTro,
} = getElementIds();

document.addEventListener("DOMContentLoaded", () => {
    load_viewTbody();
    btnLuuThayDoi.addEventListener("click", handleLuuThayDoi);
    btnTaiLaiTrang.addEventListener("click", handleTaiLaiTrang);
});

async function load_viewTbody() {
    const data = await hamChung.layDanhSach("vai_tro");
    viewTbody(data, handleEdit, handleDelete);
}

function handleEdit(item) {
    fillForm(item);
}

async function handleDelete(item) {
    if (confirm(`Bạn có chắc chắn muốn xóa vai trò "${item.ten_vai_tro}"?`)) {
        await hamChung.xoa({ ma_vai_tro: item.ma_vai_tro }, "vai_tro");
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
    if (maVaiTro.value === "") {
        formData = {
            ma_vai_tro: await hamChung.taoID_theoBang("vai_tro"),
            ten_vai_tro: tenVaiTro.value,
        };
        await hamChung.them(formData, "vai_tro");
        alert("Thêm thành công!");
    } else {
        formData = {
            ma_vai_tro: maVaiTro.value,
            ten_vai_tro: tenVaiTro.value,
        };
        await hamChung.sua(formData, "vai_tro");
        alert("Sửa thành công!");
    }
    load_viewTbody();
}

function handleTaiLaiTrang(event) {
    event.preventDefault();
    location.reload();
}