
import hamChung from "/frontend/mvc/model/global/model.hamChung.js";

const selectGiaiDau = document.getElementById("select_giai_dau");
const selectDoiBong = document.getElementById("select_doi_bong");
const thongKeGiaiDau = document.getElementById("thong_ke_giai_dau");

document.addEventListener("DOMContentLoaded", async function () {
    const dsGiaiDau = await hamChung.layDanhSach_notToken("giai_dau");
    selectGiaiDau.innerHTML = dsGiaiDau.map(gd => `<option value="${gd.ma_giai_dau}">${gd.ten_giai_dau}</option>`).join("");
    if (dsGiaiDau.length > 0) {
        await hienThiThongKeGiaiDau(dsGiaiDau[0].ma_giai_dau);
        await loadDanhSachDoiBong_giaiDau(dsGiaiDau[0].ma_giai_dau);
    }
    selectGiaiDau.addEventListener("change", async function () {
        await hienThiThongKeGiaiDau(this.value, selectDoiBong.value);
        await loadDanhSachDoiBong_giaiDau(this.value);
    });
    selectDoiBong.addEventListener("change", async function () {
        await hienThiThongKeGiaiDau(selectGiaiDau.value, this.value);
    });
});
async function loadDanhSachDoiBong_giaiDau(maGiaiDau) {
    const selectElement = document.getElementById("select_doi_bong");
    selectElement.innerHTML = '<option value="All">-- Lọc theo đội bóng --</option>';
    const data = await hamChung.layDanhSach_notToken("doi_bong_giai_dau");
    const dataDoiBong_theo_giai = data.filter(item => item.ma_giai_dau === maGiaiDau);
    dataDoiBong_theo_giai.forEach(item => {
        const option = document.createElement("option");
        option.value = item.ma_doi_bong;
        option.textContent = `${item.ten_doi_bong}`;
        selectElement.appendChild(option);
    });
}


async function hienThiThongKeGiaiDau(maGiaiDau, maDoiBong = "") {
    const giai = await hamChung.layThongTinTheo_ID_notToken("giai_dau", maGiaiDau);
    let dsTranDau = (await hamChung.layDanhSach_notToken("tran_dau")).filter(td => td.ma_giai_dau === maGiaiDau);
    let dsDoiBong = (await hamChung.layDanhSach_notToken("doi_bong_giai_dau")).filter(db => db.ma_giai_dau === maGiaiDau);
    let dsCauThu = (await hamChung.layDanhSach_notToken("cau_thu_giai_dau")).filter(ct => dsDoiBong.some(db => db.ma_doi_bong === ct.ma_doi_bong));
    const dsSuKien = await hamChung.layDanhSach_notToken("su_kien_tran_dau");

    // Nếu lọc theo đội bóng
    if (maDoiBong && maDoiBong !== "All") {
        dsTranDau = dsTranDau.filter(td => td.ma_doi_1 === maDoiBong || td.ma_doi_2 === maDoiBong);
        dsDoiBong = dsDoiBong.filter(db => db.ma_doi_bong === maDoiBong);
        dsCauThu = dsCauThu.filter(ct => ct.ma_doi_bong === maDoiBong);
    }

    // Tổng số trận, bàn thắng, thẻ vàng, thẻ đỏ
    // Tổng số trận, bàn thắng, thẻ vàng, thẻ đỏ
    const tongTran = dsTranDau.length;
    let tongBanThang = 0, tongTheVang = 0, tongTheDo = 0;
    let test_allTongBanThang = 0;
    // Lấy danh sách mã trận đấu thuộc giải (và đội nếu có lọc)
    const tranDauIds = dsTranDau.map(td => td.ma_tran_dau);


    // Đếm tổng số bàn thắng dựa trên sự kiện "Bàn thắng"
    tongBanThang = dsSuKien.filter(sk =>
        sk.loai_su_kien === "Bàn thắng" &&
        tranDauIds.includes(sk.ma_tran_dau) &&
        (!maDoiBong || maDoiBong === "All" || sk.ma_doi_bong === maDoiBong)
    ).length;

    // Đếm thẻ vàng, thẻ đỏ
    tongTheVang = dsSuKien.filter(sk =>
        sk.loai_su_kien === "Thẻ vàng" &&
        tranDauIds.includes(sk.ma_tran_dau) &&
        (!maDoiBong || maDoiBong === "All" || sk.ma_doi_bong === maDoiBong)
    ).length;

    tongTheDo = dsSuKien.filter(sk =>
        sk.loai_su_kien === "Thẻ đỏ" &&
        tranDauIds.includes(sk.ma_tran_dau) &&
        (!maDoiBong || maDoiBong === "All" || sk.ma_doi_bong === maDoiBong)
    ).length;
    // Thống kê bàn thắng cho tất cả cầu thủ
    const banThangCauThu = {};
    dsCauThu.forEach(ct => {
        banThangCauThu[ct.ma_cau_thu] = 0;
    });
    dsSuKien.forEach(sk => {
        if (
            sk.loai_su_kien === "Bàn thắng" &&
            dsTranDau.some(td => td.ma_tran_dau === sk.ma_tran_dau) &&
            (!maDoiBong || maDoiBong === "All" || sk.ma_doi_bong === maDoiBong)
        ) {
            if (banThangCauThu.hasOwnProperty(sk.ma_cau_thu)) {
                banThangCauThu[sk.ma_cau_thu]++;
            }
        }
    });
    const allCauThu = await Promise.all(
        dsCauThu
            .map(async ct => {
                const doi = dsDoiBong.find(db => db.ma_doi_bong === ct.ma_doi_bong);
                let hinh_anh;
                if (!ct.hinh_anh || ct.hinh_anh === null || ct.hinh_anh === "") {
                    hinh_anh = "/frontend/assets/public/images/user-icon.png";
                } else {
                    hinh_anh = await hamChung.getImage(ct.hinh_anh);
                }
                test_allTongBanThang = test_allTongBanThang + banThangCauThu[ct.ma_cau_thu];
                return {
                    ho_ten: ct.ho_ten,
                    so_ban: banThangCauThu[ct.ma_cau_thu] || 0,
                    ten_doi: doi ? doi.ten_doi_bong : "",
                    anh: hinh_anh
                };
            })
    );
    // Sắp xếp giảm dần theo số bàn thắng
    allCauThu.sort((a, b) => b.so_ban - a.so_ban);

    thongKeGiaiDau.innerHTML = `
        <div class="col-lg-5 mb-4">
            <div class="card shadow border-0 h-100">
                <div class="card-header bg-primary text-white text-center">
                    <h4 class="mb-0"><span class="icon-info-circle mr-2"></span>Thông Tin Chung</h4>
                </div>
                <div class="card-body">
                    <ul class="list-group list-group-flush" id="thong_tin_chung">
                        <li class="list-group-item d-flex justify-content-between align-items-center">
                            <span><strong>Tên giải đấu:</strong></span>
                            <span>${giai.ten_giai_dau}</span>
                        </li>
                        <li class="list-group-item d-flex justify-content-between align-items-center">
                            <span><strong>Mô tả:</strong></span>
                            <span>${giai.mo_ta || ""}</span>
                        </li>
                        <li class="list-group-item d-flex justify-content-between align-items-center">
                            <span><strong>Thời gian:</strong></span>
                            <span>${giai.ngay_bat_dau?.slice(0, 10)} - ${giai.ngay_ket_thuc?.slice(0, 10)}</span>
                        </li>
                        <li class="list-group-item d-flex justify-content-between align-items-center">
                            <span><strong>Số đội tham gia:</strong></span>
                            <span>${dsDoiBong.length}</span>
                        </li>
                        <li class="list-group-item d-flex justify-content-between align-items-center">
                            <span><strong>Số trận đã diễn ra:</strong></span>
                            <span>${tongTran}</span>
                        </li>
                        <li class="list-group-item d-flex justify-content-between align-items-center">
                            <span><strong>Tổng số bàn thắng:</strong></span>
                            <span>${test_allTongBanThang}</span>
                        </li>
                        <li class="list-group-item d-flex justify-content-between align-items-center">
                            <span><strong>Tổng thẻ vàng:</strong></span>
                            <span>${tongTheVang}</span>
                        </li>
                        <li class="list-group-item d-flex justify-content-between align-items-center">
                            <span><strong>Tổng thẻ đỏ:</strong></span>
                            <span>${tongTheDo}</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="col-lg-7 mb-4">
            <div class="card shadow border-0 h-100">
                <div class="card-header bg-success text-white text-center">
                    <h4 class="mb-0"><span class="icon-star mr-2"></span>Danh Sách Cầu Thủ & Bàn Thắng</h4>
                </div>
                <div class="card-body p-0" style="max-height: 500px; overflow-y: auto;">
                    <table class="table table-hover mb-0 text-center" id="top_cau_thu_ban">
                        <thead class="thead-light">
                            <tr>
                                <th>STT</th>
                                <th>Cầu Thủ</th>
                                <th>Đội</th>
                                <th>Bàn Thắng</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${allCauThu.length === 0
            ? `<tr><td colspan="4">Chưa có dữ liệu</td></tr>`
            : allCauThu.map((ct, idx) => `
                                    <tr>
                                        <td>${idx + 1}</td>
                                        <td class="align-middle text-left">
                                            <div class="d-flex align-items-center">
                                                <img src="${ct.anh}" alt="Player" class="rounded-circle mr-2" width="36" height="36" style="object-fit:cover; border:1px solid #ddd;">
                                                <span>${ct.ho_ten}</span>
                                            </div>
                                        </td>
                                      
                                        <td>${ct.ten_doi}</td>
                                        <td>${ct.so_ban}</td>
                                    </tr>
                                `).join("")
        }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
}