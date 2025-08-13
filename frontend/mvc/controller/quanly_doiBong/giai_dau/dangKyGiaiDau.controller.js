import hamChung from "../../../model/global/model.hamChung.js";
import hamChiTiet from "../../../model/global/model.hamChiTiet.js";
import thongBao from "/frontend/assets/components/thongBao.js";
import { GlobalStore, DoiTuyen } from "/frontend/global/global.js";


const ngayBatDau_chon_viewbody = document.getElementById("ngayBatDau_chon_viewbody");

document.addEventListener("DOMContentLoaded", function () {
    console.log("Đã vào trang qldt_dangKyGiaiDau");
    console.log(DoiTuyen.getDoiTuyen_dangChon());
    console.log(GlobalStore.getUsername());
    viewTbody();
    // Gán sự kiện cho nút
    // btnLuuThayDoi.addEventListener("click", handleLuuThayDoi);
    // btnTaiLaiTrang.addEventListener("click", handleTaiLaiTrang);

    document.getElementById("closeModal").onclick = () => {
        document.getElementById("modalDangKy").style.display = "none";
    };
    ngayBatDau_chon_viewbody.addEventListener("change", async function () {
        console.log(ngayBatDau_chon_viewbody.value);
        // maVongDau_chon_viewbody.value = "All";
        // let data = await hamChung.layDanhSach("giai_dau");

        viewTbody();
    });
    document.getElementById("huyDangKy").onclick = () => {
        document.getElementById("modalDangKy").style.display = "none";
    };

    // Đóng modal khi nhấn vào dấu "x" trong modal đăng ký
    document.getElementById('closeModal').addEventListener('click', function () {
        document.getElementById('modalDangKy').style.display = 'none';
    });
    // Đóng modal khi click vào nút đóng
    document.getElementById('closeModalBtn').addEventListener('click', () => {
        document.getElementById('modalDanhSachCauThu').style.display = 'none';
    });

    document.getElementById('dangKyGiai').addEventListener('click', handleXacNhanDangKyGiai);

    // Xử lý khi nhấn nút gửi yêu cầu
    document.getElementById('xacNhanDangKy').addEventListener('click', handleXacNhanDangKyCauThu);


});
async function handleXacNhanDangKyGiai() {
    const giaiDauDangChon = window.giaiDauDangChon;
    const data1DoiBong = await hamChung.layThongTinTheo_ID("doi_bong", DoiTuyen.getDoiTuyen_dangChon());

    // Kiểm tra xem đội bóng có đáp ứng đủ yêu cầu để đăng ký giải đấu hay không
    const isDoiBongDatYeuCau = await check_doiBong_coDatYeuCau_dangKyGiaiKhong(giaiDauDangChon.ma_giai_dau, data1DoiBong.ma_doi_bong);
    if (isDoiBongDatYeuCau !== true) {
        thongBao.thongBao_error(isDoiBongDatYeuCau, 3000, "error");
        return; // Nếu không đáp ứng yêu cầu thì không thực hiện đăng ký

    }
    const formData = {
        "ma_giai_dau": giaiDauDangChon.ma_giai_dau,
        "ma_doi_bong": data1DoiBong.ma_doi_bong,
        "ten_doi_bong": data1DoiBong.ten_doi_bong,
        "hinh_anh": data1DoiBong.hinh_anh || null // Nếu không có hình ảnh thì để null
    };
    console.log(formData);
    await hamChung.them(formData, "doi_bong_giai_dau");
    alert("Đăng Ký thành công!");
    document.getElementById("modalDangKy").style.display = "none";
    viewTbody(); // Cập nhật lại danh sách giải đấu sau khi đăng ký
}
// Hàm xử lý xác nhận đăng ký cầu thủ
async function handleXacNhanDangKyCauThu() {
    // Lấy danh sách các cầu thủ đã chọn
    const selectedPlayers = [];
    document.querySelectorAll('.player-checkbox:checked').forEach(checkbox => {
        selectedPlayers.push(checkbox.getAttribute('data-player-id'));
    });
    const cauHinh1GiaiDau = await hamChung.layThongTinTheo_ID("cau_hinh_giai_dau", window.giaiDauDangChon.ma_giai_dau);
    // Kiểm tra số lượng cầu thủ đã chọn
    console.log("Danh sách cầu thủ đã chọn:", selectedPlayers);
    console.log("Cấu hình giải đấu:", cauHinh1GiaiDau);
    if (cauHinh1GiaiDau.gioi_tinh_yeu_cau !== "Không phân biệt") {
        const gioiTinhYeuCau = cauHinh1GiaiDau.gioi_tinh_yeu_cau;
        // tìm xem trong danh sách cầu thủ đã chọn có cầu thủ nào không đúng giới tính yêu cầu không
        const data_cau_thu = await hamChung.layDanhSach("cau_thu");
        const data_cauThu_cua_DoiBong = data_cau_thu.filter(cauThu => cauThu.ma_doi_bong === DoiTuyen.getDoiTuyen_dangChon());
        const cauThuKhongDatYeuCau = data_cauThu_cua_DoiBong.filter(cauThu => {
            return cauThu.gioi_tinh !== gioiTinhYeuCau;
        });
        if (cauThuKhongDatYeuCau.length > 0) {
            thongBao.thongBao_error("Có cầu thủ không đáp ứng yêu cầu giới tính của giải đấu. Vui lòng kiểm tra lại.", 3000, "error");
            return;
        }
    }
    if (selectedPlayers.length < cauHinh1GiaiDau.so_luong_cau_thu_toi_thieu_moi_doi) {
        thongBao.thongBao_error(`Số lượng cầu thủ đã chọn (${selectedPlayers.length}) không đủ yêu cầu tối thiểu (${cauHinh1GiaiDau.so_luong_cau_thu_toi_thieu_moi_doi}) của giải đấu. Vui lòng chọn thêm cầu thủ.`, 3000, "error");
        return;
    }
    if (selectedPlayers.length > cauHinh1GiaiDau.so_luong_cau_thu_toi_da_moi_doi) {
        thongBao.thongBao_error(`Số lượng cầu thủ đã chọn (${selectedPlayers.length}) vượt quá giới hạn tối đa (${cauHinh1GiaiDau.so_luong_cau_thu_toi_da_moi_doi}) của giải đấu. Vui lòng chọn ít hơn.`, 3000, "error");
        return;
    }
    // cần thêm đội bóng vào giải đấu

    await them_cauThu_vao_giaiDau(selectedPlayers);

}
async function them_cauThu_vao_giaiDau(selectedPlayers) {

    console.log('Danh sách cầu thủ đã chọn:', selectedPlayers);
    // Bạn có thể thực hiện các hành động khác với danh sách cầu thủ đã chọn ở đây
    for (let i = 0; i < selectedPlayers.length; i++) {
        let ma_cauThu = selectedPlayers[i];
        const data_cauThu = await hamChung.layThongTinTheo_ID("cau_thu", ma_cauThu);
        //    console.log("Giải đấu đang đăng ký: ", window.giaiDauDangChon);
        const giaiDauDangChon = window.giaiDauDangChon;

        const formData = {
            "ma_cau_thu": data_cauThu.ma_cau_thu,
            "ma_giai_dau": giaiDauDangChon.ma_giai_dau,
            "ma_doi_bong": data_cauThu.ma_doi_bong,
            "ho_ten": data_cauThu.ho_ten,
            "so_ao": data_cauThu.so_ao,
            "hinh_anh": data_cauThu.hinh_anh,
            "ma_vi_tri": data_cauThu.ma_vi_tri
        }
        // Kiểm tra nếu hình ảnh null hoặc undefined thì xóa khỏi formData
        if (formData.hinh_anh == null) {
            delete formData.hinh_anh;
        }
        await hamChung.them(formData, "cau_thu_giai_dau");
        console.log(formData);
    }

    alert('Đã lưu cầu thủ tham gia!');
    document.getElementById('modalDanhSachCauThu').style.display = 'none';
    viewTbody(); // Cập nhật lại danh sách giải đấu sau khi lưu cầu thủ

}



async function viewTbody() {
    let data = await hamChung.layDanhSach("giai_dau"); // Lấy danh sách giải đấu
    const tableBody = document.getElementById("dataTable");

    const doiTuyenDangChon = DoiTuyen.getDoiTuyen_dangChon();
    console.log("Đội tuyển đang chọn:", doiTuyenDangChon);


    tableBody.innerHTML = "";

    // Lọc dữ liệu theo ngày bắt đầu nếu có chọn
    // ok
    if (ngayBatDau_chon_viewbody.value !== "") {
        console.log("Lọc dữ liệu theo ngày bắt đầu:", ngayBatDau_chon_viewbody.value);
        // ngày item.ngay_ket_thuc_dang_ky_giai có dạng là 2025-06-28T17:00 // nên cần tách chuỗi
        data = data.filter(item => {
            const ngayKetThucDangKy = item.ngay_ket_thuc_dang_ky_giai.split("T")[0]; // Lấy phần ngày trước chữ T
            return ngayKetThucDangKy >= ngayBatDau_chon_viewbody.value;
        });
        console.log("Dữ liệu sau khi lọc:", data);
    }
    // chưa ok
    // Ngày hôm nay & ngày hết hạn đăng ký
    const today = format_Date_go_DateTime(new Date());

    console.log("Ngày hôm nay:", today);
    for (const item of data) {
        const row = document.createElement("tr");
        const ngayBatDauDangKy = formatStringToDateTime(item.ngay_bat_dau_dang_ky_giai);
        const ngayKetThucDangKy = formatStringToDateTime(item.ngay_ket_thuc_dang_ky_giai);
        const thongTinDangKy = await layTrangThaiDangKy(item.ma_giai_dau, doiTuyenDangChon);

        //F  const demSoLuong_cauThu_theoDoiBong = await hamChiTiet.demSoLuong_cauThu_theoDoiBong(ma_doi_bong);
        const demSoLuong_doiBong_theoGiaiDau = await hamChiTiet.demSoLuong_doiBong_theoGiaiDau(item.ma_giai_dau);

        const data_cauHinh1GiaiDau = await hamChung.layThongTinTheo_ID("cau_hinh_giai_dau", item.ma_giai_dau);
        if (!data_cauHinh1GiaiDau) {
            console.error("Không tìm thấy cấu hình giải đấu cho mã giải đấu:", item.ma_giai_dau);
            continue; // Bỏ qua nếu không tìm thấy cấu hình
        }

        const daNhapCauThu = await check_doiBong_daNhap_cauThu_giaiDau_chua(item.ma_giai_dau, doiTuyenDangChon);
        // Trả về true nếu đã có cầu thủ được nhập
        // => ví dụ {trang_thai: 'pending' | 'approved' | 'rejected' | 'completed' | null}
        let buttonText = "";
        let buttonColor = "";
        let buttonDisabled = false;
        // nếu chưa đến ngày đăng ký giải 
        if (today < ngayBatDauDangKy) {
            buttonText = "Chưa đến ngày đăng ký";
            buttonColor = "#6c757d"; // xám
            buttonDisabled = true;
        }
        else if (today > ngayKetThucDangKy && (!thongTinDangKy || thongTinDangKy.trang_thai === null)) {
            buttonText = "Đã hết hạn đăng ký";
            buttonColor = "#dc3545"; // đỏ
            buttonDisabled = true;
        } else if (!thongTinDangKy || thongTinDangKy.trang_thai === null) {
            if (demSoLuong_doiBong_theoGiaiDau >= data_cauHinh1GiaiDau.so_luong_doi_bong_toi_da_dang_ky) {
                buttonText = "Đã đủ đội bóng";
                buttonColor = "#6c757d"; // xám
                buttonDisabled = true;
            }
            else {
                buttonText = "Đăng ký";
                buttonColor = "#007bff"; // xanh dương
                buttonDisabled = false;
            }
        } else {
            switch (thongTinDangKy.trang_thai) {
                case "Chờ duyệt":
                    buttonText = "Chờ phê duyệt";
                    buttonColor = "#ffc107";
                    buttonDisabled = true;
                    break;
                case "Đã duyệt":
                    console.log(daNhapCauThu);
                    if (daNhapCauThu) {
                        buttonText = "Đã nhập cầu thủ";
                        buttonColor = "#17a2b8"; // xanh cyan
                        buttonDisabled = true;
                    } else {
                        buttonText = "Nhập cầu thủ";
                        buttonColor = "#28a745";
                        buttonDisabled = false;
                    }
                    break;
                case "Từ chối":
                    buttonText = "Bị từ chối";
                    buttonColor = "#dc3545";
                    buttonDisabled = true;
                    break;
                case "Đã hoàn tất":
                    buttonText = "Hoàn tất";
                    buttonColor = "#6c757d";
                    buttonDisabled = true;
                    break;
                default:
                    buttonText = "Không xác định";
                    buttonColor = "#6c757d";
                    buttonDisabled = true;
                    break;
            }

        }


        row.innerHTML = `
            <td style="text-align: center;">${item.ten_giai_dau}</td>
            <td style="text-align: center;">${item.ngay_bat_dau}</td>
            <td style="text-align: center;">${item.ngay_ket_thuc}</td>
            <td style="text-align: center;"><button class="xemMoTa-btn btn btn-warning btn-sm">Xem</button></td>
            <td style="text-align: center;">
                <button class="sign_up-btn btn btn-warning btn-sm" 
                        style="background-color: ${buttonColor};" 
                        ${buttonDisabled ? "disabled" : ""}
                        data-magiaidau="${item.ma_giai_dau}">
                    ${buttonText}
                </button>
            </td>
        `;

        tableBody.appendChild(row);
        row.querySelector(".xemMoTa-btn").addEventListener("click", () => {
            // Hiển thị thông tin mô tả giải đấu
            const modalContent = document.getElementById("thongTinGiaiDau");
            modalContent.innerHTML = `
                <p><strong>Tên Giải Đấu:</strong> ${item.ten_giai_dau}</p>
                <p><strong>Tổ Chức:</strong> ${item.ten_to_chuc}</p>
                <p><strong>Ngày Bắt Đầu:</strong> ${item.ngay_bat_dau}</p>
                <p><strong>Ngày Kết Thúc:</strong> ${item.ngay_ket_thuc}</p>
                <p><strong>Mô Tả:</strong> ${item.mo_ta || "Không có mô tả"}</p>
            `;
            /// ẩn nút đăng ký giải dangKyGiai
            document.getElementById("dangKyGiai").style.display = "none"; // ẩn nút đăng ký giải
            document.getElementById("modalDangKy").style.display = "flex"; // Hiển thị modal
        });
    }

    button_dangKy(data); // Gắn sự kiện cho nút
}
async function layTrangThaiDangKy(ma_giai_dau, ma_doi_bong) {
    const danhSach = await hamChung.layDanhSach("doi_bong_giai_dau");
    return danhSach.find(row =>
        row.ma_giai_dau === ma_giai_dau && row.ma_doi_bong === ma_doi_bong
    ) || null;
}
async function check_doiBong_coDatYeuCau_dangKyGiaiKhong(ma_giai_dau, ma_doi_bong) {
    // Kiểm tra xem đội bóng có đáp ứng đủ yêu cầu để đăng ký giải đấu hay không
    const dataCauHinhGiaiDau = await hamChung.layThongTinTheo_ID("cau_hinh_giai_dau", ma_giai_dau);
    const dataDoiBong = await hamChung.layThongTinTheo_ID("doi_bong", ma_doi_bong);
    const soLuongCauThu = await hamChiTiet.demSoLuong_cauThu_theoDoiBong(ma_doi_bong);
    if (soLuongCauThu < dataCauHinhGiaiDau.so_luong_cau_thu_toi_thieu_moi_doi) {
        console.log();
        return "Đội bóng không đủ số lượng cầu thủ tối thiểu để đăng ký giải đấu."; // Không đủ số lượng cầu thủ tối thiểu
    }
    return true; // Đội bóng đáp ứng đủ yêu cầu để đăng ký giải đấu
}


function button_dangKy(data) {
    document.querySelectorAll(".sign_up-btn").forEach((btn, index) => {
        console.log("data:", data);

        btn.addEventListener("click", async () => {

            // kiểm tra nếu none thì cho hiện lại "dangKyGiai").style.display = "none";
            if (document.getElementById("dangKyGiai").style.display === "none") {
                document.getElementById("dangKyGiai").style.display = "block"; // hiện lại nút đăng ký giải
            }
            // const item = data[index];
            // alert(item.ma_giai_dau);
            // Lấy mã giải đấu từ thuộc tính data
            const maGiaiDau = btn.getAttribute("data-magiaidau");
            // Tìm đúng item trong data
            const item = data.find(gd => gd.ma_giai_dau == maGiaiDau);
            // alert(item.ma_giai_dau); // Giờ sẽ luôn đúng
            const dataCauHinhGiaiDau = await hamChung.layThongTinTheo_ID("cau_hinh_giai_dau", item.ma_giai_dau);
            // 🔥 In ra loại button
            const buttonType = btn.innerText.trim();
            console.log("Loại button được click:", buttonType);
            // Lưu tạm dữ liệu giải đấu nếu cần xử lý xác nhận
            window.giaiDauDangChon = item;
            if (buttonType === "Đăng ký") {
                // Hiển thị thông tin vào modal
                document.getElementById("thongTinGiaiDau").innerHTML = `
               
                <p><strong>Tên Giải Đấu:</strong> ${item.ten_giai_dau}</p>
                <p><strong>Tên Tổ Chức:</strong> ${item.ten_to_chuc}</p>
                <p><strong>Ngày Bắt Đầu:</strong> ${item.ngay_bat_dau}</p>
                <p><strong>Ngày Kết Thúc:</strong> ${item.ngay_ket_thuc}</p>
                <p><strong>Ngày Kết Thúc Đăng Ký:</strong> ${item.ngay_ket_thuc_dang_ky_giai}</p>
                <p><strong>Mô Tả:</strong> ${item.mo_ta || ""}</p>

                <p><strong>Giới Tính Yêu Cầu:</strong> ${dataCauHinhGiaiDau.gioi_tinh_yeu_cau}</p>
                <p><strong>Số Lượng Cầu Thủ Tối Đa:</strong> ${dataCauHinhGiaiDau.so_luong_cau_thu_toi_da_moi_doi}</p>
                <p><strong>Số Lượng Cầu Thủ Tối Thiểu:</strong> ${dataCauHinhGiaiDau.so_luong_cau_thu_toi_thieu_moi_doi}</p>
                <p><strong>Ghi Chú:</strong> ${dataCauHinhGiaiDau.ghi_chu || ""}</p>
                <p><strong>Số Lượng Đội Bóng Tối Đa:</strong> ${dataCauHinhGiaiDau.so_luong_doi_bong_toi_da_dang_ky}</p>
            `;



                // Hiển thị modal
                document.getElementById("modalDangKy").style.display = "flex";
            }
            else if (buttonType === "Nhập cầu thủ") {
                openPlayerList();
            }
        });
    });

}

async function check_doiBong_daDangKy_Giai_chua(maGiaiDau, maDoiBong) {
    const data_dangKyThamGiaGiai = await hamChung.layDanhSach("dang_ky_tham_gia_giai");

    // Kiểm tra xem maDoiBong có tồn tại trong danh sách đăng ký với maGiaiDau hay không
    const isDoiBongDaDangKy = data_dangKyThamGiaGiai.some(item => item.ma_giai_dau === maGiaiDau && item.ma_doi_bong === maDoiBong);

    // đã đăng ký
    if (isDoiBongDaDangKy)
        return true;
    return false;

}
async function check_doiBong_daNhap_cauThu_giaiDau_chua(maGiaiDau, maDoiBong) {
    const data_dangKyThamGiaGiai = await hamChung.layDanhSach("cau_thu_giai_dau");
    console.log(maGiaiDau + " " + maDoiBong);
    console.log(data_dangKyThamGiaGiai)
    // Kiểm tra xem đội bóng đã đăng ký giải đấu chưa
    const isDoiBong_nhap_cauThu = data_dangKyThamGiaGiai.some(item =>
        item.ma_giai_dau === maGiaiDau && item.ma_doi_bong === maDoiBong
    );
    console.log(isDoiBong_nhap_cauThu);

    // đã đăng ký
    if (isDoiBong_nhap_cauThu)
        return true;
    return false;
}



// Mở Modal danh sách cầu thủ
async function openPlayerList() {
    // Thực hiện logic để mở modal danh sách cầu thủ
    document.getElementById('modalDanhSachCauThu').style.display = 'flex';  // Sử dụng 'flex' để căn giữa
    const data_cau_thu = await hamChung.layDanhSach("cau_thu");
    const data_cauThu_cua_DoiBong = data_cau_thu.filter(cauThu => cauThu.ma_doi_bong === DoiTuyen.getDoiTuyen_dangChon());
    // Dữ liệu mẫu về cầu thủ (có thể lấy từ API hoặc database)

    console.log(data_cauThu_cua_DoiBong);
    // Chèn danh sách cầu thủ vào bảng
    const playerListBody = document.getElementById('playerListBody');
    playerListBody.innerHTML = ''; // Xóa các dữ liệu cũ (nếu có)
    for (let i = 0; i < data_cauThu_cua_DoiBong.length; i++) {
        const player = data_cauThu_cua_DoiBong[i];

        let hinh_anh;
        // C:\Users\vanti\Desktop\quan_ly_tran_dau\frontend\public\images\cat-2.png

        if (player.hinh_anh === null) {
            hinh_anh = "/frontend/public/images/cat-2.png";
        } else {
            hinh_anh = await hamChung.getImage(player.hinh_anh);
        }
        const data1viTri = await hamChung.layThongTinTheo_ID("vi_tri_cau_thu", player.ma_vi_tri);
        const row = document.createElement('tr');
        row.innerHTML = `
            <td style="text-align: center;">${player.ho_ten}</td>
            <td style="text-align: center;">${player.so_ao}</td>
            <td style="text-align: center;">${data1viTri.ten_vi_tri}</td>
            <td style="text-align: center;">${player.gioi_tinh}</td>
            <td style="text-align: center;"><img src="${hinh_anh}" alt="Logo" width="50"></td>
            <td style="text-align: center;">
                <input type="checkbox" class="player-checkbox" data-player-id="${player.ma_cau_thu}">
            </td>
        `;

        playerListBody.appendChild(row);
    }

}


// chuyển từ Date sang định dạng yyyy-mm-dd hh:mm:ss
function format_Date_go_DateTime(date) {
    const pad = n => n < 10 ? '0' + n : n;
    return date.getFullYear() + '-' +
        pad(date.getMonth() + 1) + '-' +
        pad(date.getDate()) + ' ' +
        pad(date.getHours()) + ':' +
        pad(date.getMinutes()) + ':' +
        pad(date.getSeconds());
}

// chuyển từ 2025-07-09T15:53 sang 2025-07-09 15:53:00
function formatStringToDateTime(dateString) {
    const date = new Date(dateString);
    return format_Date_go_DateTime(date);
}
