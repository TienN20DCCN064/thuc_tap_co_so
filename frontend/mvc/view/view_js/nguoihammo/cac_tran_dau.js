//  <div id="background-image" class="hero overlay" style="background-image: url('/frontend/assets/home/images/bg_3.jpg');"></div>
import hamChung from "/frontend/mvc/model/global/model.hamChung.js";
import hamChiTiet from "/frontend/mvc/model/global/model.hamChiTiet.js";

const view_list_giai_dau = document.getElementById('view_list_giai_dau');
const ten_giai_dau_view = document.getElementById("ten_giai_dau_view");
const giai_dau = document.getElementById("giai_dau");
const team1 = document.getElementById("team-1");
const team2 = document.getElementById("team-2");
const score = document.getElementById("score");
const team1_next = document.getElementById("team-1-next");
const team2_next = document.getElementById("team-2-next");
const nextMatchInfo = document.getElementById("next-match-info");

const backgroundImage = document.getElementById("background-image");
const SOLUONG_TRAN_DAU_TIEP_THEO = 10;
const SONGAY_TRUOC = 7;
let MA_GIAI_DAU = "";
let MA_TRAN_DAU_CHON = "";

document.addEventListener("DOMContentLoaded", async function () {

    const dataCauHinhGiaiDau = await hamChung.layDanhSach_notToken("cau_hinh_giao_dien");
    const dataCauHinhGiaiDau_chon = dataCauHinhGiaiDau.find(item => item.is_dang_su_dung === 1);


    const danhSachGiaiDau_can_show = await getDanhSach_giaiDau_dangDien_ra(SONGAY_TRUOC);
    await chon_giaiDau_va_tranDau();


    await hienThiListGiaiDau(danhSachGiaiDau_can_show, handleClickGiaiDau);

    if (MA_TRAN_DAU_CHON) {
        const data1TranDau = await hamChung.layThongTinTheo_ID_notToken("tran_dau", MA_TRAN_DAU_CHON);
        console.log("Trận đấu đã chọn:", data1TranDau);
        console.log("Cấu hình giải đấu đã chọn:", MA_TRAN_DAU_CHON);
        // const data1TranDauTiepTheo = await tranDau_tiepTheo(data1TranDau.ma_giai_dau);



        await view_1TranDau(data1TranDau, dataCauHinhGiaiDau_chon);
        await view_tranDauTiepTheo(data1TranDau);

        await view_danhSachTranDauTiepTheo(data1TranDau.ma_giai_dau, data1TranDau.ma_tran_dau, SOLUONG_TRAN_DAU_TIEP_THEO);


    }
    view_list_giai_dau.scrollIntoView({ behavior: "smooth" });

});

async function chon_giaiDau_va_tranDau() {
    const dataCauHinhGiaiDau = await hamChung.layDanhSach_notToken("cau_hinh_giao_dien");
    const dataCauHinhGiaiDau_chon = dataCauHinhGiaiDau.find(item => item.is_dang_su_dung === 1);
    console.log("Cấu hình giải đấu đang sử dụng:", dataCauHinhGiaiDau_chon);
    const dataTranDau_cauHinhGiaiDau = await hamChung.layThongTinTheo_ID_notToken("tran_dau", dataCauHinhGiaiDau_chon.ma_tran_dau);
    const url = new URL(window.location.href);
    const urlPramMaGiaiDau = url.searchParams.get("maGiaiDau");

    if (!dataCauHinhGiaiDau_chon) {
        console.error("Không tìm thấy cấu hình giải đấu đang sử dụng.");
        return;
    }
    MA_GIAI_DAU = dataTranDau_cauHinhGiaiDau.ma_giai_dau; // Mặc định lấy mã giải đấu từ cấu hình giao diện
    MA_TRAN_DAU_CHON = dataCauHinhGiaiDau_chon.ma_tran_dau;
    if (urlPramMaGiaiDau) {
        MA_GIAI_DAU = urlPramMaGiaiDau; // Lấy mã giải đấu từ URL
        MA_TRAN_DAU_CHON = "";
        const dataTranDau = await hamChung.layDanhSach_notToken("tran_dau");
        const dataTranDau_theoGiai = dataTranDau.filter(item => item.ma_giai_dau === MA_GIAI_DAU);
        const dataSort_tranDauTheoGiai = dataTranDau_theoGiai.sort((a, b) => new Date(a.thoi_gian) - new Date(b.thoi_gian));
        // lấy ra trận đấu gần hiện tại nhất
        MA_TRAN_DAU_CHON = dataSort_tranDauTheoGiai[0] ? dataSort_tranDauTheoGiai[0].ma_tran_dau : "";
        console.log("Mã giải đấu từ URL:", MA_TRAN_DAU_CHON);
        // Lấy trận gần nhất
        console.log("data", dataTranDau);

        console.log("dataTranDau_theoGiai", dataTranDau_theoGiai);
        console.log("dataSort_tranDauTheoGiai", dataSort_tranDauTheoGiai);

        // Lấy thời gian hiện tại
        const now = new Date();

        // Tìm trận đấu gần nhất so với hiện tại
        const tranGanNhat = dataSort_tranDauTheoGiai.find(
            tran => new Date(tran.thoi_gian) >= now
        );
        if (tranGanNhat) {
            MA_TRAN_DAU_CHON = tranGanNhat.ma_tran_dau;
        }

        // MA_TRAN_DAU_CHON = tranGanNhat ? tranGanNhat.ma_tran_dau : "";
        // console.log("Trận đấu gần nhất:", MA_TRAN_DAU_CHON);
    }
    console.log("MA_GIAI_DAU", MA_GIAI_DAU);
    console.log("MA_TRAN_DAU_CHON", MA_TRAN_DAU_CHON);
    const data1GiaiDau = await hamChung.layThongTinTheo_ID_notToken("giai_dau", MA_GIAI_DAU);
    document.getElementById("ten_giai_dau_view").innerHTML = data1GiaiDau.ten_giai_dau;

}


function handleClickGiaiDau(maGiaiDau) {
    console.log("ID giải đấu vừa click:", maGiaiDau);
    // chuyển file
    window.location.href = `/frontend/mvc/view/view_html/nguoihammo/cac_tran_dau.html?maGiaiDau=${maGiaiDau}`;
    // Bạn có thể xử lý thêm ở đây
}

async function hienThiListGiaiDau(dsGiaiDau, onClickGiaiDau) {
    const $carousel = $("#list_giai_dau");

    // Xóa nội dung cũ và destroy carousel cũ nếu có
    if ($carousel.hasClass('owl-loaded')) {
        $carousel.trigger('destroy.owl.carousel');
        $carousel.removeClass('owl-loaded owl-hidden');
        $carousel.html('');
    }

    for (const giai of dsGiaiDau) {
        let hinhAnh = await hamChung.getImage(giai.hinh_anh);
        if (!hinhAnh) {
            hinhAnh = "/frontend/assets/public/src/styles/resources/img/default_giai_dau.jpg";
        }
        const itemHTML = `
            <div class="item">
                    <img src="${hinhAnh}" alt="${giai.ten_giai_dau}" class="img-fluid"
                        style="width:300px; height:200px; object-fit:cover;"> 
                    <button 
                        type="button"
                        class="btn btn-primary mt-2 btn-xem-giai" 
                        id="btn-xem-giai-${giai.ma_giai_dau}"
                        value="${giai.ma_giai_dau}"
                        style="display:inline-block;">
                        Xem giải đấu
                    </button>
                    <span class="icon mr-3"><span class="icon-play"></span></span>
                    <div class="caption">
                        <h3 class="m-0">${giai.ten_giai_dau}</h3>
                    </div>
            </div>
        `;
        // Tạo element tạm để querySelector và gắn sự kiện
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = itemHTML;


        Array.from(tempDiv.childNodes).forEach(node => {
            $carousel.append(node);
        });
    }

    // Gắn lại sự kiện cho nút "Xem giải đấu" (dùng delegation)
    $carousel.off("click", ".btn-xem-giai").on("click", ".btn-xem-giai", function () {
        const maGiaiDau = $(this).val();
        if (typeof onClickGiaiDau === "function") {
            onClickGiaiDau(maGiaiDau);
        }
    });

    // Khởi tạo lại carousel
    $carousel.owlCarousel({
        items: 5,
        loop: false,
        margin: 30,

    });
}



// async function tranDau_tiepTheo(maGiaiDau) {
//     const dataTranDau = await hamChung.layDanhSach_notToken("tran_dau");
//     const currentTime = new Date(); // thời điểm hiện tại thực sự

//     console.log("Thời gian hiện tại:", currentTime.toISOString());

//     // Lọc các trận đấu thuộc giải đấu đang xét
//     const dataTranDau_theoGiaiDau = dataTranDau.filter(item => item.ma_giai_dau === maGiaiDau);
//     console.log("Các trận đấu theo giải đấu:", dataTranDau_theoGiaiDau);

//     // Lọc ra những trận đấu có thời gian sau hiện tại 
//     const tranDauSauHienTai = dataTranDau_theoGiaiDau.filter(item => {
//         const thoiGianTranDau = new Date(item.thoi_gian_dien_ra);
//         console.log("Thời gian trận đấu:", thoiGianTranDau.toISOString());
//         return thoiGianTranDau > currentTime;
//     });

//     console.log("Các trận đấu sau thời điểm hiện tại:", tranDauSauHienTai);

//     // Sắp xếp theo thời gian tăng dần
//     tranDauSauHienTai.sort((a, b) => new Date(a.thoi_gian_dien_ra) - new Date(b.thoi_gian_dien_ra));

//     // Trận đấu tiếp theo là trận đầu tiên trong danh sách đã sắp xếp
//     const tranTiepTheo = tranDauSauHienTai[0];

//     return tranTiepTheo || null; // nếu không có thì trả về null
// }



async function view_1TranDau(data1TranDau, dataCauHinhGiaiDau_chon) {
 
    const dataDoi_bong_1 = await hamChung.layThongTinTheo_ID_notToken("doi_bong", data1TranDau.ma_doi_1);
    const dataDoi_bong_2 = await hamChung.layThongTinTheo_ID_notToken("doi_bong", data1TranDau.ma_doi_2);
    const dataCauThu_giaiDau = await hamChung.layDanhSach_notToken("cau_thu_giai_dau");

    const dataCauThu_doi1_trongGiai = dataCauThu_giaiDau.filter(item => item.ma_doi_bong === data1TranDau.ma_doi_1 && item.ma_giai_dau === data1TranDau.ma_giai_dau);
    const dataCauThu_doi2_trongGiai = dataCauThu_giaiDau.filter(item => item.ma_doi_bong === data1TranDau.ma_doi_2 && item.ma_giai_dau === data1TranDau.ma_giai_dau);

    // // Ví dụ dữ liệu:
    // const team1Players = [
    //     { name: 'Nguyen Van A', position: 'FW' },
    //     { name: 'Tran Van B', position: 'MF' },
    //     { name: 'Le Van C', position: 'DF' },
    //     { name: 'Pham Van D', position: 'GK' }
    // ];
    // const team2Players = [
    //     { name: 'Hoang Van E', position: 'FW' },
    //     { name: 'Do Van F', position: 'MF' },
    //     { name: 'Vu Van G', position: 'DF' },
    //     { name: 'Bui Van H', position: 'GK' }
    // ];

    let soBan_doi1_doi2 = "---";
    if (data1TranDau.so_ban_doi_1 !== null && data1TranDau.so_ban_doi_2 !== null) {
        soBan_doi1_doi2 = `${data1TranDau.so_ban_doi_1} - ${data1TranDau.so_ban_doi_2}`;
    }
    backgroundImage.style.backgroundImage = `url('${await hamChung.getImage(dataCauHinhGiaiDau_chon.background)}')`;

    score.innerHTML = `${soBan_doi1_doi2}`;
    team1.querySelector("img").src = await hamChung.getImage(dataDoi_bong_1.hinh_anh);
    team1.querySelector("h3").innerHTML = `${dataDoi_bong_1.ten_doi_bong}`;
    team2.querySelector("img").src = await hamChung.getImage(dataDoi_bong_2.hinh_anh);
    team2.querySelector("h3").innerHTML = `${dataDoi_bong_2.ten_doi_bong}`;
    renderPlayerList("team-1-players", dataCauThu_doi1_trongGiai);
    renderPlayerList("team-2-players", dataCauThu_doi2_trongGiai);


}
function renderPlayerList(containerId, players) {
    const container = document.getElementById(containerId);
    container.innerHTML = ""; // Xóa danh sách cũ

    players.forEach(player => {
        const li = document.createElement("li");
        li.textContent = `${player.ho_ten} (${player.ma_vi_tri})`; // Hiển thị tên cầu thủ và vị trí
        container.appendChild(li);
    });
}
// async function get_danhSachBanThang_cuaDoi_theoGiai(maDoiBong, maGiaiDau) {
//     const dataCauThu_theoGiai = await hamChung.layDanhSach_notToken("cau_thu_giai_dau");
//     const suKienTranDau = await hamChung.layDanhSach_notToken("su_kien_tran_dau");
//     const dataTranDau = await hamChung.layDanhSach_notToken("tran_dau");
//     const dataTranDau_theoGiaiDau = dataTranDau.filter(item => item.ma_giai_dau === maGiaiDau);
//     // lấy ra danh sách suKienTranDau có suKienTranDau.ma_tran_dau nằm trong dataTranDau_theoGiaiDau
//     const dataSuKienTranDau_trongGiai = suKienTranDau.filter(item => dataTranDau_theoGiaiDau.some(tranDau => tranDau.ma_tran_dau === item.ma_tran_dau));
//     const dataSuKienTranDau_doiBong = dataSuKienTranDau_trongGiai.filter(item => item.ma_doi_bong === maDoiBong);
//     const data_banThang_cua_doi = dataSuKienTranDau_doiBong.filter(item => item.loai_su_kien === "Bàn thắng");
//     return data_banThang_cua_doi;
// }



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
    const sanVanDong = "Diễn ra tại sân vận động : " + data1SanBong.ten_san + " - " + data1SanBong.dia_chi + " -" || "----";

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
async function view_danhSachTranDauTiepTheo(maGiaiDau, maTranDauHienTai, soLuongHienThiTiepTheo) {
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
async function getDanhSach_giaiDau_dangDien_ra(soNgayTruoc) {
    const dataGiaiDau = await hamChung.layDanhSach_notToken("giai_dau");

    // Đảm bảo soNgayTruoc là số, mặc định = 0 nếu không truyền
    soNgayTruoc = Number(soNgayTruoc) || 0;

    // Lấy ngày cách đây soNgayTruoc
    const ngayCanSoSanh = new Date();
    ngayCanSoSanh.setDate(ngayCanSoSanh.getDate() - soNgayTruoc);

    // Kiểm tra ngày có hợp lệ không
    if (isNaN(ngayCanSoSanh.getTime())) {
        throw new Error("Ngày tính toán không hợp lệ");
    }

    const soNgayTruocISO = ngayCanSoSanh.toISOString(); // ISO UTC

    const dataCauHinhGiaiDau_chon = dataGiaiDau.filter(item => { return item.ngay_ket_thuc > soNgayTruocISO });
    console.log("Danh sách giải đấu đang diễn ra:", dataGiaiDau);
    console.log("Ngày cách đây", soNgayTruoc, "ngày:", soNgayTruocISO);
    console.log("Giải đấu phù hợp:", dataCauHinhGiaiDau_chon);

    return dataCauHinhGiaiDau_chon;
}
