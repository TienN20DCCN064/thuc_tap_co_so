import hamChung from "../../../model/global/model.hamChung.js";
import hamChiTiet from "../../../model/global/model.hamChiTiet.js";
import thongBao from "/frontend/assets/components/thongBao.js";
import {
    getElementIds,
    viewTbody,
    fillForm,
    loadDanhSachGiaiDau,
    loadDanhSachVongDau,
    loadDanhSachVongDau_chon_viewbody,
    loadDanhSachGiaiDau_chon_viewbody
} from "../../../view/view_js/quanly_admin/quy_tac_tinh_diem/quy_tac_tinh_diem.view.js";

const {
    btnLuuThayDoi, btnTaiLaiTrang, maGiaiDau, maVongDau, diemThang, diemHoa, diemThua, banThang,
    truTheVang, truTheDo, ghiChu, maGiaiDau_chon_viewbody, maVongDau_chon_viewbody, form, tableBody
} = getElementIds();

document.addEventListener("DOMContentLoaded", async function () {
    await loadDanhSachGiaiDau();

    await loadDanhSachGiaiDau_chon_viewbody();
    // await loadDanhSachVongDau_chon_viewbody();
    await load_viewTbody();
    maGiaiDau.addEventListener("change", async () => await loadDanhSachVongDau(maGiaiDau.value));
    maGiaiDau_chon_viewbody.addEventListener("change", async function () {
        await loadDanhSachVongDau_chon_viewbody(maGiaiDau_chon_viewbody.value)
        await load_viewTbody()
    });
    maVongDau_chon_viewbody.addEventListener("change", async function () {
        await load_viewTbody();
    });

    btnLuuThayDoi.addEventListener("click", handleLuuThayDoi);
    btnTaiLaiTrang.addEventListener("click", handleTaiLaiTrang);
    // document.getElementById("button_xemBangXepHang").addEventListener("click", async function (e) {
    //     await hienBangXepHang(maGiaiDau, maVongDau);
    // });
});

async function load_viewTbody(data) {
    await viewTbody(data, handleXemBXH, handleEdit, handleDelete);
}
function handleXemBXH(item) {
    const maGiaiDau = item.ma_giai_dau;
    const maVongDau = item.ma_vong_dau;
    hienBangXepHang(maGiaiDau, maVongDau);
}

function handleEdit(item) {
    fillForm(item);
}

async function handleDelete(item) {
    if (confirm(`Bạn có chắc chắn muốn xóa quy tắc tính điểm này?`)) {
        await hamChung.xoa({
            ma_giai_dau: item.ma_giai_dau,
            ma_vong_dau: item.ma_vong_dau
        }, "quy_tac_tinh_diem");
        await load_viewTbody();
    }
}

async function handleLuuThayDoi(event) {
    event.preventDefault();
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    let formData = {
        ma_giai_dau: maGiaiDau.value,
        ma_vong_dau: maVongDau.value,
        diem_thang: diemThang.value,
        diem_hoa: diemHoa.value,
        diem_thua: diemThua.value,
        diem_ban_thang: banThang.value,
        tru_the_vang: truTheVang.value,
        tru_the_do: truTheDo.value,
        ghi_chu: ghiChu.value
    };
    console.log(formData);

    if (maGiaiDau.disabled && maVongDau.disabled) {
        await hamChung.sua(formData, "quy_tac_tinh_diem");
        alert("Sửa thành công!");
    } else {
        if (await check_quyTacTinhDiem_tonTai(maGiaiDau.value, maVongDau.value)) {
            thongBao.thongBao_error("Quy tắc tính điểm đã tồn tại trong giải đấu - KHÔNG THỂ THÊM!", 3000, "error");
            return;
        }
        await hamChung.them(formData, "quy_tac_tinh_diem");
        alert("Thêm thành công!");
    }
    await load_viewTbody();
}
async function check_quyTacTinhDiem_tonTai(maGiaiDau, maVongDau) {
    const data = await hamChung.layDanhSach("quy_tac_tinh_diem");
    return data.some(item => item.ma_giai_dau === maGiaiDau && item.ma_vong_dau === maVongDau);
}

function handleTaiLaiTrang(event) {
    event.preventDefault();
    location.reload();
}

async function hienBangXepHang(maGiaiDau, maVongDau) {
    const dataTable_chon_quyTacTinhDiem = document.getElementById("dataTable_chon_quyTacTinhDiem");
    document.getElementById("overbangXepHang").classList.remove("hidden");
    document.getElementById("close_BXH").addEventListener("click", function () {
        document.getElementById("overbangXepHang").classList.add("hidden");
    });
    const data1quyTacTinhDiem = await hamChung.layThongTinTheo_2_ID("quy_tac_tinh_diem", maGiaiDau, maVongDau);
    document.getElementById("maGiaiDau_chon_BXH").value = maGiaiDau;
    document.getElementById("maVongDau_chon_BXH").value = maVongDau;
    console.log(data1quyTacTinhDiem);
    if (!data1quyTacTinhDiem) {
        thongBao.thongBao_error("Chưa có quy tắc tính điểm cho giải đấu và vòng đấu này!", 3000, "error");
        return;
    }
    document.getElementById("diemThang_BXH").value = data1quyTacTinhDiem.diem_thang;
    document.getElementById("diemHoa_BXH").value = data1quyTacTinhDiem.diem_hoa;
    document.getElementById("diemThua_BXH").value = data1quyTacTinhDiem.diem_thua;
    document.getElementById("diemBanThang_BXH").value = data1quyTacTinhDiem.diem_ban_thang;
    document.getElementById("truTheVang_BXH").value = data1quyTacTinhDiem.tru_the_vang;
    document.getElementById("truTheDo_BXH").value = data1quyTacTinhDiem.tru_the_do;
    const danhSachDoiBong_theoGiai_vongDau = await hamChiTiet.danhSachDoiBong_theoGiai_vongDau(maGiaiDau, maVongDau);
    console.log(danhSachDoiBong_theoGiai_vongDau);
    // show lên    <table id="dataTable_chon_BXH">
    const dataTable = document.getElementById("dataTable_chon_BXH");
    const tbody = dataTable.querySelector("tbody");
    tbody.innerHTML = ""; // Xóa dữ liệu cũ nếu có
    for (let i = 0; i < danhSachDoiBong_theoGiai_vongDau.length; i++) {
        const doiBong = danhSachDoiBong_theoGiai_vongDau[i];

        const thongSoDoiBong = await demThongSoDoiBong_theoGiai_vongDau(doiBong.ma_doi_bong, maGiaiDau, maVongDau);
        const lay1QuyTacTinhDiem = await hamChung.layThongTinTheo_2_ID("quy_tac_tinh_diem", maGiaiDau, maVongDau);
        const tongDiem = tinhDiem(thongSoDoiBong, lay1QuyTacTinhDiem);
        console.log(tongDiem);
        const row = document.createElement("tr");
        row.innerHTML = `
            <td style="text-align: center;">${doiBong.ten_doi_bong}</td>
            <td style="text-align: center;">${thongSoDoiBong.so_tran_thang}</td>
            <td style="text-align: center;">${thongSoDoiBong.so_tran_hoa}</td>
            <td style="text-align: center;">${thongSoDoiBong.so_tran_thua}</td>
            <td style="text-align: center;">${thongSoDoiBong.so_ban_thang}</td>
            <td style="text-align: center;">${thongSoDoiBong.so_the_vang}</td>
            <td style="text-align: center;">${thongSoDoiBong.so_the_do}</td>
            <td style="text-align: center;">${tongDiem}</td>
        `;
        tbody.appendChild(row);
    }

}
async function demThongSoDoiBong_theoGiai_vongDau(maDoiBong, maGiaiDau, maVongDau) {
    const danhSachTranDau_theoGiai_vongDau = await hamChiTiet.danhSachTranDau_theoGiai_vongDau(maGiaiDau, maVongDau);

    const danhSachTranDau_doiBong_da_trong_vongDau = danhSachTranDau_theoGiai_vongDau.filter((tran) => tran.ma_doi_1 === maDoiBong || tran.ma_doi_2 === maDoiBong);
    console.log("doi bóng", maDoiBong);
    console.log("danhSachTranDau_theoGiai_vongDau", danhSachTranDau_theoGiai_vongDau);
    console.log("danhSachTranDau_doiBong_da_trong_vongDau", danhSachTranDau_doiBong_da_trong_vongDau);
    const thongSoDoiBong = {
        so_tran_thang: 0,
        so_tran_hoa: 0,
        so_tran_thua: 0,

        so_ban_thang: 0,
        so_the_do: 0,
        so_the_vang: 0,
    };

    //      {
    //     "ma_tran_dau": "td_0007",

    //     "ma_doi_1": "DB01",
    //     "ma_doi_2": "DB02",

    //     "so_ban_doi_1": 5,
    //     "so_ban_doi_2": 5,
    //     "ma_doi_thang": "DB01",

    //   },
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
    // "ma_su_kien": "1",
    // "ma_tran_dau": "TD01",
    // enum('Bàn thắng', 'Thẻ đỏ', 'Thẻ vàng', 'Penalty')
    // "loai_su_kien": "Bàn thắng",

    for (let i = 0; i < danhSachTranDau_doiBong_da_trong_vongDau.length; i++) {
        const tranDau = danhSachTranDau_doiBong_da_trong_vongDau[i];
        console.log("tranDau", tranDau);
        const danhSachSuKien = await hamChiTiet.danhSachSukien_trong_1_tranDau(tranDau.ma_tran_dau);
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
function tinhDiem(thongSoDoiBong, form_quyTacTinhDiem) {

    console.log(thongSoDoiBong);
    console.log(form_quyTacTinhDiem);
    let sum = 0;
    sum = sum + (thongSoDoiBong.so_tran_thang * form_quyTacTinhDiem.diem_thang)
        + (thongSoDoiBong.so_tran_hoa * form_quyTacTinhDiem.diem_hoa)
        + (thongSoDoiBong.so_tran_thua * form_quyTacTinhDiem.diem_thua)
        + (thongSoDoiBong.so_ban_thang * form_quyTacTinhDiem.diem_ban_thang)
        + (thongSoDoiBong.so_the_vang * form_quyTacTinhDiem.tru_the_vang)
        + (thongSoDoiBong.so_the_do * form_quyTacTinhDiem.tru_the_do);
    return sum;

}