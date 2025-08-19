//  <div id="background-image" class="hero overlay" style="background-image: url('/frontend/assets/home/images/bg_3.jpg');"></div>
import hamChung from "/frontend/mvc/model/global/model.hamChung.js";
import hamChiTiet from "/frontend/mvc/model/global/model.hamChiTiet.js";

const giai_dau = document.getElementById("giai_dau");
const team1 = document.getElementById("team-1");
const team2 = document.getElementById("team-2");
const score = document.getElementById("score");
const team1_next = document.getElementById("team-1-next");
const team2_next = document.getElementById("team-2-next");
const nextMatchInfo = document.getElementById("next-match-info");

const backgroundImage = document.getElementById("background-image");

const maVongDau_xemHang = document.getElementById("maVongDau_xemHang");
const btn_xem_giai_dau = document.getElementById("btn_xem_giai_dau");

document.addEventListener("DOMContentLoaded", async function () {
    console.log("Trang chủ đã được tải");

    const dataCauHinhGiaiDau = await hamChung.layDanhSach_notToken("cau_hinh_giao_dien");
    console.log("Cấu hình giải đấu:", dataCauHinhGiaiDau);
    const dataCauHinhGiaiDau_chon = dataCauHinhGiaiDau.find(item => item.is_dang_su_dung === 1);
    if (!dataCauHinhGiaiDau_chon) {
        console.error("Không tìm thấy cấu hình giải đấu đang sử dụng.");
        return;
    }

    console.log("Cấu hình giải đấu đang sử dụng:", dataCauHinhGiaiDau_chon);

    const data1TranDau = await hamChung.layThongTinTheo_ID_notToken("tran_dau", dataCauHinhGiaiDau_chon.ma_tran_dau);
    const data1TranDauTiepTheo = await tranDau_tiepTheo(data1TranDau.ma_giai_dau);

    await view_1TranDau(data1TranDau, dataCauHinhGiaiDau_chon);
    console.log("Thông tin trận đấu:", data1TranDauTiepTheo);
    await view_tranDauTiepTheo(data1TranDauTiepTheo);
    await view_bangXepHang(data1TranDau.ma_giai_dau, maVongDau_xemHang.value);
    maVongDau_xemHang.addEventListener("change", async function () {
        await view_bangXepHang(data1TranDau.ma_giai_dau, maVongDau_xemHang.value);
    });
    btn_xem_giai_dau.addEventListener("click", async function (e) {
        e.preventDefault();
        window.location.href = `/frontend/mvc/view/view_html/nguoihammo/cac_tran_dau.html?maGiaiDau=${data1TranDau.ma_giai_dau}`;
        return false;
    });


});

async function view_1TranDau(data1TranDau, dataCauHinhGiaiDau_chon) {
    const dataGiaiDau = await hamChung.layThongTinTheo_ID_notToken("giai_dau", data1TranDau.ma_giai_dau);

    const dataDoi_bong_1 = await hamChung.layThongTinTheo_ID_notToken("doi_bong", data1TranDau.ma_doi_1);
    const dataDoi_bong_2 = await hamChung.layThongTinTheo_ID_notToken("doi_bong", data1TranDau.ma_doi_2);

    const dataCauThu_giaiDau = await hamChung.layDanhSach_notToken("cau_thu_giai_dau");

    const dataCauThu_doi1_trongGiai = dataCauThu_giaiDau.filter(item => item.ma_doi_bong === data1TranDau.ma_doi_1 && item.ma_giai_dau === data1TranDau.ma_giai_dau);
    const dataCauThu_doi2_trongGiai = dataCauThu_giaiDau.filter(item => item.ma_doi_bong === data1TranDau.ma_doi_2 && item.ma_giai_dau === data1TranDau.ma_giai_dau);

    // console.log("Thông tin trận đấu:", data1TranDau);
    console.log("Thông tin giải đấu:", dataGiaiDau);
    siteCountDown(new Date(dataGiaiDau.ngay_ket_thuc), '#date-countdown');

    giai_dau.querySelector("h1").innerHTML = `${dataGiaiDau.ten_giai_dau}`;
    giai_dau.querySelector("p").innerHTML = `${dataGiaiDau.mo_ta}`;


    let soBan_doi1_doi2 = "---";
    if (data1TranDau.so_ban_doi_1 !== null && data1TranDau.so_ban_doi_2 !== null) {
        soBan_doi1_doi2 = `${data1TranDau.so_ban_doi_1} - ${data1TranDau.so_ban_doi_2}`;
    }




    backgroundImage.style.backgroundImage = `url('${await hamChung.getImage(dataCauHinhGiaiDau_chon.background)}')`;

    score.innerHTML = `${soBan_doi1_doi2}`;
    team1.querySelector("img").src = await hamChung.getImage(dataDoi_bong_1.hinh_anh);
    team1.querySelector("h3").innerHTML = `${dataDoi_bong_1.ten_doi_bong}`;

    // team1.querySelector("h3").style.color = dataCauHinhGiaiDau_chon.color_team_1;

    team2.querySelector("img").src = await hamChung.getImage(dataDoi_bong_2.hinh_anh);
    team2.querySelector("h3").innerHTML = `${dataDoi_bong_2.ten_doi_bong}`;
    //team2.querySelector("h3").style.color = dataCauHinhGiaiDau_chon.color_team_2;


    // team1.querySelector("ul").innerHTML = dataCauHinhGiaiDau_chon.list_player_team_1.map(player => `<li>${player}</li>`).join("");
    // team2.querySelector("ul").innerHTML = dataCauHinhGiaiDau_chon.list_player_team_2.map(player => `<li>${player}</li>`).join("");
    await renderPlayerList("team-1-players", dataCauThu_doi1_trongGiai);
    await renderPlayerList("team-2-players", dataCauThu_doi2_trongGiai);

}


async function view_tranDauTiepTheo(data1TranDauTiepTheo) {
    if (data1TranDauTiepTheo) {
        console.log("Trận đấu tiếp theo:", data1TranDauTiepTheo);
        const data1GiaiDauTiepTheo = await hamChung.layThongTinTheo_ID_notToken("giai_dau", data1TranDauTiepTheo.ma_giai_dau);
        const data1SanVanDongTiepTheo = await hamChung.layThongTinTheo_ID_notToken("san_van_dong", data1TranDauTiepTheo.ma_san);
        const dataDoi_bong_1_next = await hamChung.layThongTinTheo_ID_notToken("doi_bong", data1TranDauTiepTheo.ma_doi_1);
        const dataDoi_bong_2_next = await hamChung.layThongTinTheo_ID_notToken("doi_bong", data1TranDauTiepTheo.ma_doi_2);


        team1_next.querySelector("img").src = await hamChung.getImage(dataDoi_bong_1_next.hinh_anh);
        team1_next.querySelector("h3").innerHTML = `${dataDoi_bong_1_next.ten_doi_bong}`;

        team2_next.querySelector("img").src = await hamChung.getImage(dataDoi_bong_2_next.hinh_anh);
        team2_next.querySelector("h3").innerHTML = `${dataDoi_bong_2_next.ten_doi_bong}`;

        nextMatchInfo.querySelector("h4").innerHTML = `${data1GiaiDauTiepTheo.ten_giai_dau}`;
        // tôi có data1GiaiDauTiepTheo.ngay_ket_thuc 2025-07-09T15:53 muổn đổi về kiểu dd-mm-yyyy giờ-phút
        const ngayBatDau = new Date(data1GiaiDauTiepTheo.ngay_bat_dau);
        const ngayKetThuc = new Date(data1GiaiDauTiepTheo.ngay_ket_thuc);
        const options = { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' };
        const ngayBatDauFormatted = ngayBatDau.toLocaleDateString('vi-VN', options);
        const ngayKetThucFormatted = ngayKetThuc.toLocaleDateString('vi-VN', options);
        console.log("Ngày bắt đầu:", ngayBatDauFormatted);
        console.log("Ngày kết thúc:", ngayKetThucFormatted);
        console.log("Ngày bắt đầu:", ngayBatDau);

        nextMatchInfo.querySelector("p").innerHTML = `
                <span class="d-block">${ngayBatDauFormatted}</span>
                <span class="d-block">${ngayKetThucFormatted}</span>
                <strong class="text-primary">${data1SanVanDongTiepTheo.ten_san}</strong>
            `;
        siteCountDown(new Date(data1TranDauTiepTheo.thoi_gian_dien_ra), '#date-countdown2');
    }

}
async function view_bangXepHang(maGiaiDau, input_maVongDau) {
    await loadDanhSach_maVongDau_xemHang(maGiaiDau);
    let maVongDau = input_maVongDau;
    if (!maVongDau) {
        const dataVongDau = await hamChung.layDanhSach_notToken("vong_dau");
        const dataVongDau_1GiaiDau = dataVongDau.filter(item => item.ma_giai_dau === maGiaiDau);
        if (dataVongDau_1GiaiDau.length > 0) {
            maVongDau = dataVongDau_1GiaiDau[0].ma_vong_dau; // Lấy vòng đấu đầu tiên nếu không có vòng đấu được chọn
        } else {
            console.error("Không có vòng đấu nào trong giải đấu này.");
            return;
        }
    }

    const tbody = document.querySelector("#table_bangXepHang tbody");
    tbody.innerHTML = "";
    document.getElementById("maVongDau_xemHang").value = maVongDau;
    const dataDoiBongGiaiDau = await hamChung.layDanhSach_notToken("doi_bong_giai_dau");
    const dataDoiBongGiaiDau_1GiaiDau = dataDoiBongGiaiDau.filter(item => item.ma_giai_dau === maGiaiDau);

    //  console.log("Danh sách đội bóng giải đấu:", dataDoiBongGiaiDau_1GiaiDau);
    // const demThongSoDoiBong_theoGiai_vongDau = await demThongSoDoiBong_theoGiai_vongDau(maDoiBong, maGiaiDau, maVongDau);
    // const lay1QuyTacTinhDiem = await hamChung.layThongTinTheo_2_ID_notToken("quy_tac_tinh_diem", maGiaiDau, maVongDau);
    const lay1QuyTacTinhDiem = await hamChung.layThongTinTheo_2_ID_notToken("quy_tac_tinh_diem", maGiaiDau, "vd_0001");
    //  console.log("Quy tắc tính điểm:", lay1QuyTacTinhDiem);
    const danhSachThongSoDoiBong = [];
    for (const doiBong of dataDoiBongGiaiDau_1GiaiDau) {
        const thongSoDoiBong = await demThongSoDoiBong_theoGiai_vongDau(doiBong.ma_doi_bong, doiBong.ma_giai_dau, maVongDau);
        const tongDiem = await tinhDiem(thongSoDoiBong, lay1QuyTacTinhDiem);
        // console.log("Thông số đội bóng:", thongSoDoiBong);
        // console.log(tongDiem);
        danhSachThongSoDoiBong.push({
            ma_doi_bong: doiBong.ma_doi_bong,
            thong_so: thongSoDoiBong,
            tong_diem: tongDiem
        });
    }

    for (const doiBong of danhSachThongSoDoiBong) {
        const index = danhSachThongSoDoiBong.indexOf(doiBong);
        const data1DoiBong = await hamChung.layThongTinTheo_ID_notToken("doi_bong", doiBong.ma_doi_bong);
        const row = document.createElement("tr");
        // cho nó ở giữa
        row.innerHTML = `
            <td style="text-align: center;">${index + 1}</td>
            <td style="text-align: center;><strong class="text-white">${data1DoiBong.ten_doi_bong}</strong></td>
            <td style="text-align: center;">${doiBong.thong_so.so_tran_thang}</td>
            <td style="text-align: center;">${doiBong.thong_so.so_tran_hoa}</td>
            <td style="text-align: center;">${doiBong.thong_so.so_tran_thua}</td>
            <td style="text-align: center;">${doiBong.thong_so.so_the_vang}</td>
            <td style="text-align: center;">${doiBong.thong_so.so_the_do}</td>
            <td style="text-align: center;">${doiBong.tong_diem}</td>
        `;
        tbody.appendChild(row);
    }
}
var siteCountDown = function (date, element) {
    console.log("Đếm ngược đến ngày:", date);
    $(element).countdown(date, function (event) {
        var $this = $(this).html(event.strftime(''
            + '<span class="countdown-block"><span class="label">%w</span> weeks </span>'
            + '<span class="countdown-block"><span class="label">%d</span> days </span>'
            + '<span class="countdown-block"><span class="label">%H</span> hr </span>'
            + '<span class="countdown-block"><span class="label">%M</span> min </span>'
            + '<span class="countdown-block"><span class="label">%S</span> sec</span>'));
    });

};
async function renderPlayerList(containerId, players) {
    const container = document.getElementById(containerId);
    container.innerHTML = ""; // Xóa danh sách cũ

    for (const player of players) {
        const li = document.createElement("li");
        const data1Vitri = await hamChung.layThongTinTheo_ID_notToken("vi_tri_cau_thu", player.ma_vi_tri);
        // li.textContent = `${player.ho_ten} (${data1Vitri.ten_vi_tri})`; // Hiển thị tên cầu thủ và vị trí
        li.textContent = `${player.ho_ten} `; // Hiển thị tên cầu thủ và vị trí
        container.appendChild(li);
    }
}
async function tranDau_tiepTheo(maGiaiDau) {
    const dataTranDau = await hamChung.layDanhSach_notToken("tran_dau");
    const currentTime = new Date(); // thời điểm hiện tại thực sự

    console.log("Thời gian hiện tại:", currentTime.toISOString());

    // Lọc các trận đấu thuộc giải đấu đang xét
    const dataTranDau_theoGiaiDau = dataTranDau.filter(item => item.ma_giai_dau === maGiaiDau);
    console.log("Các trận đấu theo giải đấu:", dataTranDau_theoGiaiDau);

    // Lọc ra những trận đấu có thời gian sau hiện tại 
    const tranDauSauHienTai = dataTranDau_theoGiaiDau.filter(item => {
        const thoiGianTranDau = new Date(item.thoi_gian_dien_ra);
        console.log("Thời gian trận đấu:", thoiGianTranDau.toISOString());
        return thoiGianTranDau > currentTime;
    });

    console.log("Các trận đấu sau thời điểm hiện tại:", tranDauSauHienTai);

    // Sắp xếp theo thời gian tăng dần
    tranDauSauHienTai.sort((a, b) => new Date(a.thoi_gian_dien_ra) - new Date(b.thoi_gian_dien_ra));

    // Trận đấu tiếp theo là trận đầu tiên trong danh sách đã sắp xếp
    const tranTiepTheo = tranDauSauHienTai[0];

    return tranTiepTheo || null; // nếu không có thì trả về null
}


async function demThongSoDoiBong_theoGiai_vongDau(maDoiBong, maGiaiDau, maVongDau) {
    const danhSachTranDau_theoGiai_vongDau = await hamChiTiet.danhSachTranDau_theoGiai_vongDau_notToken(maGiaiDau, maVongDau);

    const danhSachTranDau_doiBong_da_trong_vongDau = danhSachTranDau_theoGiai_vongDau.filter((tran) => tran.ma_doi_1 === maDoiBong || tran.ma_doi_2 === maDoiBong);
    // console.log("doi bóng", maDoiBong);
    // console.log("danhSachTranDau_theoGiai_vongDau", danhSachTranDau_theoGiai_vongDau);
    // console.log("danhSachTranDau_doiBong_da_trong_vongDau", danhSachTranDau_doiBong_da_trong_vongDau);
    const thongSoDoiBong = {
        so_tran_thang: 0,
        so_tran_hoa: 0,
        so_tran_thua: 0,

        so_ban_thang: 0,
        so_the_do: 0,
        so_the_vang: 0,
    };


    for (let i = 0; i < danhSachTranDau_doiBong_da_trong_vongDau.length; i++) {
        const tranDau = danhSachTranDau_doiBong_da_trong_vongDau[i];
        if (tranDau.ma_doi_thang === maDoiBong) {
            thongSoDoiBong.so_tran_thang++;
            continue;
        }
        if (tranDau.ma_doi_thang === null) {
            thongSoDoiBong.so_tran_hoa++;
            continue;
        }
        if (tranDau.ma_doi_thang !== maDoiBong) {
            thongSoDoiBong.so_tran_thua++;
            continue;
        }

    }

    for (let i = 0; i < danhSachTranDau_doiBong_da_trong_vongDau.length; i++) {
        const tranDau = danhSachTranDau_doiBong_da_trong_vongDau[i];
        console.log("tranDau", tranDau);
        const danhSachSuKien = await hamChiTiet.danhSachSukien_trong_1_tranDau_notToken(tranDau.ma_tran_dau);
        console.log("danhSachSuKien", danhSachSuKien);

        for (let j = 0; j < danhSachSuKien.length; j++) {
            const suKien = danhSachSuKien[j];
            if (suKien.loai_su_kien === "Bàn thắng") {
                thongSoDoiBong.so_ban_thang++;
                continue;
            }
            if (suKien.loai_su_kien === "Thẻ đỏ") {
                thongSoDoiBong.so_the_do++;
            }
            if (suKien.loai_su_kien === "Thẻ vàng") {
                thongSoDoiBong.so_the_vang++;
            }
        }


    }


    return thongSoDoiBong;
}
async function tinhDiem(thongSoDoiBong, form_quyTacTinhDiem) {
    let sum = 0;
    sum = sum + (thongSoDoiBong.so_tran_thang * form_quyTacTinhDiem.diem_thang)
        + (thongSoDoiBong.so_tran_hoa * form_quyTacTinhDiem.diem_hoa)
        + (thongSoDoiBong.so_tran_thua * form_quyTacTinhDiem.diem_thua)
        + (thongSoDoiBong.so_ban_thang * form_quyTacTinhDiem.diem_ban_thang)
        + (thongSoDoiBong.so_the_vang * form_quyTacTinhDiem.tru_the_vang)
        + (thongSoDoiBong.so_the_do * form_quyTacTinhDiem.tru_the_do);
    return sum;

}

async function loadDanhSach_maVongDau_xemHang(maGiaiDau) {
    const selectElement = document.getElementById("maVongDau_xemHang");
    selectElement.innerHTML = ""; // Xóa các tùy chọn hiện tại
    const data = await hamChung.layDanhSach_notToken("vong_dau");
    const data_true = data.filter(item => item.ma_giai_dau === maGiaiDau);
    data_true.forEach(item => {
        const option = document.createElement("option");
        option.value = item.ma_vong_dau;
        option.textContent = `${item.ten_vong_dau}`;
        selectElement.appendChild(option);
    });
}