import {
    viewTbody,
    button_sua,
    sapXep_danhDanh_bangXepHang_theoDiem,
    loadDanhSachGiaiDau,
    loadDanhSachBangDau,
    loadDanhSachDoiBong_theoBangDau,
    loadDanhSachGiaiDau_chon,
    loadDanhSachBangDau_1GiaiDau,
    tinhSoTran_hinhThucKetQua_theo_doiBongGiaiDau
} from "/frontend/mvc/view/view_js/quanly_admin/giai_dau/bangXepHangVongDau.view.js";
import hamChung from "/frontend/mvc/model/global/model.hamChung.js";



document.addEventListener("DOMContentLoaded", async function () {
    await viewTbody();
    await loadDanhSachGiaiDau();
    await loadDanhSachGiaiDau_chon();

    maGiaiDau.addEventListener("change", async function () {
        await loadDanhSachBangDau(maGiaiDau.value);
        await loadDanhSachDoiBong_theoBangDau(maGiaiDau.value, maBangDau.value);
    });
    maBangDau.addEventListener("change", async function () {
        if (!maDoiBong.disabled) {
            await loadDanhSachDoiBong_theoBangDau(maGiaiDau.value, maBangDau.value);
        }
    });

    chon_GiaiDau.addEventListener("change", async function () {
        await loadDanhSachBangDau_1GiaiDau(chon_GiaiDau.value);
        await viewTbody(chon_GiaiDau.value, chon_bangDau.value);
    });
    chon_bangDau.addEventListener("change", async function () {
        await viewTbody(chon_GiaiDau.value, chon_bangDau.value);
    });

    btnLuuThayDoi.addEventListener("click", handleLuuThayDoi);
    btnTaiLaiTrang.addEventListener("click", handleTaiLaiTrang);
});

async function handleLuuThayDoi(event) {
    event.preventDefault();
    const form = document.getElementById("inputForm");
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    let formData = {
        ma_giai_dau: maGiaiDau.value,
        ma_doi_bong: maDoiBong.value,
        ma_bang_dau: maBangDau.value,
        diem_vong_loai: madiem.value,
        ghi_chu: ghiChu.value
    };
    await hamChung.sua(formData, "doi_bong_giai_dau");
    alert("Sửa thành công");
    await viewTbody(chon_GiaiDau.value, chon_bangDau.value);
}

function handleTaiLaiTrang(event) {
    event.preventDefault();
    location.reload();
}
