import hamChung from "../../../model/global/model.hamChung.js";
import { getElementIds, viewTbody, fillForm } from "../../../view/view_js/quanly_admin/doi_bong/viTriCauThu.view.js";

const {
    btnLuuThayDoi,
    btnTaiLaiTrang,
    maViTri,
    tenViTri,
    form
} = getElementIds();

document.addEventListener("DOMContentLoaded", function () {
    load_viewTbody();
    btnLuuThayDoi.addEventListener("click", handleLuuThayDoi);
    btnTaiLaiTrang.addEventListener("click", handleTaiLaiTrang);
});

async function load_viewTbody() {
    const data = await hamChung.layDanhSach("vi_tri_cau_thu");
    viewTbody(data, handleEdit, handleDelete);
}

function handleEdit(item) {
    fillForm(item);
}

async function handleDelete(item) {
    if (confirm(`Bạn có chắc chắn muốn xóa vị trí ${item.ten_vi_tri}?`)) {
        await hamChung.xoa({ ma_vi_tri: item.ma_vi_tri }, "vi_tri_cau_thu");
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
    if (maViTri.value === "") {
        formData = {
            ma_vi_tri: await hamChung.taoID_theoBang("vi_tri_cau_thu"),
            ten_vi_tri: tenViTri.value
        };
        await hamChung.them(formData, "vi_tri_cau_thu");
        alert("Thêm thành công!");
    } else {
        formData = {
            ma_vi_tri: maViTri.value,
            ten_vi_tri: tenViTri.value
        };
        await hamChung.sua(formData, "vi_tri_cau_thu");
        alert("Sửa thành công!");
    }
    load_viewTbody();
}

function handleTaiLaiTrang(event) {
    event.preventDefault();
    location.reload();
}