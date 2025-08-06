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
const SOLUONG_TRAN_DAU_TIEP_THEO = 10;

document.addEventListener("DOMContentLoaded", async function () {
    console.log("Trang chủ đã được tải");

    const dataCauHinhGiaiDau = await hamChung.layDanhSach_notToken("cau_hinh_giao_dien");
    console.log("Cấu hình giải đấu:", dataCauHinhGiaiDau);
    const dataCauHinhGiaiDau_chon = dataCauHinhGiaiDau.find(item => item.is_dang_su_dung === 1);
    if (!dataCauHinhGiaiDau_chon) {
        console.error("Không tìm thấy cấu hình giải đấu đang sử dụng.");
        return;

    }
    const data1TranDau = await hamChung.layThongTinTheo_ID_notToken("tran_dau", dataCauHinhGiaiDau_chon.ma_tran_dau);
    await view_1TranDau(data1TranDau, dataCauHinhGiaiDau_chon);
    console.log("Cấu hình giải đấu đang sử dụng:", dataCauHinhGiaiDau_chon);
    await view_tranDauTiepTheo(data1TranDau);
    await view_danhSachTranDauTiepTheo(data1TranDau.ma_giai_dau, data1TranDau.ma_tran_dau, SOLUONG_TRAN_DAU_TIEP_THEO);
    // const data1TranDau = await hamChung.layThongTinTheo_ID_notToken("tran_dau", dataCauHinhGiaiDau_chon.ma_tran_dau);
    // const data1TranDauTiepTheo = await tranDau_tiepTheo(data1TranDau.ma_giai_dau);

    // await view_1TranDau(data1TranDau, dataCauHinhGiaiDau_chon);
    // console.log("Thông tin trận đấu:", data1TranDauTiepTheo);
    // await view_tranDauTiepTheo(data1TranDauTiepTheo);
    // await view_bangXepHang(data1TranDau.ma_giai_dau, maVongDau_xemHang.value);
    // maVongDau_xemHang.addEventListener("change", async function () {
    //     await view_bangXepHang(data1TranDau.ma_giai_dau, maVongDau_xemHang.value);
    // });


});


async function view_1TranDau(data1TranDau, dataCauHinhGiaiDau_chon) {
    const dataGiaiDau = await hamChung.layThongTinTheo_ID_notToken("giai_dau", data1TranDau.ma_giai_dau);

    const dataDoi_bong_1 = await hamChung.layThongTinTheo_ID_notToken("doi_bong", data1TranDau.ma_doi_1);
    const dataDoi_bong_2 = await hamChung.layThongTinTheo_ID_notToken("doi_bong", data1TranDau.ma_doi_2);

    // console.log("Thông tin trận đấu:", data1TranDau);
    console.log("Thông tin giải đấu:", dataGiaiDau);
    // siteCountDown(new Date(dataGiaiDau.ngay_ket_thuc), '#date-countdown');
    // giai_dau.querySelector("h1").innerHTML = `${dataGiaiDau.ten_giai_dau}`;
    // giai_dau.querySelector("p").innerHTML = `${dataGiaiDau.mo_ta}`;


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

}

// ...existing code...

async function view_tranDauTiepTheo(data1TranDau) {

    // Lấy thông tin trận đấu tiếp theo
    const dataTranDau = await hamChung.layDanhSach_notToken("tran_dau");
    const dataTranDau_theoGiaiDau = dataTranDau.filter(item => item.ma_giai_dau === data1TranDau.ma_giai_dau);
    const data1TranDauTiepTheo = dataTranDau_theoGiaiDau.find(item => item.ma_tran_dau > data1TranDau.ma_tran_dau);
    console.log("Thông tin trận đấu hiện tại:", data1TranDau);
    console.log("Thông tin trận đấu tiếp theo:", data1TranDauTiepTheo);

    // Lấy thông tin đội bóng và giải đấu
    const dataGiaiDau = await hamChung.layThongTinTheo_ID_notToken("giai_dau", data1TranDauTiepTheo.ma_giai_dau);
    const dataDoi_bong_1 = await hamChung.layThongTinTheo_ID_notToken("doi_bong", data1TranDauTiepTheo.ma_doi_1);
    const dataDoi_bong_2 = await hamChung.layThongTinTheo_ID_notToken("doi_bong", data1TranDauTiepTheo.ma_doi_2);
    const thoiGianDienRa = data1TranDauTiepTheo.thoi_gian_dien_ra;
    // có dạng 2026-07-08T16:37:00.000Z
    // chuyển đổi sang ngày diển ra là 2026-07-08 giờ diễn ra là 16:37:00

    // Xử lý ngày giờ và sân vận động

    const tenGiaiDau = dataGiaiDau.ten_giai_dau || "----";
    const ngayDienRa = new Date(thoiGianDienRa).toLocaleDateString("vi-VN", {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
    const gioDienRa = new Date(thoiGianDienRa).toLocaleTimeString("vi-VN", {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    const data1SanBong = await hamChung.layThongTinTheo_ID_notToken("san_van_dong", data1TranDauTiepTheo.ma_san);
    const sanVanDong ="Diễn ra tại sân vận động : " + data1SanBong.ten_san + " - " + data1SanBong.dia_chi + " -" || "----";

    // Render HTML động vào #next-match
    const nextMatch = document.getElementById("next-match");
    nextMatch.innerHTML = `
        <div class="widget-title">
            <h3>Next Match</h3>
        </div>
        <div class="widget-body mb-3">
            <div class="widget-vs">
                <div class="d-flex align-items-center justify-content-around justify-content-between w-100">
                    <div class="team-1 text-center">
                        <img src="${await hamChung.getImage(dataDoi_bong_1.hinh_anh)}" alt="Image">
                        <h3>${dataDoi_bong_1.ten_doi_bong}</h3>
                    </div>
                    <div>
                        <span class="vs"><span>VS</span></span>
                    </div>
                    <div class="team-2 text-center">
                        <img src="${await hamChung.getImage(dataDoi_bong_2.hinh_anh)}" alt="Image">
                        <h3>${dataDoi_bong_2.ten_doi_bong}</h3>
                    </div>
                </div>
            </div>
        </div>
        <div class="text-center widget-vs-contents mb-4">
            <h4>${tenGiaiDau}</h4>
            <p class="mb-5">
                <span class="d-block">${ngayDienRa}</span>
                <span class="d-block">${gioDienRa}</span>
                <strong class="text-primary">${sanVanDong}</strong>
            </p>
            <div id="date-countdown2" class="pb-1"></div>
        </div>
    `;
}

// ...existing code...

async function view_danhSachTranDauTiepTheo(maGiaiDau, maTranDauHienTai,soLuongHienThiTiepTheo) {
    const dataTranDau = await hamChung.layDanhSach_notToken("tran_dau");
    // Lọc các trận đấu cùng giải và mã trận lớn hơn trận hiện tại (tức là các trận tiếp theo)
    const tranDauTiepTheo = dataTranDau
        .filter(item => item.ma_giai_dau === maGiaiDau && item.ma_tran_dau > maTranDauHienTai)
        .sort((a, b) => a.ma_tran_dau - b.ma_tran_dau)
        .slice(0, soLuongHienThiTiepTheo);
    console.log("Danh sách trận đấu tiếp theo:", tranDauTiepTheo);

    const htmlArr = [];
    for (const tran of tranDauTiepTheo) {
        const [doi1, doi2, giai, san] = await Promise.all([
            hamChung.layThongTinTheo_ID_notToken("doi_bong", tran.ma_doi_1),
            hamChung.layThongTinTheo_ID_notToken("doi_bong", tran.ma_doi_2),
            hamChung.layThongTinTheo_ID_notToken("giai_dau", tran.ma_giai_dau),
            hamChung.layThongTinTheo_ID_notToken("san_van_dong", tran.ma_san)
        ]);
        const thoiGian = new Date(tran.thoi_gian_dien_ra);
        const ngay = thoiGian.toLocaleDateString("vi-VN", { year: 'numeric', month: '2-digit', day: '2-digit' });
        const gio = thoiGian.toLocaleTimeString("vi-VN", { hour: '2-digit', minute: '2-digit' });

        htmlArr.push(`
            <div class="col-lg-6 mb-4">
                <div class="bg-light p-4 rounded">
                    <div class="widget-body">
                        <div class="widget-vs">
                            <div class="d-flex align-items-center justify-content-around justify-content-between w-100">
                                <div class="team-1 text-center">
                                    <img src="${await hamChung.getImage(doi1.hinh_anh)}" alt="Image">
                                    <h3>${doi1.ten_doi_bong}</h3>
                                </div>
                                <div>
                                    <span class="vs"><span>VS</span></span>
                                </div>
                                <div class="team-2 text-center">
                                    <img src="${await hamChung.getImage(doi2.hinh_anh)}" alt="Image">
                                    <h3>${doi2.ten_doi_bong}</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="text-center widget-vs-contents mb-4">
                        <h4>${giai.ten_giai_dau}</h4>
                        <p class="mb-5">
                            <span class="d-block">${ngay}</span>
                            <span class="d-block">${gio}</span>
                            <strong class="text-primary">${san.ten_san} - ${san.dia_chi}</strong>
                        </p>
                    </div>
                </div>
            </div>
        `);
    }

    document.getElementById("upcoming-matches-list").innerHTML = `
        <div class="col-12 title-section">
            <h2 class="heading">Upcoming Match</h2>
        </div>
        ${htmlArr.join("")}
    `;
}