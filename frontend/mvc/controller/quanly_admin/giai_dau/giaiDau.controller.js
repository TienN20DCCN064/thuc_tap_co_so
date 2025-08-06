import hamChung from "/frontend/mvc/model/global/model.hamChung.js";
import { getElementIds, viewTbody, fillForm, loadDanhSachNguoiTao, loadDanhSachGiaiDau_chon, loadDanhSachDoiBong_chon } from "../../../view/view_js/quanly_admin/giai_dau/giaiDau.view.js";
import { GlobalStore, DoiTuyen } from "/frontend/global/global.js";
import hamChiTiet from "../../../model/global/model.hamChiTiet.js";

const {
    btnLuuThayDoi, btnTaiLaiTrang, btnLocDanhSach, form,
    maGiaiDau, tenGiaiDau, maNguoiTao, ngayBatDau, ngayKetThuc,
    ngayBatDauDangKy, ngayHetDangKy, hinhAnh, inputFile, moTa,
    ngayBatDau_chon_viewbody, ngayKetThuc_chon_viewbody,
    maGiaiDau_chon, maDoiBong_chon
} = getElementIds();
let ROLE_USER = "";
let data = [];
let data_doiBongGiaiDau = [];

// const ROLE_USER = await hamChung.getRoleUser();

document.addEventListener("DOMContentLoaded", async function () {
    ROLE_USER = await hamChung.getRoleUser();
    await loadDanhSachNguoiTao();
    console.log("Người tạo giải đấu: " + GlobalStore.getUsername());


    await reset_data_toanCuc();



    load_viewTbody();

    btnLuuThayDoi.addEventListener("click", handleLuuThayDoi);
    btnTaiLaiTrang.addEventListener("click", handleTaiLaiTrang);
    ngayBatDau_chon_viewbody.addEventListener("change", load_viewTbody);
    ngayKetThuc_chon_viewbody.addEventListener("change", load_viewTbody);

    btnLocDanhSach.addEventListener("click", async function () {
        await handle_view_locDanhSach(data);
    });
    maGiaiDau_chon.addEventListener("change", function () {
        loadDanhSachDoiBong_chon(maGiaiDau_chon.value);
        viewTbody_chon(data_doiBongGiaiDau, maGiaiDau_chon.value, maDoiBong_chon.value);
    });
    maDoiBong_chon.addEventListener("change", function () {
        viewTbody_chon(data_doiBongGiaiDau, maGiaiDau_chon.value, maDoiBong_chon.value);
    });


    // ...gắn các sự kiện lọc, popup, v.v...
});
async function reset_data_toanCuc() {
    data = await hamChung.layDanhSach("giai_dau");
    data_doiBongGiaiDau = await hamChung.layDanhSach("doi_bong_giai_dau");
    if (ROLE_USER === "VT02") {
        data = data.filter(item => item.ma_nguoi_tao === GlobalStore.getUsername());
        maNguoiTao.value = GlobalStore.getUsername();
        maNguoiTao.disabled = true; // Disable input for admin

        // lấy ra các đội bóng tham gia các giải đấu của data
        // const dataDoiBongGiaiDau_admin = data_doiBongGiaiDau;
        let dataDoiBongGiaiDau_theo_ql = [];
        for (const item of data) {
            const data_doiBong_theo_giaiDau = await hamChiTiet.danhSachDoiBong_theoGiai(item.ma_giai_dau);
            dataDoiBongGiaiDau_theo_ql = dataDoiBongGiaiDau_theo_ql.concat(data_doiBong_theo_giaiDau);
        }
        data_doiBongGiaiDau = dataDoiBongGiaiDau_theo_ql;

    }

}

async function load_viewTbody() {
    await reset_data_toanCuc();
    console.log(data);
    if (ngayBatDau_chon_viewbody.value !== "") {
        data = data.filter(item => item.ngay_bat_dau >= ngayBatDau_chon_viewbody.value);
    }
    if (ngayKetThuc_chon_viewbody.value !== "") {
        data = data.filter(item => item.ngay_ket_thuc <= ngayKetThuc_chon_viewbody.value);
    }


    await viewTbody(data, handleEdit, handleDelete);
}

function handleEdit(item) {
    fillForm(item);
}

async function handleDelete(item) {
    if (confirm(`Bạn có chắc chắn muốn xóa giải đấu "${item.ten_giai_dau}"?`)) {
        await hamChung.xoa({ ma_giai_dau: item.ma_giai_dau }, "giai_dau");
        load_viewTbody();
    }
}

async function handleLuuThayDoi(event) {
    event.preventDefault();
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    // kiểm tra dữ liệu ngày nữa
    // ...existing code...
    // Kiểm tra dữ liệu ngày
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
    // ...existing code...
    // ...validate ngày/tháng...
    let id_Hinh_anh_thay = inputFile.value === "" ? hinhAnh.value : inputFile.files[0].name;
    id_Hinh_anh_thay = hamChung.doiKhoangTrangThanhGachDuoi(id_Hinh_anh_thay);
    let formData = {
        ma_giai_dau: maGiaiDau.value,
        ten_giai_dau: tenGiaiDau.value,
        ma_nguoi_tao: maNguoiTao.value,
        ngay_bat_dau: ngayBatDau.value,
        ngay_ket_thuc: ngayKetThuc.value,

        ngay_bat_dau_dang_ky_giai: ngayBatDauDangKy.value,
        ngay_ket_thuc_dang_ky_giai: ngayHetDangKy.value,
        hinh_anh: id_Hinh_anh_thay,
        mo_ta: moTa.value

    };
    let formData_yeuCauTaoGiaiDau = {
        ma_yeu_cau: await hamChung.taoID_theoBang("giai_dau"),
        ten_giai_dau: tenGiaiDau.value,
        ngay_bat_dau: ngayBatDau.value,
        ngay_ket_thuc: ngayKetThuc.value,
        ngay_bat_dau_dang_ky_giai: ngayBatDauDangKy.value,
        ngay_ket_thuc_dang_ky_giai: ngayHetDangKy.value,
        hinh_anh: id_Hinh_anh_thay,
        mo_ta: moTa.value,
        ma_nguoi_gui: GlobalStore.getUsername()
    }


    if (maGiaiDau.value === "") {

        console.log(formData);
        console.log(ROLE_USER);

        if (ROLE_USER === "VT01") {
            // await hamChung.them(formData, "giai_dau");
            alert("Thêm thành công!");
        }
        else if (ROLE_USER === "VT02") {

            console.log(formData_yeuCauTaoGiaiDau);

            // Thêm xác nhận trước khi gửi yêu cầu
            const isConfirmed = confirm("Bạn có muốn gửi yêu cầu tạo giải đấu này không?");
            if (isConfirmed) {
                await hamChung.them(formData_yeuCauTaoGiaiDau, "yeu_cau_tao_giai_dau");
                alert("Gửi yêu cầu thành công!");
            }
        }
    } else {
        await hamChung.sua(formData, "giai_dau");
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

//////////////////////////////////// chưa .///////////

function handle_view_locDanhSach(data) {
    console.log(data);
    loadDanhSachGiaiDau_chon(data);
    // loadDanhSachDoiBong_chon(maGiaiDau_chon);
    console.log("tien");
    // Hiển thị bảng popupOverlay
    document.getElementById("popupOverlay").classList.remove("hidden");
    // Sự kiện khi nhấn nút "Đóng" trong bảng
    document.getElementById("closePopup").addEventListener("click", function () {
        // Ẩn bảng khi nhấn nút "Đóng"
        document.getElementById("popupOverlay").classList.add("hidden");
    });
    // còn trường hợp là lọc theo đội bóng

}
async function viewTbody_chon(data_doiBongGiaiDau, maGiaiDau_chon, maDoiBong_chon) {

    console.log(maGiaiDau_chon);
    console.log(maDoiBong_chon);
    let data = data_doiBongGiaiDau;

    // Lọc theo mã giải đấu nếu không phải "All"
    if (maGiaiDau_chon !== "All") {
        data = data.filter(item => item.ma_giai_dau === maGiaiDau_chon);
    }
    console.log(data);

    // Lọc tiếp theo mã đội bóng nếu không phải "All"
    if (maDoiBong_chon !== "All") {
        data = data.filter(item => item.ma_doi_bong === maDoiBong_chon);
    }

    // Hiển thị dữ liệu lọc được (tùy bạn xử lý render ra đâu)
    console.log(data); // hoặc gọi hàm render ra tbody


    // const tableBody = document.getElementById("dataTable_chon");
    // tableBody.innerHTML = "";

    const tableBody = document.querySelector("#dataTable_chon tbody");
    tableBody.innerHTML = "";
    // for(let i = 0;i<data.length;i++){
    //     const item = data[i];

    // }
    const rows = await Promise.all(data.map(async item => {
        // const hinh_anh = await hamChung.getImage(item.hinh_anh);
        // console.log(item.hinh_anh);
        let hinh_anh;
        const row = document.createElement("tr");
        // C:\Users\vanti\Desktop\quan_ly_tran_dau\frontend\public\images\cat-2.png

        if (item.hinh_anh === null) {
            // C:\Users\vanti\Desktop\mvc_project\frontend\assets\public\images\user-icon.png
            hinh_anh = "/frontend/assets/public/images/user-icon.png";
            // C:\Users\vanti\Desktop\mvc_project\frontend\assets\public\images\user-icon.png
        } else {
            hinh_anh = await hamChung.getImage(item.hinh_anh);

        }
        const lay1giaiDau = await hamChung.layThongTinTheo_ID("giai_dau", item.ma_giai_dau);
        const lay1DoiBong_hienTai = await hamChung.layThongTinTheo_ID("doi_bong", item.ma_doi_bong);

        let tenBangDau = "---";
        if (item.ma_bang_dau != null) {
            const lay1BangDau = await hamChung.layThongTinTheo_ID("bang_dau", item.ma_bang_dau);
            tenBangDau = lay1BangDau.ten_bang_dau;
        }
        row.innerHTML = `
            <td style="text-align: center;">${lay1giaiDau.ten_giai_dau}</td>
            <td style="text-align: center;">${lay1DoiBong_hienTai.ten_doi_bong}</td>
            <td style="text-align: center;">${item.ten_doi_bong}</td>
            <td style="text-align: center;">${tenBangDau}</td>
          
            <td style="text-align: center;"><img src="${hinh_anh}" alt="Logo" width="50"></td>
            <td style="text-align: center;">
                <select class="status-select form-control form-control-sm">
                    <option value="Co" ${item.hat_giong === 'co' ? 'selected' : ''} style="background-color: #f0ad4e; color: white;">Có</option>
                    <option value="Khong" ${item.hat_giong === 'khong' ? 'selected' : ''} style="background-color: #5bc0de; color: white;">Không</option>
                </select>
            </td>
        `;
        tableBody.appendChild(row);

        // Lắng nghe sự kiện change của select
        const select = row.querySelector('.status-select');
        const options = select.querySelectorAll('option');

        // Hàm thay đổi màu nền của select khi thay đổi giá trị
        select.addEventListener('change', (e) => {
            const selectedOption = e.target.options[e.target.selectedIndex];
            const selectedColor = selectedOption.style.backgroundColor;
            e.target.style.backgroundColor = selectedColor;
            // Cập nhật giá trị trang_thai khi người dùng thay đổi
            const newTrangThai = e.target.value;
            const maDoiBong = row.querySelector('td:nth-child(2)').textContent; // Lấy mã đội bóng (có thể thay đổi tuỳ theo cấu trúc dữ liệu)

            console.log(`Trạng thái đã thay đổi: ${newTrangThai} cho đội bóng: ${maDoiBong}`);
            const formData = {
                "ma_doi_bong": item.ma_doi_bong,
                "ma_giai_dau": item.ma_giai_dau,
                "hat_giong": newTrangThai
            };
            hamChung.sua(formData, "doi_bong_giai_dau");
            console.log(formData);

        });

        // Đặt màu nền ban đầu của select khi trang thái đã chọn
        const selectedOption = Array.from(options).find(option => option.selected);
        if (selectedOption) {
            select.style.backgroundColor = selectedOption.style.backgroundColor;
        }
    }));
}
