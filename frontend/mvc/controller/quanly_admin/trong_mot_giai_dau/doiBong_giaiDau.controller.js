import hamChung from "../../../model/global/model.hamChung.js";
import thongBao from "/frontend/assets/components/thongBao.js";
//C:\Users\vanti\Desktop\mvc_project\frontend\assets\components\thongBao.js
import {
    getElementIds,
    viewTbody,
    fillForm,

    loadDanhSachGiaiDau,
    loadDanhSachBangDau,
    loadDanhSachDoiBong,
    loadDanhSachGiaiDau_chon_viewbody,
    loadDanhSachBangDau_chon_viewbody,
    loadDanhSachGiaiDau_chon,

} from "../../../view/view_js/quanly_admin/trong_mot_giai_dau/doiBong_giaiDau.view.js";

const ids = getElementIds();
const popupOverlay = document.getElementById("popupOverlay");
const closePopup = document.getElementById("closePopup");
let danhSachCauThu_thamGia_cua1doi;

document.addEventListener("DOMContentLoaded", async function () {
    await loadDanhSachGiaiDau();
    await loadDanhSachDoiBong();
    await loadDanhSachGiaiDau_chon_viewbody();
    await loadDanhSachGiaiDau_chon();
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
    ids.button_xem_danh_sach_dang_ky.addEventListener("click", async function (event) {
        event.preventDefault();
        console.log("Xem danh sách đăng ký");
        handle_view_dang_ky_giai_dau(event);
    });
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


/////////////////////////////////////////////////////////////////////////////
// Load danh sách đội bóng cho filter viewbody

function handle_view_dang_ky_giai_dau(event) {
    console.log("tien");
    event.preventDefault();
    // reset tbody của  dataTable_chon
    document.getElementById("maGiaiDau_chon").value = "All"; // Reset giá trị giải đấu
    document.getElementById("trangThai_chon").value = "All"; // Reset giá trị trạng thái

    viewTbody_chon("All", "All");
    // Hiển thị bảng popupOverlay
    document.getElementById("popupOverlay").classList.remove("hidden");
    // Sự kiện khi nhấn nút "Đóng" trong bảng
    document.getElementById("closePopup").addEventListener("click", function () {
        // Ẩn bảng khi nhấn nút "Đóng"
        document.getElementById("popupOverlay").classList.add("hidden");
    });


    // (Tùy chọn) Hiển thị dữ liệu cho bảng (nếu có)
    // Gọi hàm viewTbody để lấy dữ liệu và hiển thị trong bảng
    document.getElementById("maGiaiDau_chon").addEventListener("change", function () {
        // Ẩn bảng khi nhấn nút "Đóng"
        console.log(document.getElementById("maGiaiDau_chon").value);
        viewTbody_chon(document.getElementById("maGiaiDau_chon").value, document.getElementById("trangThai_chon").value);
        // console.log(trangThaiDuyet.value);

    });
    document.getElementById("trangThai_chon").addEventListener("change", function () {
        // Ẩn bảng khi nhấn nút "Đóng"
        console.log(document.getElementById("maGiaiDau_chon").value);
        viewTbody_chon(document.getElementById("maGiaiDau_chon").value, document.getElementById("trangThai_chon").value);
        // console.log(trangThaiDuyet.value);

    });

    document.getElementById("button_duyet_tat_ca").addEventListener("click", function (e) {
        e.preventDefault(); // Ngăn chặn hành động mặc định nếu cần
        document.getElementById("confirmModal").classList.remove("hidden");
    });
    /// lại lại
    document.getElementById("confirmYes").addEventListener("click", async function () {
        document.getElementById("confirmModal").classList.add("hidden");
        // Thêm hành động duyệt tất cả ở đây
        const ma_GiaiDau_chon = document.getElementById("maGiaiDau_chon").value;
        const trangThai_chon = document.getElementById("trangThai_chon").value;
        // const 
        const data_doiBongGiaiDau = await hamChung.layDanhSach("doi_bong_giai_dau");
        let data_cho_duyet = data_doiBongGiaiDau;

        if (ma_GiaiDau_chon !== "All") {
            data_cho_duyet = data_cho_duyet.filter(item => item.ma_giai_dau === ma_GiaiDau_chon);
        }

        if (trangThai_chon !== "All") {
            data_cho_duyet = data_cho_duyet.filter(item => item.trang_thai === trangThai_chon);
        }
        data_cho_duyet = data_cho_duyet.filter(item => item.trang_thai === "Chờ duyệt");
        for (let i = 0; i < data_cho_duyet.length; i++) {
            //  console.log(data[i]);
            const formData = {
                "ma_doi_bong": data_cho_duyet[i].ma_doi_bong,
                "ma_giai_dau": data_cho_duyet[i].ma_giai_dau,
                "trang_thai": "Đã duyệt"
            };
            hamChung.sua(formData, "doi_bong_giai_dau");
            const dataDangKyThamGiaGiai_cu = await hamChung.layThongTinTheo_2_ID("doi_bong_giai_dau", data_cho_duyet[i].ma_doi_bong, data_cho_duyet[i].ma_giai_dau);
            //     capNhat_doiBongGiaiDau_theo_trangThai_dangKyGiaiDau(dataDangKyThamGiaGiai_cu, formData);
            console.log(formData);
            // GỌI LẠI HÀM SAU KHI CẬP NHẬT DỮ LIỆU
            // await viewTbody_chon(ma_GiaiDau_chon, trangThai_chon);
        }
        await viewTbody_chon(ma_GiaiDau_chon, trangThai_chon);

        alert("Đã duyệt tất cả!");
    });
    //capNhat_doiBongGiaiDau_theo_trangThai_dangKyGiaiDau(dataDangKyThamGiaGiai, formData);

    document.getElementById("confirmNo").addEventListener("click", function () {
        document.getElementById("confirmModal").classList.add("hidden");
    });




    document.getElementById("btnChinhSua_cauThuThamGia").addEventListener("click", function () {
        console.log("Mở khóa checkbox");

        // Lấy tất cả các checkbox trong bảng (bạn có thể giới hạn phạm vi nếu cần)
        const checkboxes = document.querySelectorAll('input[type="checkbox"]');
        document.getElementById("btn_luuThongTinCauThuDa").classList.remove("hidden");
        // Tạo bản sao không thay đổi theo checkbox sau này
        danhSachCauThu_thamGia_cua1doi = Array.from(checkboxes)
            .filter(cb => cb.checked)
            .map(cb => cb.value);  // chỉ lưu value, hoặc lưu {value, checked} nếu cần

        for (const checkbox of checkboxes) {
            checkbox.disabled = false; // Mở khóa
        }

    });

    document.getElementById("btn_luuThongTinCauThuDa").addEventListener("click", async function () {

        let maGiaiDau_chon;
        let maDoiBong_chon;
        // Lấy tất cả các checkbox trong bảng (bạn có thể giới hạn phạm vi nếu cần)
        const checkboxes = document.querySelectorAll('input[type="checkbox"]');

        if (checkboxes.length > 0) {
            const firstCheckbox = checkboxes[0];
            maGiaiDau_chon = firstCheckbox.dataset.maGiaiDau;
            maDoiBong_chon = firstCheckbox.dataset.maDoiBong;
        }
        for (const checkbox of checkboxes) {
            checkbox.disabled = true; // khoas
        }
        for (const value of danhSachCauThu_thamGia_cua1doi) {
            console.log(`Checkbox đã từng được chọn: ${value}`);
            let form_data = {
                ma_cau_thu: value,
                ma_doi_bong: maDoiBong_chon,
                ma_giai_dau: maGiaiDau_chon
            }
            await hamChung.xoa(form_data, "cau_thu_giai_dau");
            console.log(form_data);
        }
        // thêm mới
        for (const checkbox of checkboxes) {
            if (checkbox.checked) {
                console.log(`Checkbox được chọn: ${checkbox.value}`);
                const data1CauThu_hienTai = await hamChung.layThongTinTheo_ID("cau_thu", checkbox.value);

                let form_data = {
                    ma_cau_thu: checkbox.value,
                    ma_doi_bong: maDoiBong_chon,
                    ma_giai_dau: maGiaiDau_chon,
                    ho_ten: data1CauThu_hienTai.ho_ten,
                    so_ao: data1CauThu_hienTai.so_ao,
                    hinh_anh: data1CauThu_hienTai.hinh_anh,
                    ma_vi_tri: data1CauThu_hienTai.ma_vi_tri
                }
                await hamChung.them(form_data, "cau_thu_giai_dau");
                console.log(form_data);
            }
        }
    });




}



async function viewTbody_chon(maGiaiDau, trangThai_chon) {

    const table = document.getElementById("dataTable_chon");
    let oldTbody = table.querySelector("tbody");
    if (oldTbody) table.removeChild(oldTbody); // Xóa hẳn tbody cũ

    const tableBody = document.createElement("tbody");
    table.appendChild(tableBody); // Gắn tbody mới sạch sẽ




    console.log(maGiaiDau);
    console.log(trangThai_chon);

    const data_dangKyThamGiaGiai = await hamChung.layDanhSach("doi_bong_giai_dau");
    let data = data_dangKyThamGiaGiai;

    if (maGiaiDau !== "All") {
        data = data.filter(item => item.ma_giai_dau === maGiaiDau);
    }

    if (trangThai_chon !== "All") {
        data = data.filter(item => item.trang_thai === trangThai_chon);
    }


    // const tableBody = document.getElementById("dataTable_chon");




    for (const item of data) {
        const row = document.createElement("tr");
        const data1giaiDau = await hamChung.layThongTinTheo_ID("giai_dau", item.ma_giai_dau);
        const data1doiBong = await hamChung.layThongTinTheo_ID("doi_bong", item.ma_doi_bong);

        row.innerHTML = `
            <td style="text-align: center;">${data1giaiDau.ten_giai_dau}</td>
            <td style="text-align: center;">${data1doiBong.ten_doi_bong}</td>
            <td style="text-align: center;">${item.thoi_gian_dang_ky}</td>
            <td style="text-align: center;">${item.ly_do_tu_choi || ""}</td>
            <td style="text-align: center;">
                <select class="status-select form-control form-control-sm">
                    <option value="Chờ duyệt" ${item.trang_thai === 'Chờ duyệt' ? 'selected' : ''} style="background-color: #f0ad4e; color: white;">Chờ duyệt</option>
                    <option value="Đã duyệt" ${item.trang_thai === 'Đã duyệt' ? 'selected' : ''} style="background-color: #5bc0de; color: white;">Đã duyệt</option>
                    <option value="Từ chối" ${item.trang_thai === 'Từ chối' ? 'selected' : ''} style="background-color: #d9534f; color: white;">Từ chối</option>
                </select>
            </td>
            <td style="text-align: center;"><button class="xem_doi btn btn-warning btn-sm">Xem Đội</button></td>
        `;
        tableBody.appendChild(row);

        // Lắng nghe sự kiện change của select
        const select = row.querySelector('.status-select');
        const options = select.querySelectorAll('option');

        const xemDoiBtn = row.querySelector('.xem_doi');
        // Hàm thay đổi màu nền của select khi thay đổi giá trị
        select.addEventListener('change', async (e) => {
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
                "trang_thai": newTrangThai
            };
            hamChung.sua(formData, "doi_bong_giai_dau");
            const dataDangKyThamGiaGiai_cu = await hamChung.layThongTinTheo_2_ID("doi_bong_giai_dau", item.ma_doi_bong, item.ma_giai_dau);
            //  capNhat_doiBongGiaiDau_theo_trangThai_dangKyGiaiDau(dataDangKyThamGiaGiai_cu, formData);
            console.log(formData);

        });

        // Đặt màu nền ban đầu của select khi trang thái đã chọn
        const selectedOption = Array.from(options).find(option => option.selected);
        if (selectedOption) {
            select.style.backgroundColor = selectedOption.style.backgroundColor;
        }
        xemDoiBtn.addEventListener('click', async () => {
            const maDoiBong = item.ma_doi_bong;
            const maGiaiDau = item.ma_giai_dau;

            console.log(`Xem đội: ${maDoiBong} trong giải đấu: ${maGiaiDau}`);


            await hienOverlayCauThu(maGiaiDau, maDoiBong); // Gọi hàm mở danh sách cầu thủ với mã đội bóng

            document.getElementById("btn_luuThongTinCauThuDa").classList.add("hidden");

        });
    }


}




// Mở overlay cầu thủ, ẩn overlay giải đấu
// Mở overlay cầu thủ, ẩn overlay giải đấu
async function hienOverlayCauThu(maGiaiDau, maDoiBong) {
    document.getElementById("popupOverlay").classList.add("hidden");
    document.getElementById("overlayCauThu").classList.remove("hidden");
    const layDoiBong = await hamChung.layThongTinTheo_ID("doi_bong", maDoiBong);
    const layGiaiDau = await hamChung.layThongTinTheo_ID("giai_dau", maGiaiDau);
    document.getElementById("value_thongTinCT").textContent = "Danh sách Cầu Thủ " + layDoiBong.ten_doi_bong +
        " - " + layGiaiDau.ten_giai_dau;

    // Gọi API lấy danh sách cầu thủ tham gia giải đấu
    const dataCauThu = await hamChung.layDanhSach("cau_thu");
    console.log(dataCauThu);
    console.log(maGiaiDau);
    console.log(maDoiBong);

    // Lọc danh sách theo mã đội bóng
    const dataLoc_doiBong = dataCauThu.filter(item => item.ma_doi_bong === maDoiBong);
    const dataSapXep = await sapXepLai(dataLoc_doiBong, maDoiBong, maGiaiDau);
    // danhSachCauThu_thamGia_cua1doi = dataSapXep;
    console.log(dataLoc_doiBong);

    const tbody = document.getElementById("playerListBody");
    tbody.innerHTML = "";


    // Duyệt qua từng cầu thủ để hiển thị và kiểm tra xem có tham gia giải đấu không
    for (const cauThu of dataSapXep) {
        // Kiểm tra xem cầu thủ đã tham gia giải đấu chưa
        const daThamGia = await check_cauThu_coThamGiaGiai(cauThu.ma_cau_thu, maDoiBong, maGiaiDau);

        const checked = daThamGia ? "checked" : ""; // Nếu tham gia thì checked

        const row = document.createElement("tr");
        const viTriCT = await hamChung.layThongTinTheo_ID("vi_tri_cau_thu", cauThu.ma_vi_tri);
        let hinh_anh;

        if (cauThu.hinh_anh === null) {
            hinh_anh = "/frontend/public/images/cat-2.png";
        } else {
            hinh_anh = await hamChung.getImage(cauThu.hinh_anh);
        }
        row.innerHTML = `
            <td>${cauThu.ho_ten}</td>
            <td>${cauThu.so_ao}</td>
            <td>${viTriCT.ten_vi_tri}</td>
            <td style="text-align: center;"><img src="${hinh_anh}" alt="Hình ảnh" width="50"></td>
            <td>
                    <input
                        type="checkbox"
                        value="${cauThu.ma_cau_thu}"
                        ${checked}
                        disabled
                        data-ma-giai-dau="${maGiaiDau}"
                        data-ma-doi-bong="${maDoiBong}"
                    >
            </td>

        `;
        tbody.appendChild(row);
    }
}


// Quay lại overlay danh sách giải đấu
document.getElementById("backToPopup").addEventListener("click", () => {
    document.getElementById("overlayCauThu").classList.add("hidden");
    document.getElementById("popupOverlay").classList.remove("hidden");

});

async function check_cauThu_coThamGiaGiai(maCauThu, maDoiBong, maGiaiDau) {
    const data = await hamChung.layDanhSach("cau_thu_giai_dau");

    const daTonTai = data.some(item =>
        item.ma_giai_dau === maGiaiDau &&
        item.ma_cau_thu === maCauThu &&
        item.ma_doi_bong === maDoiBong
    );

    return daTonTai;
}

async function sapXepLai(dataLoc_doiBong, maDoiBong, maGiaiDau) {
    // Lấy danh sách cầu thủ đã đăng ký tham gia giải đấu
    const dataCauThuGiaiDau = await hamChung.layDanhSach("cau_thu_giai_dau");
    const dataCauThuGiaiDau_doiBong = dataCauThuGiaiDau.filter(item => item.ma_doi_bong === maDoiBong);
    console.log(dataLoc_doiBong);
    // Lấy ra các mã cầu thủ thuộc đội bóng đó đã tham gia giải đấu cụ thể
    const maCauThuThamGia = dataCauThuGiaiDau_doiBong
        .filter(item => item.ma_giai_dau === maGiaiDau)
        .map(item => item.ma_cau_thu);

    // Sắp xếp: cầu thủ đã tham gia giải đấu lên trước
    const cauThuThamGia = dataLoc_doiBong.filter(cauThu =>
        maCauThuThamGia.includes(cauThu.ma_cau_thu)
    );

    const cauThuChuaThamGia = dataLoc_doiBong.filter(cauThu =>
        !maCauThuThamGia.includes(cauThu.ma_cau_thu)
    );

    // Trả về danh sách đã sắp xếp
    return [...cauThuThamGia, ...cauThuChuaThamGia];
}


// async function capNhat_doiBongGiaiDau_theo_trangThai_dangKyGiaiDau(dataDangKyThamGiaGiai_cu, dataDangKyThamGiaGiai_new) {
//     let trangThai_them_hay_xoa = "K";
//     const trangThaiMoi = dataDangKyThamGiaGiai_new.trang_thai;
//     if (dataDangKyThamGiaGiai_cu.trang_thai === trangThaiMoi) {
//         console.log("Trạng thai ko đổi");
//         return;
//     }
//     // kiểm tra đã có trong đổi bóng giải đấu chưa
//     const dataLoc_doiBongGiaiDau = await hamChung.layDanhSach("doi_bong_giai_dau");
//     // Thay `idDoiBong` và `idGiaiDau` bằng giá trị thực tế bạn đang kiểm tra
//     const check_trong_doiBongGiaiDau = dataLoc_doiBongGiaiDau.some(item =>
//         item.ma_doi_bong === dataDangKyThamGiaGiai_cu.ma_doi_bong && item.ma_giai_dau === dataDangKyThamGiaGiai_cu.ma_giai_dau
//     );
//     if (check_trong_doiBongGiaiDau) {
//         console.log("Đội bóng đã có trong giải đấu.");
//         // đã có và đã duyệt
//         if (trangThaiMoi === "Đã duyệt") {
//             // ko cần thêm vào
//             trangThai_them_hay_xoa = "Không"
//         }
//         else if (trangThaiMoi === "Chờ duyệt") {
//             // ko cần thêm vào
//             trangThai_them_hay_xoa = "Xóa"
//         }
//         else if (trangThaiMoi === "Từ chối") {
//             // ko cần thêm vào
//             trangThai_them_hay_xoa = "Xóa"
//         }

//     }
//     else {
//         console.log("Đội bóng chưa có trong giải đấu.");
//         // chưa có và đã duyệt
//         if (trangThaiMoi === "Đã duyệt") {
//             // ko cần thêm vào
//             trangThai_them_hay_xoa = "Thêm"
//         }
//         else if (trangThaiMoi === "Chờ duyệt") {
//             // ko cần thêm vào
//             trangThai_them_hay_xoa = "Không"
//         }
//         else if (trangThaiMoi === "Từ chối") {
//             // ko cần thêm vào
//             trangThai_them_hay_xoa = "Không"
//         }


//     }

//     const data1DoiBong = await hamChung.layThongTinTheo_ID("doi_bong", dataDangKyThamGiaGiai_cu.ma_doi_bong);

//     let formData = {
//         ma_doi_bong: data1DoiBong.ma_doi_bong,
//         ma_giai_dau: dataDangKyThamGiaGiai_cu.ma_giai_dau,

//         ten_doi_bong: data1DoiBong.ten_doi_bong,
//         logo: data1DoiBong.logo,
//         quoc_gia: data1DoiBong.quoc_gia,
//         // hat_giong: hatGiong.value,

//     };


//     if (trangThai_them_hay_xoa === "Thêm") {
//         await hamChung.them(formData, "doi_bong_giai_dau");

//     }
//     else if (trangThai_them_hay_xoa === "Xóa") {
//         await hamChung.xoa(formData, "doi_bong_giai_dau");

//     }
//     // else {
//     //     alert("Khoong ddoiri thành công!");
//     // }
// }