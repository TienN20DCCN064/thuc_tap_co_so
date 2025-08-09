import hamChung from "/frontend/mvc/model/global/model.hamChung.js";
import FORM from "/frontend/MVC/controller/EditFormData.controller.js"
export function getElementIds() {
    return {
        btnLuuThayDoi: document.getElementById("button_luu"),
        btnTaiLaiTrang: document.getElementById("button_taiLaiTrang"),
        btnLocDanhSach: document.getElementById("button_locDanhSach"),
        maGiaiDau: document.getElementById("maGiaiDau"),
        tenGiaiDau: document.getElementById("tenGiaiDau"),
        maNguoiTao: document.getElementById("maNguoiTao"),
        ngayBatDau: document.getElementById("ngayBatDau"),
        ngayKetThuc: document.getElementById("ngayKetThuc"),
        ngayBatDauDangKy: document.getElementById("ngayBatDauDangKy"),
        ngayHetDangKy: document.getElementById("ngayHetDangKy"),
        // maGioiTinh: document.getElementById("maGioiTinh"),
        hinhAnh: document.getElementById("hinhAnh"),
        inputFile: document.getElementById("hinhAnhFile"),
        moTa: document.getElementById("moTa"),
        // trangThai: document.getElementById("trangThai"),
        // maGioiTinh_viewBody: document.getElementById("maGioiTinh_viewBody"),
        ngayBatDau_chon_viewbody: document.getElementById("ngayBatDau_chon_viewbody"),
        ngayKetThuc_chon_viewbody: document.getElementById("ngayKetThuc_chon_viewbody"),
        trangThai_chon_viewbody: document.getElementById("trangThai_chon_viewbody"),
        tableBody: document.getElementById("dataTable"),
        form: document.getElementById("inputForm"),
        /// form lọc danh sách ra
        maGiaiDau_chon: document.getElementById("maGiaiDau_chon"),
        maDoiBong_chon: document.getElementById("maDoiBong_chon"),
    };
}

// Hiển thị danh sách giải đấu
export async function viewTbody(data, onXemMoTa, onEdit, onDelete) {
    const { tableBody } = getElementIds();
    tableBody.innerHTML = "";

    for (const item of data) {
        let hinh_anh;
        if (item.hinh_anh === null || item.hinh_anh === "") {
            // hinh_anh = "/frontend/assets/public/images/cat-2.png";
            hinh_anh = "/frontend/assets/public/images/user-icon.png";
            // C:\Users\vanti\Desktop\mvc_project\frontend\assets\public\images\cat-2.png
        } else {
            hinh_anh = await hamChung.getImage(item.hinh_anh);
        }

        const row = document.createElement("tr");
        const data_1nguoiDung = await hamChung.layThongTinTheo_ID("nguoi_dung", item.ma_nguoi_tao);
        row.innerHTML = `
            <td style="text-align: center;">${item.ma_giai_dau}</td>
            <td style="text-align: center;">${item.ten_giai_dau}</td>
            <td style="text-align: center;">${data_1nguoiDung.ho_ten}</td>
            <td style="text-align:center">${item.ngay_bat_dau ? item.ngay_bat_dau.replace('T', ' ').slice(0, 16) : ""}</td>
            <td style="text-align: center;">${item.ngay_ket_thuc ? item.ngay_ket_thuc.replace('T', ' ').slice(0, 16) : ""}</td>

            <td style="text-align:center">${item.ngay_bat_dau_dang_ky_giai ? item.ngay_bat_dau_dang_ky_giai.replace('T', ' ').slice(0, 16) : ""}</td>
            <td style="text-align: center;">${item.ngay_ket_thuc_dang_ky_giai ? item.ngay_ket_thuc_dang_ky_giai.replace('T', ' ').slice(0, 16) : ""}</td>
            <td style="text-align: center;"><img src="${hinh_anh}" alt="Hình ảnh" width="50"></td>
           
            <td style="text-align: center;"><button class="btn btn-secondary btn-sm btn-xemMoTa">Xem</button></td>
            <td style="text-align: center;"><button class="edit-btn btn btn-warning btn-sm">Sửa</button></td>
            <td style="text-align: center;"><button class="delete-btn btn btn-danger btn-sm">Xóa</button></td>
        `;
        tableBody.appendChild(row);
        row.querySelector(".btn-xemMoTa").addEventListener("click", () => onXemMoTa(item));
        row.querySelector(".edit-btn").addEventListener("click", () => onEdit(item));
        row.querySelector(".delete-btn").addEventListener("click", () => onDelete(item));
    }
}

// Điền dữ liệu vào form
export function fillForm(item) {
    const {
        maGiaiDau, tenGiaiDau, maNguoiTao, ngayBatDau, ngayKetThuc,
        ngayBatDauDangKy, ngayHetDangKy, maGioiTinh, hinhAnh, moTa
    } = getElementIds();
    // console.log(maNguoiTao);
    maGiaiDau.value = item.ma_giai_dau;
    tenGiaiDau.value = item.ten_giai_dau;
    maNguoiTao.value = item.ma_nguoi_tao;
    ngayBatDau.value = item.ngay_bat_dau;
    ngayKetThuc.value = item.ngay_ket_thuc;
    ngayBatDauDangKy.value = item.ngay_bat_dau_dang_ky_giai;
    ngayHetDangKy.value = item.ngay_ket_thuc_dang_ky_giai;

    hinhAnh.value = item.hinh_anh;
    moTa.value = item.mo_ta || "";
   
    window.scrollTo({ top: 0, behavior: "smooth" });
}

export async function loadDanhSachNguoiTao() {
    const selectElement = document.getElementById("maNguoiTao");
    selectElement.innerHTML = '<option value="">-- Chọn Mã Người Tạo --</option>';
    const data = await hamChung.layDanhSach("nguoi_dung");
    data.forEach(item => {
        const option = document.createElement("option");
        option.value = item.ma_nguoi_dung;
        option.textContent = ` ${item.ma_nguoi_dung} - ${item.ho_ten}`;
        selectElement.appendChild(option);
    });
}


export async function loadDanhSachGiaiDau_chon(data) {
    const selectElement = document.getElementById("maGiaiDau_chon");
    selectElement.innerHTML = '<option value="All">Tất Cả</option>'; // Reset danh sách
    // const data = await hamChung.layDanhSach("giai_dau");
    data.forEach(item => {
        const option = document.createElement("option");
        option.value = item.ma_giai_dau;
        option.textContent = `${item.ten_giai_dau}`;
        selectElement.appendChild(option);
    });
}

export async function loadDanhSachDoiBong_chon(maGiaiDau) {
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





