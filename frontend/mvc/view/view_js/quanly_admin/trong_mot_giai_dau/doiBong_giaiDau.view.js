export function getElementIds() {
    return {
        btnLuuThayDoi: document.getElementById("button_luu"),
        btnTaiLaiTrang: document.getElementById("button_taiLaiTrang"),
        maDoiBong: document.getElementById("maDoiBong"),
        maGiaiDau: document.getElementById("maGiaiDau"),
        tenDoiBong: document.getElementById("tenDoiBong"),
        hinhAnh: document.getElementById("logo"),
        inputFile: document.getElementById("logoFile"),
        form: document.getElementById("inputForm"),
        quocGia: document.getElementById("quocGia"),
        hatGiong: document.getElementById("hatGiong"),
        maBangDau: document.getElementById("maBangDau"),
        maGiaiDau_chon_viewbody: document.getElementById("maGiaiDau_chon_viewbody"),
        maBangDau_chon_viewbody: document.getElementById("maBangDau_chon_viewbody"),
        btnLocDanhSach: document.getElementById("button_locDanhSach"),
        popupOverlay: document.getElementById("popupOverlay"),
        closePopup: document.getElementById("closePopup"),
        tableBody: document.getElementById("dataTable"),
    };
}

// Các hàm viewTbody, fillForm, loadDanhSachDoiBong, ... 
// Copy logic render, fill form, load select option từ file cũ vào đây, giữ nguyên tính năng.