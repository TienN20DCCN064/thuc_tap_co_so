import hamChung from "../../../model/global/model.hamChung.js";
import { getElementIds, viewTbody, fillForm } from "../../../view/view_js/quanly_admin/giai_dau/sanVanDong.view.js";

const {
    btnLuuThayDoi, btnTaiLaiTrang, maSan, tenSan, diaChi, sucChua, moTa, form
} = getElementIds();

document.addEventListener("DOMContentLoaded", function () {
    load_viewTbody();
    btnLuuThayDoi.addEventListener("click", handleLuuThayDoi);
    btnTaiLaiTrang.addEventListener("click", handleTaiLaiTrang);
});

async function load_viewTbody() {
    const data = await hamChung.layDanhSach("san_van_dong");
    viewTbody(data, handleEdit, handleDelete);
}

function handleEdit(item) {
    fillForm(item);
}

async function handleDelete(item) {
    if (confirm(`Bạn có chắc chắn muốn xóa sân "${item.ten_san}"?`)) {
        await hamChung.xoa({ ma_san: item.ma_san }, "san_van_dong");
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
    if (maSan.value === "") {
        formData = {
            ma_san: await hamChung.taoID_theoBang("san_van_dong"),
            ten_san: tenSan.value,
            dia_chi: diaChi.value,
            suc_chua: parseInt(sucChua.value),
            mo_ta: moTa.value
        };
        await hamChung.them(formData, "san_van_dong");
        alert("Thêm thành công!");
    } else {
        formData = {
            ma_san: maSan.value,
            ten_san: tenSan.value,
            dia_chi: diaChi.value,
            suc_chua: parseInt(sucChua.value),
            mo_ta: moTa.value
        };
        await hamChung.sua(formData, "san_van_dong");
        alert("Sửa thành công!");
    }
    load_viewTbody();
    form.reset();
    maSan.value = "";
}

function handleTaiLaiTrang(event) {
    event.preventDefault();
    location.reload();
}