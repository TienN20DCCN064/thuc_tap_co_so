//  <div id="background-image" class="hero overlay" style="background-image: url('/frontend/assets/home/images/bg_3.jpg');"></div>
import hamChung from "/frontend/mvc/model/global/model.hamChung.js";
document.addEventListener("DOMContentLoaded", async function () {
    const dataCauHinhGiaiDau = await hamChung.layDanhSach("cau_hinh_giao_dien");
    console.log("Cấu hình giải đấu:", dataCauHinhGiaiDau);
    const dataCauHinhGiaiDau_chon = dataCauHinhGiaiDau.find(item => item.is_dang_su_dung === 1);
    const giai_dau = document.getElementById("giai_dau");
    const team1 = document.getElementById("team-1");
    const team2 = document.getElementById("team-2");
    const score = document.getElementById("score");
    const team1_next = document.getElementById("team-1-next");
    const team2_next = document.getElementById("team-2-next");
    const nextMatchInfo = document.getElementById("next-match-info");

    var backgroundImage = document.getElementById("background-image");

    if (dataCauHinhGiaiDau_chon) {
        console.log("Cấu hình giải đấu đang sử dụng:", dataCauHinhGiaiDau_chon);

        const data1TranDau = await hamChung.layThongTinTheo_ID("tran_dau", dataCauHinhGiaiDau_chon.ma_tran_dau);
        const dataGiaiDau = await hamChung.layThongTinTheo_ID("giai_dau", data1TranDau.ma_giai_dau);

        const dataDoi_bong_1 = await hamChung.layThongTinTheo_ID("doi_bong", data1TranDau.ma_doi_1);
        const dataDoi_bong_2 = await hamChung.layThongTinTheo_ID("doi_bong", data1TranDau.ma_doi_2);
        const data1TranDauTiepTheo = await tranDau_tiepTheo(data1TranDau.ma_giai_dau);
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
        console.log("tranDau", data1TranDau);
        console.log("data1TranDauTiepTheo", data1TranDauTiepTheo);
        //  <div id="next-match-info" class="text-center widget-vs-contents mb-4">
        //                         <h4>World Cup League</h4>
        //                         <p class="mb-5">
        //                             <span class="d-block">Bắt Đầu Giải</span>
        //                             <span class="d-block">Kết Thúc Giải</span>
        //                             <!-- <strong class="text-primary">New Euro Arena</strong> -->
        //                         </p>

        //                         <div id="date-countdown2" class="pb-1"></div>
        //                     </div>
        if (data1TranDauTiepTheo) {
            console.log("Trận đấu tiếp theo:", data1TranDauTiepTheo);
            const data1GiaiDauTiepTheo = await hamChung.layThongTinTheo_ID("giai_dau", data1TranDauTiepTheo.ma_giai_dau);
            const data1SanVanDongTiepTheo = await hamChung.layThongTinTheo_ID("san_van_dong", data1TranDauTiepTheo.ma_san);
            const dataDoi_bong_1_next = await hamChung.layThongTinTheo_ID("doi_bong", data1TranDauTiepTheo.ma_doi_1);
            const dataDoi_bong_2_next = await hamChung.layThongTinTheo_ID("doi_bong", data1TranDauTiepTheo.ma_doi_2);


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
            // console.log("Ngày bắt đầu:", ngayBatDauFormatted);
            // console.log("Ngày kết thúc:", ngayKetThucFormatted);
            // console.log("Ngày bắt đầu:", ngayBatDau);
            nextMatchInfo.querySelector("p").innerHTML = `
                <span class="d-block">${ngayBatDauFormatted}</span>
                <span class="d-block">${ngayKetThucFormatted}</span>
                <strong class="text-primary">${data1SanVanDongTiepTheo.ten_san}</strong>
            `;
            siteCountDown(new Date(data1TranDauTiepTheo.thoi_gian_dien_ra), '#date-countdown2');
        }
    }

});

var siteCountDown = function (date, element) {

    $(element).countdown(date, function (event) {
        var $this = $(this).html(event.strftime(''
            + '<span class="countdown-block"><span class="label">%w</span> weeks </span>'
            + '<span class="countdown-block"><span class="label">%d</span> days </span>'
            + '<span class="countdown-block"><span class="label">%H</span> hr </span>'
            + '<span class="countdown-block"><span class="label">%M</span> min </span>'
            + '<span class="countdown-block"><span class="label">%S</span> sec</span>'));
    });

};
async function tranDau_tiepTheo(maGiaiDau) {
    const dataTranDau = await hamChung.layDanhSach("tran_dau");
    const currentTime = new Date(); // thời điểm hiện tại

    // Lọc các trận đấu thuộc giải đấu đang xét
    const dataTranDau_theoGiaiDau = dataTranDau.filter(item => item.ma_giai_dau === maGiaiDau);
    console.log("Các trận đấu theo giải đấu:", dataTranDau_theoGiaiDau);
    // Lọc ra những trận đấu có thời gian sau hiện tại 
    const tranDauSauHienTai = dataTranDau_theoGiaiDau.filter(item => {
        const thoiGianTranDau = new Date(item.thoi_gian_dien_ra);
        return thoiGianTranDau > currentTime;
    });
    console.log("Các trận đấu sau thời điểm hiện tại:", tranDauSauHienTai);

    // Sắp xếp theo thời gian tăng dần
    tranDauSauHienTai.sort((a, b) => new Date(a.thoi_gian_dien_ra) - new Date(b.thoi_gian_dien_ra));

    // Trận đấu tiếp theo là trận đầu tiên trong danh sách đã sắp xếp
    const tranTiepTheo = tranDauSauHienTai[0];

    return tranTiepTheo || null; // nếu không có thì trả về null
}
