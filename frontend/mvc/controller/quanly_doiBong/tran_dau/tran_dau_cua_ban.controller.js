import hamChung from "../../../model/global/model.hamChung.js";
import { GlobalStore, DoiTuyen } from "/frontend/global/global.js";
import {
    getElementIds,
    viewTbody,
} from "../../../view/view_js/quanly_doibong/tran_dau_cua_ban.view.js";
const {
    ngay_chon_viewbody
} = getElementIds();

let DATA_TRAN_DAU = [];
let MA_DOI_BONG = "";

document.addEventListener("DOMContentLoaded", async function () {
    console.log(DoiTuyen.getDoiTuyen_dangChon());
    // cho nó là ngày hôm nay ngay_chon_viewbody
    ngay_chon_viewbody.value = new Date().toISOString().split("T")[0];
    await loc_data();

    await load_viewTbody();


    ngay_chon_viewbody.addEventListener("change", async function () {
        await load_viewTbody();
    });


});

async function load_viewTbody() {
    const ngayChon = new Date(ngay_chon_viewbody.value);
    const ketQua = DATA_TRAN_DAU.filter(tran => {
        const thoiGianTran = new Date(tran.thoi_gian_dien_ra);
        // Chỉ lấy các trận có ngày >= ngày chọn (không so sánh giờ phút)
        return (
            thoiGianTran.getFullYear() > ngayChon.getFullYear() ||
            (thoiGianTran.getFullYear() === ngayChon.getFullYear() && thoiGianTran.getMonth() > ngayChon.getMonth()) ||
            (thoiGianTran.getFullYear() === ngayChon.getFullYear() && thoiGianTran.getMonth() === ngayChon.getMonth() && thoiGianTran.getDate() >= ngayChon.getDate())
        );
    });
    console.log("Danh sách sau lọc:", ketQua);
    await viewTbody(ketQua);
}

async function loc_data() {
    MA_DOI_BONG = DoiTuyen.getDoiTuyen_dangChon(); // Lấy mã đội bóng đang chọn từ global
    const dataTranDau = await hamChung.layDanhSach("tran_dau");
    DATA_TRAN_DAU = dataTranDau.filter(item => item.ma_doi_1 === MA_DOI_BONG || item.ma_doi_2 === MA_DOI_BONG);
    console.log("MA_DOI_BONG", MA_DOI_BONG);
    console.log("dataTranDau", dataTranDau);
    console.log("DATA_TRAN_DAU", DATA_TRAN_DAU);

}