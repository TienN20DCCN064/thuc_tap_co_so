import hamChung from "../../../model/global/model.hamChung.js";
import {
    getElementIds,
    viewTbody,
    fillForm,
    loadDanhSachGiaiDau,
    loadDanhSachTranDau_chua_co_kq,
    loadDanhSachDoiBongThamGia,
    loadDanhSachGiaiDau_chon_viewbody
} from "../../../view/view_js/quanly_admin/tran_dau/ketQuaTranDau.view.js";

const {
    btnLuuThayDoi, btnTaiLaiTrang, maGiaiDau, maTranDau, soBanDoi1, soBanDoi2,
    maDoiThang, ghiChu, maGiaiDau_chon_viewbody, form
} = getElementIds();

document.addEventListener("DOMContentLoaded", async function () {
    await loadDanhSachGiaiDau(hamChung);
    let data = await hamChung.layDanhSach("ket_qua_tran_dau");
    await load_viewTbody(data);
    await loadDanhSachGiaiDau_chon_viewbody(hamChung);

    maGiaiDau.addEventListener("change", async function () {
        await loadDanhSachTranDau_chua_co_kq(hamChung, maGiaiDau.value);
    });
    maTranDau.addEventListener("change", function () {
        loadDanhSachDoiBongThamGia(hamChung, maTranDau.value);
    });

    btnLuuThayDoi.addEventListener("click", handleLuuThayDoi);
    btnTaiLaiTrang.addEventListener("click", handleTaiLaiTrang);
    maGiaiDau_chon_viewbody.addEventListener("change", async function () {
        let data = await hamChung.layDanhSach("ket_qua_tran_dau");
        load_viewTbody(data);
    });
});

async function load_viewTbody(data) {
    await viewTbody(data, hamChung, {}, handleEdit, handleDelete);
}

function handleEdit(item) {
    fillForm(item, hamChung);
}

async function handleDelete(item) {
    if (confirm(`Bạn có chắc chắn muốn xóa kết quả ${item.ma_tran_dau} khỏi giải đấu?`)) {
        await hamChung.xoa({ ma_tran_dau: item.ma_tran_dau }, "ket_qua_tran_dau");
        alert("Xóa thành công!");
        let data = await hamChung.layDanhSach("ket_qua_tran_dau");
        load_viewTbody(data);
    }
}

async function handleLuuThayDoi(event) {
    event.preventDefault();
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    let formData = {
        ma_tran_dau: maTranDau.value,
        ma_doi_thang: maDoiThang.value || null,
        so_ban_doi_1: soBanDoi1.value,
        so_ban_doi_2: soBanDoi2.value,
        ghi_chu: ghiChu.value,
    };
    if (maDoiThang.value === "") {
        formData.ma_doi_thang = null;
        if (soBanDoi1.value != soBanDoi2.value) {
            alert("Nếu không chọn đội thắng thì số bàn của hai đội phải bằng nhau!");
            return;
        }
    }
    const dsKq_tranDau = await hamChung.layDanhSach("ket_qua_tran_dau");
    const check_tranDau_co_kq_chua = dsKq_tranDau.some(item => item.ma_tran_dau === maTranDau.value);
    if (check_tranDau_co_kq_chua) {
        await hamChung.sua(formData, "ket_qua_tran_dau");
        alert("Sửa thành công!");
    } else {
        await hamChung.them(formData, "ket_qua_tran_dau");
        alert("Thêm thành công!");
    }
    let data = await hamChung.layDanhSach("ket_qua_tran_dau");
    await load_viewTbody(data);
}

function handleTaiLaiTrang(event) {
    event.preventDefault();
    location.reload();
}