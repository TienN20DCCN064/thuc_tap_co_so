import hamChung from "/frontend/mvc/model/global/model.hamChung.js";
import {
    getElementIds,
    viewTbody,
    fillForm,
    loadDanhSachGiaiDau,
    loadDanhSachGiaiDau_chon_viewBody
} from "../../../view/view_js/quanly_admin/giai_dau/bangDau.view.js";

const {
    btnLuuThayDoi, btnTaiLaiTrang, maBangDau, tenBangDau, maGiaiDau, maGiaiDau_chon_viewbody, form
} = getElementIds();

document.addEventListener("DOMContentLoaded", async function () {
    await loadDanhSachGiaiDau();
    await loadDanhSachGiaiDau_chon_viewBody();
    await load_viewTbody();
    btnLuuThayDoi.addEventListener("click", handleLuuThayDoi);
    btnTaiLaiTrang.addEventListener("click", handleTaiLaiTrang);
    maGiaiDau_chon_viewbody.addEventListener("change", load_viewTbody);
});

async function load_viewTbody() {
    let data = await hamChung.layDanhSach("bang_dau");
    if (maGiaiDau_chon_viewbody.value !== "All") {
        data = data.filter(item => item.ma_giai_dau === maGiaiDau_chon_viewbody.value);
    }
    await viewTbody(data, hamChung, handleEdit, handleDelete);
}

function handleEdit(item) {
    fillForm(item);
}

async function handleDelete(item) {
    if (confirm(`Bạn có chắc chắn muốn xóa bảng đấu "${item.ten_bang_dau}"?`)) {
        await hamChung.xoa({ ma_bang_dau: item.ma_bang_dau }, "bang_dau");
        load_viewTbody();
    }
}

async function handleLuuThayDoi(event) {
    event.preventDefault();
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    if (!maGiaiDau.value) {
        alert("Vui lòng chọn một giải đấu!");
        return;
    }
    let formData = {};
    if (maBangDau.value === "") {
        formData = {
            ma_bang_dau: await hamChung.taoID_theoBang("bang_dau"),
            ten_bang_dau: tenBangDau.value,
            ma_giai_dau: maGiaiDau.value
        };
        await hamChung.them(formData, "bang_dau");
        alert("Thêm thành công!");
    } else {
        formData = {
            ma_bang_dau: maBangDau.value,
            ten_bang_dau: tenBangDau.value,
            ma_giai_dau: maGiaiDau.value
        };
        await hamChung.sua(formData, "bang_dau");
        alert("Sửa thành công!");
    }
    load_viewTbody();
}

function handleTaiLaiTrang(event) {
    event.preventDefault();
    location.reload();
}