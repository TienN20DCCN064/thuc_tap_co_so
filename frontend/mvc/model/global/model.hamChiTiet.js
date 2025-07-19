import hamChung from "./model.hamChung.js";
import { GlobalStore, DoiTuyen } from "/frontend/global/global.js";
//C:\Users\vanti\Desktop\mvc_project\frontend\global\global.js

const hamChiTiet = {
    //==============Quan ly============================
    // async dangNhap(formData) {
    //     return await dangNhap(formData);
    // },
    async layDoiBongTheoQL(ma_ql_doi_bong) {
        return await layDoiBongTheoQL(ma_ql_doi_bong);
    },
    async layGiaiDauTheoQL(ma_nguoi_tao) {
        return await layGiaiDauTheoQL(ma_nguoi_tao);
    },
    async danhSachTrongTai_theoGiai(maGiaiDau) {
        return await danhSachTrongTai_theoGiai(maGiaiDau);
    },
    async danhSachTrongTai_theo_1tranDau(maTranDau) {
        return await danhSachTrongTai_theo_1tranDau(maTranDau);
    },
    async danhSachTranDau_theoGiai_vongDau(maGiaiDau, maVongDau) {
        return await danhSachTranDau_theoGiai_vongDau(maGiaiDau, maVongDau);
    },
    async danhSachDoiBong_theoGiai_vongDau(maGiaiDau, maVongDau) {
        return await danhSachDoiBong_theoGiai_vongDau(maGiaiDau, maVongDau);
    },
    async danhSachSukien_trong_1_tranDau(maTranDau) {
        return await danhSachSukien_trong_1_tranDau(maTranDau);
    },
    async demSoLuong_cauThu_theoDoiBong(maDoiBong) {
        return await demSoLuong_cauThu_theoDoiBong(maDoiBong);
    },
    async demSoLuong_doiBong_theoGiaiDau(maGiaiDau) {
        return await demSoLuong_doiBong_theoGiaiDau(maGiaiDau);
    },

    async danhSachTranDau_theoGiai_vongDau_notToken(maGiaiDau, maVongDau) {
        return await danhSachTranDau_theoGiai_vongDau_notToken(maGiaiDau, maVongDau);
    },
    async danhSachDoiBong_theoGiai_vongDau_notTocken(maGiaiDau, maVongDau) {
        return await danhSachDoiBong_theoGiai_vongDau_notTocken(maGiaiDau, maVongDau);
    },
    async danhSachSukien_trong_1_tranDau_notToken(maTranDau) {
        return await danhSachSukien_trong_1_tranDau_notToken(maTranDau);
    },

};


// async function getThongtinUser(formData) {
//     const dataNguoiDung = await hamChung.layDanhSach("nguoi_dung");
//     // lấy ra 1 người thôi
//     const dataUser = dataNguoiDung.filter(item => item.ten_dang_nhap === formData.tenDangNhap);
// }

async function layDoiBongTheoQL(ma_ql_doi_bong) {
    const dataDoiBong = await hamChung.layDanhSach("doi_bong");
    const dataDoiBong_theoIdQuanLy = dataDoiBong.filter((item) => item.ma_ql_doi_bong === ma_ql_doi_bong);
    return dataDoiBong_theoIdQuanLy;
}

async function layGiaiDauTheoQL(ma_nguoi_tao) {
    const dataGiaiDau = await hamChung.layDanhSach("giai_dau");
    const dataGiaiDau_theoIdQuanLy = dataGiaiDau.filter((item) => item.ma_nguoi_tao === ma_nguoi_tao);
    return dataGiaiDau_theoIdQuanLy;
}
async function danhSachTrongTai_theoGiai(maGiaiDau) {
    const danhSachTrongTai = await hamChung.layDanhSach("trong_tai");
    const danhSachTrongTai_theoGiai = danhSachTrongTai.filter((item) => item.ma_giai_dau === maGiaiDau);
    return danhSachTrongTai_theoGiai;
}
async function danhSachTrongTai_theo_1tranDau(maTranDau) {
    const danhSachTrongTaiTranDau = await hamChung.layDanhSach("trong_tai_tran_dau");
    const danhSachTrongTai_theo_1tranDau = danhSachTrongTaiTranDau.filter((item) => item.ma_tran_dau === maTranDau);
    return danhSachTrongTai_theo_1tranDau;

}
async function danhSachTranDau_theoGiai_vongDau(maGiaiDau, maVongDau) {
    const danhSachTranDau = await hamChung.layDanhSach("tran_dau");
    const danhSachTranDau_theoGiai_vongDau = danhSachTranDau.filter((item) => item.ma_giai_dau === maGiaiDau && item.ma_vong_dau === maVongDau);
    return danhSachTranDau_theoGiai_vongDau;
}
async function danhSachDoiBong_theoGiai_vongDau(maGiaiDau, maVongDau) {
    const dataDoiBongGiaiDau = await hamChung.layDanhSach("doi_bong_giai_dau");
    if (maVongDau === "All") {
        return dataDoiBongGiaiDau
    }
    const danhSachTranDau_theoGiai_vongDau = await hamChiTiet.danhSachTranDau_theoGiai_vongDau(maGiaiDau, maVongDau);
    const doiBongIds = danhSachTranDau_theoGiai_vongDau.flatMap(tran => [tran.ma_doi_1, tran.ma_doi_2]);
    let data = [];
    for (const id of doiBongIds) {
        const doiBong = await hamChung.layThongTinTheo_2_ID("doi_bong_giai_dau", id, maGiaiDau);
        if (doiBong) {
            data = data || [];
            data.push(doiBong);
        }
    }
    return data;

}
// hãy ví dụ đầu vào và đầu ra từ layDanhSachDoiBong_theoGiai_vongDau
async function danhSachSukien_trong_1_tranDau(maTranDau) {
    const danhSachSuKien = await hamChung.layDanhSach("su_kien_tran_dau");
    const danhSachSuKien_theoTranDau = danhSachSuKien.filter((item) => item.ma_tran_dau === maTranDau);
    return danhSachSuKien_theoTranDau;
}
async function demSoLuong_cauThu_theoDoiBong(maDoiBong) {
    const dataCauThu = await hamChung.layDanhSach("cau_thu");
    const dataCauThu_theoDoiBong = dataCauThu.filter((item) => item.ma_doi_bong === maDoiBong);
    return dataCauThu_theoDoiBong.length;
}
async function demSoLuong_doiBong_theoGiaiDau(maGiaiDau) {
    const dataDoiBongGiaiDau = await hamChung.layDanhSach("doi_bong_giai_dau");
    const dataDoiBong_1GiaiDau = dataDoiBongGiaiDau.filter(item => item.ma_giai_dau === maGiaiDau);
    return dataDoiBong_1GiaiDau.length;
}





async function danhSachTranDau_theoGiai_vongDau_notToken(maGiaiDau, maVongDau) {
    const danhSachTranDau = await hamChung.layDanhSach_notToken("tran_dau");
    const danhSachTranDau_theoGiai_vongDau = danhSachTranDau.filter((item) => item.ma_giai_dau === maGiaiDau && item.ma_vong_dau === maVongDau);
    return danhSachTranDau_theoGiai_vongDau;
}
async function danhSachDoiBong_theoGiai_vongDau_notTocken(maGiaiDau, maVongDau) {
    const dataDoiBongGiaiDau = await hamChung.layDanhSach_notToken("doi_bong_giai_dau");
    if (maVongDau === "All") {
        return dataDoiBongGiaiDau
    }
    const danhSachTranDau_theoGiai_vongDau = await hamChiTiet.danhSachTranDau_theoGiai_vongDau(maGiaiDau, maVongDau);
    const doiBongIds = danhSachTranDau_theoGiai_vongDau.flatMap(tran => [tran.ma_doi_1, tran.ma_doi_2]);
    let data = [];
    for (const id of doiBongIds) {
        const doiBong = await hamChung.layThongTinTheo_2_ID_notToken("doi_bong_giai_dau", id, maGiaiDau);
        if (doiBong) {
            data = data || [];
            data.push(doiBong);
        }
    }
    return data;

}
// hãy ví dụ đầu vào và đầu ra từ layDanhSachDoiBong_theoGiai_vongDau
async function danhSachSukien_trong_1_tranDau_notToken(maTranDau) {
    const danhSachSuKien = await hamChung.layDanhSach_notToken("su_kien_tran_dau");
    const danhSachSuKien_theoTranDau = danhSachSuKien.filter((item) => item.ma_tran_dau === maTranDau);
    return danhSachSuKien_theoTranDau;
}

export default hamChiTiet;