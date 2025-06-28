import hamChung from "../../../model/global/model.hamChung.js";
import { getElementIds, viewTbody, fillForm,loadDanhSachGiaiDau,loadDanhSachGiaiDau_chon_viewBody } from "../../../view/view_js/quanly_admin/giai_dau/sanVanDong.view.js";

const {
    btnLuuThayDoi, btnTaiLaiTrang, maSan, maGiaiDau, tenSan, diaChi, sucChua, moTa,maGiaiDau_chon_viewbody, form
} = getElementIds();

document.addEventListener("DOMContentLoaded", async function () {
    await loadDanhSachGiaiDau();
    await loadDanhSachGiaiDau_chon_viewBody();
    load_viewTbody();
    btnLuuThayDoi.addEventListener("click", handleLuuThayDoi);
    btnTaiLaiTrang.addEventListener("click", handleTaiLaiTrang);
    maGiaiDau_chon_viewbody.addEventListener("change", load_viewTbody);
});

async function load_viewTbody() {
    let data = await hamChung.layDanhSach("san_van_dong");
    if (maGiaiDau_chon_viewbody.value !== "All") {
        data = data.filter(item => item.ma_giai_dau === maGiaiDau_chon_viewbody.value);
    }
    viewTbody(data, handleEdit, handleDelete);
}

function handleEdit(item) {
    fillForm(item);
}

async function handleDelete(item) {
    if (confirm(`Bạn có chắc chắn muốn xóa sân "${item.ten_san}"?`)) {
        await hamChung.xoa({ ma_san: item.ma_san }, "san_van_dong");
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
    if (maSan.value === "") {
        formData = {
            ma_san: await hamChung.taoID_theoBang("san_van_dong"),
            ma_giai_dau: maGiaiDau.value,
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
            ma_giai_dau: maGiaiDau.value,
            ten_san: tenSan.value,
            dia_chi: diaChi.value,
            suc_chua: parseInt(sucChua.value),
            mo_ta: moTa.value
        };
        await hamChung.sua(formData, "san_van_dong");
        alert("Sửa thành công!");
    }
    console.log(formData);
    load_viewTbody();
 //   form.reset();
   
}

function handleTaiLaiTrang(event) {
    event.preventDefault();
    location.reload();
}