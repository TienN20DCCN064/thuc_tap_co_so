import hamChung from "/frontend/mvc/model/global/model.hamChung.js";
import hamChiTiet from "../../../model/global/model.hamChiTiet.js";
import { GlobalStore, DoiTuyen } from "/frontend/global/global.js";
import { getElementIds, viewTbody, fillForm, loadDanhSachNguoiGui, loadDanhSachNguoiDuyet }
    from "../../../view/view_js/quanly_admin/giai_dau/yeuCauTaoGiaiDau.view.js";
import thongBao from "/frontend/assets/components/thongBao.js";

const {
    btnLuuThayDoi, btnTaiLaiTrang, btnLocDanhSach, form,
    maYeuCau, tenGiaiDau, maNguoiGui, ngayBatDau, ngayKetThuc,
    ngayBatDauDangKy, ngayHetDangKy, hinhAnh, inputFile, moTa,
    trangThai, maNguoiDuyet, thoiGianGui, thoiGianDuyet,
    ngayBatDau_chon_viewbody, ngayKetThuc_chon_viewbody, trangThai_chon_viewbody
} = getElementIds();

let DATA_YEU_CAU_TAO_GIAI_DAU = [];

document.addEventListener("DOMContentLoaded", async function () {
    await loadDanhSachNguoiGui();
    await loadDanhSachNguoiDuyet();
    await loadData();

    btnLuuThayDoi.addEventListener("click", handleLuuThayDoi);
    btnTaiLaiTrang.addEventListener("click", handleTaiLaiTrang);
    ngayBatDau_chon_viewbody.addEventListener("change", loadData);
    ngayKetThuc_chon_viewbody.addEventListener("change", loadData);
    trangThai_chon_viewbody.addEventListener("change", loadData);
});

async function loadData() {
    DATA_YEU_CAU_TAO_GIAI_DAU = await hamChung.layDanhSach("yeu_cau_tao_giai_dau");
    // Lọc theo ngày nếu có chọn
    if (ngayBatDau_chon_viewbody.value) {
        DATA_YEU_CAU_TAO_GIAI_DAU = DATA_YEU_CAU_TAO_GIAI_DAU.filter(item => item.ngay_bat_dau >= ngayBatDau_chon_viewbody.value);
    }
    if (ngayKetThuc_chon_viewbody.value) {
        DATA_YEU_CAU_TAO_GIAI_DAU = DATA_YEU_CAU_TAO_GIAI_DAU.filter(item => item.ngay_ket_thuc <= ngayKetThuc_chon_viewbody.value);
    }
    if (trangThai_chon_viewbody.value && trangThai_chon_viewbody.value !== "All") {
        DATA_YEU_CAU_TAO_GIAI_DAU = DATA_YEU_CAU_TAO_GIAI_DAU.filter(item => item.trang_thai === trangThai_chon_viewbody.value);
    }
    await viewTbody(DATA_YEU_CAU_TAO_GIAI_DAU, handleXemMoTa, handleEdit, handleDelete);
}

function handleEdit(item) {
    fillForm(item);
}

async function handleDelete(item) {
    if (confirm(`Bạn có chắc chắn muốn xóa yêu cầu "${item.ten_giai_dau}"?`)) {
        await hamChung.xoa({ ma_yeu_cau: item.ma_yeu_cau }, "yeu_cau_tao_giai_dau");
        loadData();
    }
}

async function handleLuuThayDoi(event) {
    event.preventDefault();
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    // Validate ngày/tháng
    const startDate = new Date(ngayBatDau.value);
    const endDate = new Date(ngayKetThuc.value);
    const regStartDate = new Date(ngayBatDauDangKy.value);
    const regEndDate = new Date(ngayHetDangKy.value);

    if (startDate >= endDate) {
        alert("Ngày bắt đầu phải nhỏ hơn ngày kết thúc!");
        return;
    }
    if (regStartDate >= startDate) {
        alert("Ngày bắt đầu đăng ký giải phải nhỏ hơn ngày bắt đầu giải!");
        return;
    }
    if (regEndDate <= regStartDate) {
        alert("Ngày kết thúc đăng ký giải phải lớn hơn ngày bắt đầu đăng ký giải!");
        return;
    }
    if (regEndDate >= startDate) {
        alert("Ngày kết thúc đăng ký giải phải nhỏ hơn ngày bắt đầu giải!");
        return;
    }

    let id_Hinh_anh_thay = inputFile.value === "" ? hinhAnh.value : inputFile.files[0].name;
    id_Hinh_anh_thay = hamChung.doiKhoangTrangThanhGachDuoi(id_Hinh_anh_thay);

    let formData_YeuCauTaoGiaiDau = {
        ma_yeu_cau: maYeuCau.value,
        ten_giai_dau: tenGiaiDau.value,
        ma_nguoi_gui: maNguoiGui.value,
        ngay_bat_dau: ngayBatDau.value,
        ngay_ket_thuc: ngayKetThuc.value,
        ngay_bat_dau_dang_ky_giai: ngayBatDauDangKy.value,
        ngay_ket_thuc_dang_ky_giai: ngayHetDangKy.value,
        hinh_anh: id_Hinh_anh_thay,
        mo_ta: moTa.value,
        trang_thai: trangThai.value,
        ma_nguoi_duyet: maNguoiDuyet.value,
        thoi_gian_gui: thoiGianGui.value,
        thoi_gian_duyet: thoiGianDuyet.value
    };
    let formNewGiaiDau = {
        ma_giai_dau: await hamChung.taoID_theoBang("giai_dau"),
        ten_giai_dau: formData_YeuCauTaoGiaiDau.ten_giai_dau,
        ma_nguoi_tao: formData_YeuCauTaoGiaiDau.ma_nguoi_gui,
        ngay_bat_dau: formData_YeuCauTaoGiaiDau.ngay_bat_dau,
        ngay_ket_thuc: formData_YeuCauTaoGiaiDau.ngay_ket_thuc,
        ngay_bat_dau_dang_ky_giai: formData_YeuCauTaoGiaiDau.ngay_bat_dau_dang_ky_giai,
        ngay_ket_thuc_dang_ky_giai: formData_YeuCauTaoGiaiDau.ngay_ket_thuc_dang_ky_giai,
        hinh_anh: formData_YeuCauTaoGiaiDau.hinh_anh,
        mo_ta: formData_YeuCauTaoGiaiDau.mo_ta
    };
    await check_and_add_giai_dau(formNewGiaiDau, formData_YeuCauTaoGiaiDau, maYeuCau.value);
    if (!maYeuCau.value) {
        formData_YeuCauTaoGiaiDau.ma_yeu_cau = await hamChung.taoID_theoBang("yeu_cau_tao_giai_dau");
        // lấy time hiện tại // chuyển về dạng "2025-08-10T22:04"
        const now = new Date();
        const yyyy = now.getFullYear();
        const mm = String(now.getMonth() + 1).padStart(2, '0');
        const dd = String(now.getDate()).padStart(2, '0');
        const hh = String(now.getHours()).padStart(2, '0');
        const min = String(now.getMinutes()).padStart(2, '0');
        const currentTime = `${yyyy}-${mm}-${dd}T${hh}:${min}`;
        formData_YeuCauTaoGiaiDau.thoi_gian_gui = currentTime;
        formData_YeuCauTaoGiaiDau.thoi_gian_duyet = currentTime;
        formData_YeuCauTaoGiaiDau.ma_nguoi_duyet = GlobalStore.getUsername();
        console.log(formData_YeuCauTaoGiaiDau);


        await hamChung.them(formData_YeuCauTaoGiaiDau, "yeu_cau_tao_giai_dau");
        alert("Thêm yêu cầu thành công!");
    } else {
        console.log(formData_YeuCauTaoGiaiDau);
        console.log(formNewGiaiDau);

        await hamChung.sua(formData_YeuCauTaoGiaiDau, "yeu_cau_tao_giai_dau");
        alert("Sửa yêu cầu thành công!");
    }

    if (inputFile.value != "") {
        await hamChung.uploadImage(inputFile.files[0]);
    }

    loadData();
}

function handleTaiLaiTrang(event) {
    event.preventDefault();
    location.reload();
}

function handleXemMoTa(item) {
    thongBao.thongBao_error(`${item.mo_ta}`);
}
// tạo 1 hàm kiểm tra xem trạng thái của yêu cầu tạo, và nếu yêu cầu tạo là đã duyệt thì thêm vào giải đấu mới
async function check_and_add_giai_dau(formNewGiaiDau, formData_yeuCauTaoGiaiDau, maYeuCau) {
    // console.log(formNewGiaiDau);
    // console.log(formData_yeuCauTaoGiaiDau.ma_yeu_cau);
    // console.log(maYeuCau);
    // console.log(formData_yeuCauTaoGiaiDau);
    if (formData_yeuCauTaoGiaiDau.trang_thai === "da_duyet") {
        await hamChung.them(formNewGiaiDau, "giai_dau");
        alert("Yêu cầu đã được duyệt, giải đấu sẽ được tạo!");
    }

    // đang cập nhật // cứ có thao tác thì cứ thông báo là được
    if (maYeuCau) {
        const dataGiaiDau_theoQl = await hamChiTiet.layGiaiDauTheoQL(formNewGiaiDau.ma_nguoi_gui);
        // kiểm tra trong dataGiaiDau_theoQl có dataGiaiDau_theoQl[i].ma_nguoi_tao === formData_yeuCauTaoGiaiDau.ma_nguoi_gui
        // và xem dataGiaiDau_theoQl[i].ten_giai_dau === formNewGiaiDau.ten_giai_dau
        let soGiaiDauCungTen = 0;
        for (let i = 0; i < dataGiaiDau_theoQl.length; i++) {
            if (dataGiaiDau_theoQl[i].ma_nguoi_tao === formData_yeuCauTaoGiaiDau.ma_nguoi_gui && dataGiaiDau_theoQl[i].ten_giai_dau === formNewGiaiDau.ten_giai_dau) {
                soGiaiDauCungTen++;
            }
        }
        if (soGiaiDauCungTen > 0) {
            alert(`Đã có ${soGiaiDauCungTen} giải đấu cùng tên được ${formData_yeuCauTaoGiaiDau.ma_nguoi_gui} tạo!`);
        }
    }


    // console.log(formData_yeuCauTaoGiaiDau);
    // console.log(formNewGiaiDau);
}