export function getElementIds() {
    return {
        btnLuuThayDoi: document.getElementById("button_luu"),
        btnTaiLaiTrang: document.getElementById("button_taiLaiTrang"),
        maTranDau: document.getElementById("maTranDau"),
        maTrongTai: document.getElementById("maTrongTai"),
        maLoaiTrongTai: document.getElementById("maLoaiTrongTai"),
        form: document.getElementById("inputForm"),
        maGiaiDau_chon_viewbody: document.getElementById("maGiaiDau_chon_viewbody"),
        maTranDau_chon_viewbody: document.getElementById("maTranDau_chon_viewbody"),
        tableBody: document.getElementById("dataTable"),
    };
}

// Các hàm viewTbody, fillForm, loadDanhSachTrongTai, ... 
// Copy logic render, fill form, load select option từ file cũ vào đây, giữ nguyên tính năng.