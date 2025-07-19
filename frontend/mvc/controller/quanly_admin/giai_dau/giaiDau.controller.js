import hamChung from "/frontend/mvc/model/global/model.hamChung.js";
import { getElementIds, viewTbody, fillForm, loadDanhSachNguoiTao } from "../../../view/view_js/quanly_admin/giai_dau/giaiDau.view.js";

const {
    btnLuuThayDoi, btnTaiLaiTrang, btnLocDanhSach, form,
    maGiaiDau, tenGiaiDau, maNguoiTao, ngayBatDau, ngayKetThuc,
    ngayHetDangKy, hinhAnh, inputFile, moTa,
    maGioiTinh_viewBody, ngayBatDau_chon_viewbody, ngayKetThuc_chon_viewbody
} = getElementIds();

document.addEventListener("DOMContentLoaded", async function () {
    await loadDanhSachNguoiTao();
    load_viewTbody();
    btnLuuThayDoi.addEventListener("click", handleLuuThayDoi);
    btnTaiLaiTrang.addEventListener("click", handleTaiLaiTrang);
    maGioiTinh_viewBody.addEventListener("change", load_viewTbody);
    ngayBatDau_chon_viewbody.addEventListener("change", load_viewTbody);
    ngayKetThuc_chon_viewbody.addEventListener("change", load_viewTbody);

    btnLocDanhSach.addEventListener("click", handle_view_locDanhSach);


    // ...gắn các sự kiện lọc, popup, v.v...
});

async function load_viewTbody() {
    let data = await hamChung.layDanhSach("giai_dau");
    console.log(data);
    if (ngayBatDau_chon_viewbody.value !== "") {
        data = data.filter(item => item.ngay_bat_dau >= ngayBatDau_chon_viewbody.value);
    }
    if (ngayKetThuc_chon_viewbody.value !== "") {
        data = data.filter(item => item.ngay_ket_thuc <= ngayKetThuc_chon_viewbody.value);
    }
    if (maGioiTinh_viewBody.value != "All") {
        console.log(maGioiTinh_viewBody.value);
        data = data.filter(item => item.gioi_tinh === maGioiTinh_viewBody.value);
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
    // ...validate ngày/tháng...
    let formData = {};
    let id_Hinh_anh_thay = inputFile.value === "" ? hinhAnh.value : inputFile.files[0].name;
    id_Hinh_anh_thay = hamChung.doiKhoangTrangThanhGachDuoi(id_Hinh_anh_thay);

    if (maGiaiDau.value === "") {
        formData = {
            ma_giai_dau: await hamChung.taoID_theoBang("giai_dau"),
            ten_giai_dau: tenGiaiDau.value,
            ma_nguoi_tao: maNguoiTao.value,
            ngay_bat_dau: ngayBatDau.value,
            ngay_ket_thuc: ngayKetThuc.value,
            ngay_ket_thuc_dang_ky_giai: ngayHetDangKy.value,
            hinh_anh: id_Hinh_anh_thay,
            mo_ta: moTa.value,
        };
        console.log(formData);
        await hamChung.them(formData, "giai_dau");
        alert("Thêm thành công!");
    } else {
        formData = {
            ma_giai_dau: maGiaiDau.value,
            ten_giai_dau: tenGiaiDau.value,
            ma_nguoi_tao: maNguoiTao.value,
            ngay_bat_dau: ngayBatDau.value,
            ngay_ket_thuc: ngayKetThuc.value,
            ngay_ket_thuc_dang_ky_giai: ngayHetDangKy.value,
            hinh_anh: id_Hinh_anh_thay,
            mo_ta: moTa.value
        };
        console.log(formData);
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

function handle_view_locDanhSach(event) {
    loadDanhSachGiaiDau_chon();
    // loadDanhSachDoiBong_chon(maGiaiDau_chon);
    console.log("tien");
    event.preventDefault();
    // Hiển thị bảng popupOverlay
    document.getElementById("popupOverlay").classList.remove("hidden");
    // Sự kiện khi nhấn nút "Đóng" trong bảng
    document.getElementById("closePopup").addEventListener("click", function () {
        // Ẩn bảng khi nhấn nút "Đóng"
        document.getElementById("popupOverlay").classList.add("hidden");
    });
    // còn trường hợp là lọc theo đội bóng
    document.getElementById("maGiaiDau_chon").addEventListener("change", function () {
        // Ẩn bảng khi nhấn nút "Đóng"
        console.log(document.getElementById("maGiaiDau_chon").value);
        // tại sao lại không load danh sách đội bóng lại như ban đầu

        loadDanhSachDoiBong_chon(document.getElementById("maGiaiDau_chon").value);
        viewTbody_chon(document.getElementById("maGiaiDau_chon").value, document.getElementById("maDoiBong_chon").value);
        //    viewTbody_chon(document.getElementById("maGiaiDau_chon").value, document.getElementById("trangThai_chon").value);
        // console.log(trangThaiDuyet.value);

    });
    document.getElementById("maDoiBong_chon").addEventListener("change", function () {
        // Ẩn bảng khi nhấn nút "Đóng"
        console.log(document.getElementById("maDoiBong_chon").value);
        viewTbody_chon(document.getElementById("maGiaiDau_chon").value, document.getElementById("maDoiBong_chon").value);
        // console.log(trangThaiDuyet.value);

    });

}
async function viewTbody_chon(maGiaiDau_chon, maDoiBong_chon) {
    const data_doiBongGiaiDau = await hamChung.layDanhSach("doi_bong_giai_dau");
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

        if (item.logo === null) {
            // C:\Users\vanti\Desktop\mvc_project\frontend\assets\public\images\user-icon.png
            hinh_anh = "/frontend/assets/public/images/user-icon.png";
        } else {
            hinh_anh = await hamChung.getImage(item.logo);

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
            <td style="text-align: center;">${item.quoc_gia}</td>
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

async function loadDanhSachGiaiDau_chon() {
    const selectElement = document.getElementById("maGiaiDau_chon");
    selectElement.innerHTML = '<option value="All">Tất Cả</option>'; // Reset danh sách
    const data = await hamChung.layDanhSach("giai_dau");
    data.forEach(item => {
        const option = document.createElement("option");
        option.value = item.ma_giai_dau;
        option.textContent = `${item.ten_giai_dau}`;
        selectElement.appendChild(option);
    });
}

async function loadDanhSachDoiBong_chon(maGiaiDau) {
    const selectElement = document.getElementById("maDoiBong_chon");
    selectElement.innerHTML = '<option value="All">Tất Cả</option>'; // Reset danh sách
    let data;
    const data_doiBong = await hamChung.layDanhSach("doi_bong");
    // Lọc danh sách đội bóng theo mã giải đấu
    // maGiaiDau !== "All" thì lọc theo mã giải đấu
    console.log(maGiaiDau);
    if (maGiaiDau !== "All") {
        const dataDangKyGiai = await hamChung.layDanhSach("doi_bong_giai_dau");
        const loc_theoMaGiaiDau = dataDangKyGiai.filter(item => item.ma_giai_dau === maGiaiDau);

        // Tạo tập hợp mã đội bóng đã đăng ký giải
        const maDoiBongSet = new Set(loc_theoMaGiaiDau.map(item => item.ma_doi_bong));

        // Lọc danh sách đội bóng theo mã giải đấu
        const dataLoc = data_doiBong.filter(item => maDoiBongSet.has(item.ma_doi_bong));
        console.log(dataLoc);
        data = dataLoc;

    }
    else {
        data = data_doiBong;
    }
    console.log(maGiaiDau);
    data.forEach(item => {
        const option = document.createElement("option");
        option.value = item.ma_doi_bong;
        option.textContent = `${item.ten_doi_bong}`;
        selectElement.appendChild(option);
    });
}





