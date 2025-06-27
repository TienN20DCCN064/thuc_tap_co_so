export function getElementIds() {
    return {
        btnLuuThayDoi: document.getElementById("button_luu"),
        btnTaiLaiTrang: document.getElementById("button_taiLaiTrang"),
        button_xepLich: document.getElementById("button_xepLich"),
        maTranDau: document.getElementById("maTranDau"),
        maGiaiDau: document.getElementById("maGiaiDau"),
        maDoi1: document.getElementById("maDoi1"),
        maDoi2: document.getElementById("maDoi2"),
        ngayDienRa: document.getElementById("ngayDienRa"),
        gioDienRa: document.getElementById("gioDienRa"),
        sanVanDong: document.getElementById("sanVanDong"),
        button_xem_ds_trongTai: document.getElementById("button_xem_ds_trongTai"),
        button_luu_danhSachTranDau: document.getElementById("bt_luuDanhSachTranDau_tuDong"),
        trangThai: document.getElementById("trangThai"),
        maVongDau: document.getElementById("maVongDau"),
        maGiaiDau_chon_viewbody: document.getElementById("maGiaiDau_chon_viewbody"),
        maVongDau_chon_viewbody: document.getElementById("maVongDau_chon_viewbody"),
        form: document.getElementById("inputForm"),
        tableBody: document.getElementById("dataTable"),
    };
}

// Các hàm viewTbody, fillForm, loadDanhSachGiaiDau, loadDanhSachDoiBong_maDoi1_end, ... 
// nên được chuyển vào đây từ file cũ, chỉ giữ lại thao tác DOM, render, fill form, load select option.
// (Bạn có thể copy lại các hàm viewTbody, fillForm, loadDanhSachGiaiDau... từ file cũ sang đây, bỏ hết logic sự kiện.)
