import hamChung from "../../../model/global/model.hamChung.js";
import {
    getElementIds, viewTbody, fillForm, loadDanhSachGiaiDau, loadDanhSachGiaiDau_chon_viewBody
} from "../../../view/view_js/quanly_admin/giai_dau/vongDau.view.js";

const {
    btnLuuThayDoi, btnTaiLaiTrang, maVongDau, tenVongDau, moTa, maGiaiDau, maGiaiDau_chon_viewbody, form
} = getElementIds();

document.addEventListener("DOMContentLoaded", async function () {
    await loadDanhSachGiaiDau(hamChung);
    await loadDanhSachGiaiDau_chon_viewBody(hamChung);
    await load_viewTbody();
    btnLuuThayDoi.addEventListener("click", handleLuuThayDoi);
    btnTaiLaiTrang.addEventListener("click", handleTaiLaiTrang);
    maGiaiDau_chon_viewbody.addEventListener("change", load_viewTbody);
});

async function load_viewTbody() {
    const data = await hamChung.layDanhSach("vong_dau");
    viewTbody(data, hamChung, handleEdit, handleDelete);
}

function handleEdit(item) {
    fillForm(item);
}

async function handleDelete(item) {
    if (confirm(`Bạn có chắc chắn muốn xóa vòng đấu "${item.ten_vong_dau}"?`)) {
        await hamChung.xoa({ ma_vong_dau: item.ma_vong_dau }, "vong_dau");
        load_viewTbody();
    }
}

async function handleLuuThayDoi(event) {
    event.preventDefault();
    let formData = {};
    if (maVongDau.value === "") {
        formData = {
            ma_vong_dau: await hamChung.taoID_theoBang("vong_dau"),
            ten_vong_dau: tenVongDau.value,
            ma_giai_dau: maGiaiDau.value,
            mo_ta: moTa.value
        };
        await hamChung.them(formData, "vong_dau");
        alert("Thêm thành công!");
    } else {
        formData = {
            ma_vong_dau: maVongDau.value,
            ten_vong_dau: tenVongDau.value,
            ma_giai_dau: maGiaiDau.value,
            mo_ta: moTa.value
        };
        await hamChung.sua(formData, "vong_dau");
        alert("Sửa thành công!");
    }
    load_viewTbody();
}

function handleTaiLaiTrang(event) {
    event.preventDefault();
    location.reload();
}