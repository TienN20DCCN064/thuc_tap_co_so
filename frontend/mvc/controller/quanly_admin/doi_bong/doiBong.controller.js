import hamChung from "../../../model/global/model.hamChung.js";
import {
    getElementIds,
    viewTbody,
    fillForm,
    loadDanhSachNguoiDung_quanLyDoiBong
} from "../../../view/view_js/quanly_admin/doi_bong/doiBong.view.js";

const {
    btnLuuThayDoi, btnTaiLaiTrang, maDoiBong, tenDoiBong, quocGia, maGioiTinh,
    hinhAnh, inputFile, form, maQlDoiBong, gioiTinh_chon_viewbody
} = getElementIds();

document.addEventListener("DOMContentLoaded", async function () {
    await loadDanhSachNguoiDung_quanLyDoiBong(hamChung);
    await load_viewTbody();
    btnLuuThayDoi.addEventListener("click", handleLuuThayDoi);
    btnTaiLaiTrang.addEventListener("click", handleTaiLaiTrang);
    gioiTinh_chon_viewbody.addEventListener("change", load_viewTbody);
});

async function load_viewTbody() {
    let data = await hamChung.layDanhSach("doi_bong");
    await viewTbody(data, hamChung, {}, handleEdit, handleDelete);
}

function handleEdit(item) {
    fillForm(item);
}

async function handleDelete(item) {
    if (confirm(`Bạn có chắc chắn muốn xóa đội bóng ${item.ten_doi_bong}?`)) {
        await hamChung.xoa({ ma_doi_bong: item.ma_doi_bong }, "doi_bong");
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
    let id_Hinh_anh_thay = inputFile.value === "" ? hinhAnh.value : inputFile.files[0].name;
    id_Hinh_anh_thay = hamChung.doiKhoangTrangThanhGachDuoi(id_Hinh_anh_thay);

    if (maDoiBong.value === "") {
        formData = {
            ma_doi_bong: await hamChung.taoID_theoBang("doi_bong"),
            ten_doi_bong: tenDoiBong.value,
            quoc_gia: quocGia.value,
            gioi_tinh: maGioiTinh.value,
            logo: id_Hinh_anh_thay,
            ma_ql_doi_bong: maQlDoiBong.value
        };
        await hamChung.them(formData, "doi_bong");
        alert("Thêm thành công!");
    } else {
        formData = {
            ma_doi_bong: maDoiBong.value,
            ten_doi_bong: tenDoiBong.value,
            quoc_gia: quocGia.value,
            gioi_tinh: maGioiTinh.value,
            logo: id_Hinh_anh_thay,
            ma_ql_doi_bong: maQlDoiBong.value
        };
        await hamChung.sua(formData, "doi_bong");
        alert("Sửa thành công!");
    }
    if (inputFile.value != "") {
        await hamChung.uploadImage(inputFile.files[0]);
    }
    load_viewTbody();
}

function handleTaiLaiTrang(event) {
    event.preventDefault();
    location.reload();
}