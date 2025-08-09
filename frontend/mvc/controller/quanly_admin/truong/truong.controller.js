import hamChung from "../../../model/global/model.hamChung.js";
import { getElementIds, viewTbody, fillForm } from "../../../view/view_js/quanly_admin/truong/truong.view.js";

const { btnLuuThayDoi, btnTaiLaiTrang, maTruong, tenTruong, form } = getElementIds();

document.addEventListener("DOMContentLoaded", function () {
    load_viewTbody();
    btnLuuThayDoi.addEventListener("click", handleLuuThayDoi);
    btnTaiLaiTrang.addEventListener("click", handleTaiLaiTrang);
});

async function load_viewTbody() {
    const data = await hamChung.layDanhSach("truong");
    viewTbody(data, handleEdit, handleDelete);
}

function handleEdit(item) {
    fillForm(item);
}

async function handleDelete(item) {
    if (confirm(`Bạn có chắc chắn muốn xóa trường "${item.ten_truong}"?`)) {
        await hamChung.xoa({ ma_truong: item.ma_truong }, "truong");
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
    let formData = {
        ma_truong: maTruong.value,
        ten_truong: tenTruong.value
    };
    
    if (maTruong.value === "") {
        formData.ma_truong = await hamChung.taoID_theoBang("truong");
        console.log(formData);
        await hamChung.them(formData, "truong");
        alert("Thêm thành công!");
    } else {
        await hamChung.sua(formData, "truong");
        alert("Sửa thành công!");
    }
    load_viewTbody();
}

function handleTaiLaiTrang(event) {
    event.preventDefault();
    location.reload();
}