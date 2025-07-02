import hamChung from "../../../model/global/model.hamChung.js";
import thongBao from "/frontend/assets/public/src/common/chung_thongBao/thongBao.js";
import {
    getElementIds,
    viewTbody,
    fillForm,

    loadDanhSachGiaiDau,
    loadDanhSachBangDau,
    loadDanhSachDoiBong,
    loadDanhSachGiaiDau_chon_viewbody,
    loadDanhSachBangDau_chon_viewbody,

} from "../../../view/view_js/quanly_admin/trong_mot_giai_dau/doiBong_giaiDau.view.js";

const ids = getElementIds();

document.addEventListener("DOMContentLoaded", async function () {
    await loadDanhSachGiaiDau();
    await loadDanhSachDoiBong();
    await loadDanhSachGiaiDau_chon_viewbody();
    await load_viewTbody();

    ids.btnLuuThayDoi.addEventListener("click", handleLuuThayDoi);
    ids.btnTaiLaiTrang.addEventListener("click", handleTaiLaiTrang);
    ids.maGiaiDau.addEventListener("change", () => loadDanhSachBangDau());
    // bảng đấu 
    ids.maDoiBong.addEventListener("change", async function () {
        const isExists = await check_doiBongGiaiDau_tonTai(ids.maGiaiDau.value, ids.maDoiBong.value);
        if (isExists) {
            thongBao.thongBao_error("Đội bóng đã tồn tại trong giải đấu này!", 3000, "error");
            ids.maDoiBong.value = ""; // Reset lại giá trị
            ids.tenDoiBong.value = "";
            return;
        }
        const data1DoiBong = await hamChung.layThongTinTheo_ID("doi_bong", ids.maDoiBong.value);
        ids.tenDoiBong.value = data1DoiBong.ten_doi_bong; // Cập nhật tên đội bóng

    });


    ids.maGiaiDau_chon_viewbody.addEventListener("change", async function () {
        await loadDanhSachBangDau_chon_viewbody(ids.maGiaiDau_chon_viewbody.value);
        await load_viewTbody();
    });
    ids.maBangDau_chon_viewbody.addEventListener("change", async function () {
        await load_viewTbody();
    });

    // // Popup filter
    // ids.closePopup.addEventListener("click", () => {
    //     ids.popupOverlay.classList.add("hidden");
    // });
    // ids.maGiaiDau_chon.addEventListener("change", async function () {
    //     await loadDanhSachDoiBong_chon_popup(ids.maGiaiDau_chon.value);
    //     await load_viewTbody_chon_popup();
    // });
    // ids.maDoiBong_chon.addEventListener("change", async function () {
    //     await load_viewTbody_chon_popup();
    // });
});

async function load_viewTbody() {
    let data = await hamChung.layDanhSach("doi_bong_giai_dau");
    // Lọc theo filter viewbody
    const maGiaiDau = ids.maGiaiDau_chon_viewbody.value;
    const maBangDau = ids.maBangDau_chon_viewbody.value;
    if (maGiaiDau && maGiaiDau !== "All") data = data.filter(d => d.ma_giai_dau === maGiaiDau);
    if (maBangDau && maBangDau !== "All") data = data.filter(d => d.ma_bang_dau === maBangDau);
    await viewTbody(data, handleLDTC, handleGhiChu, handleEdit, handleDelete);
}
async function handleLDTC(item) {
    thongBao.thongBao_error(`${item.ly_do_tu_choi}`);

}
async function handleGhiChu(item) {
    thongBao.thongBao_error(`${item.ghi_chu}`);
    // showNotification("Thông tin không hợp lệ!", null, "error"); // Đỏ
}

async function handleEdit(item) {
    ids.maGiaiDau.value = item.ma_giai_dau || "";
    await loadDanhSachBangDau(); // Load xong danh sách
    fillForm(item); // Sau khi load, điền thông tin vào form
}

async function handleDelete(item) {
    if (confirm(`Bạn có chắc chắn muốn xóa đội bóng ${item.ma_doi_bong} khỏi giải đấu?`)) {
        await hamChung.xoa({ ma_doi_bong: item.ma_doi_bong, ma_giai_dau: item.ma_giai_dau }, "doi_bong_giai_dau");
        await load_viewTbody();
    }
}

async function handleLuuThayDoi(event) {
    event.preventDefault();
    if (!ids.form.checkValidity()) {
        ids.form.reportValidity();
        return;
    }
    let id_Hinh_anh_thay = "";
    if (ids.inputFile.value === "")
        id_Hinh_anh_thay = ids.hinhAnh.value;
    else
        id_Hinh_anh_thay = ids.inputFile.files[0].name;
    id_Hinh_anh_thay = hamChung.doiKhoangTrangThanhGachDuoi(id_Hinh_anh_thay);

    let formData = {
        ma_doi_bong: ids.maDoiBong.value,
        ma_giai_dau: ids.maGiaiDau.value,
        ma_bang_dau: ids.maBangDau.value,
        ten_doi_bong: ids.tenDoiBong.value,
        hat_giong: ids.hatGiong.value,
        hinh_anh: id_Hinh_anh_thay,
        thoi_gian_dang_ky: ids.thoiGianDangKy.value,
        trang_thai: ids.trangThai.value,
        ly_do_tu_choi: ids.lyDoTuChoi.value,
        ghi_chu: ids.ghiChu.value
    };

    if (ids.thoiGianDangKy.value === "") delete formData.thoi_gian_dang_ky;

    console.log("Form data to submit:", formData);
    if (ids.maDoiBong.disabled && ids.maGiaiDau.disabled) {
        if (ids.maBangDau.value === "") formData.ma_bang_dau = null;
        await hamChung.sua(formData, "doi_bong_giai_dau");
        alert("Sửa thành công!");
    } else {
        if (ids.maBangDau.value === "") delete formData.ma_bang_dau;
        await hamChung.them(formData, "doi_bong_giai_dau");
        alert("Thêm thành công!");
    }
    if (ids.inputFile.value != "") {
        await hamChung.uploadImage(ids.inputFile.files[0]);
    }
    ids.maDoiBong.disabled = false;
    ids.maGiaiDau.disabled = false;

    load_viewTbody();
}

function handleTaiLaiTrang(event) {
    event.preventDefault();
    location.reload();
}

// Xử lý popup lọc danh sách
async function handle_view_locDanhSach(event) {
    event.preventDefault();
    const ids = getElementIds();
    ids.popupOverlay.classList.remove("hidden");
    await loadDanhSachGiaiDau_chon_popup();
    await loadDanhSachDoiBong_chon_popup(ids.maGiaiDau_chon.value);
    await load_viewTbody_chon_popup();
}

// // Load bảng popup lọc
// async function load_viewTbody_chon_popup() {
//     const ids = getElementIds();
//     let data = await hamChung.layDanhSach("doi_bong_giai_dau");
//     const maGiaiDau = ids.maGiaiDau_chon.value;
//     const maDoiBong = ids.maDoiBong_chon.value;
//     if (maGiaiDau && maGiaiDau !== "All") data = data.filter(d => d.ma_giai_dau === maGiaiDau);
//     if (maDoiBong && maDoiBong !== "All") data = data.filter(d => d.ma_doi_bong === maDoiBong);
//     await viewTbody_chon(data);
// }
async function check_doiBongGiaiDau_tonTai(maGiaiDau, maDoiBong) {
    const dataDoiBongGiaiDau = await hamChung.layDanhSach("doi_bong_giai_dau");
    // kiểm tra đã tòn tại chưa
    const exists = dataDoiBongGiaiDau.some(item => item.ma_doi_bong === maDoiBong && item.ma_giai_dau === maGiaiDau);
    if (exists) {
        return true; // Đã tồn tại
    }
    return false; // Chưa tồn tại
}