import hamChung from "../../../model/global/model.hamChung.js";
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
    btnLuuThayDoi, btnTaiLaiTrang, maGiaiDau, maVongDau, diemThang, diemHoa, diemThua,
    truTheVang, truTheDoGianTiep, truTheDoTrucTiep, ghiChu, maGiaiDau_chon_viewbody, maVongDau_chon_viewbody, form, tableBody
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
        tru_the_vang: truTheVang.value,
        tru_the_do_gian_tiep: truTheDoGianTiep.value,
        tru_the_do_truc_tiep: truTheDoTrucTiep.value,
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
    document.getElementById("diemThang_BXH").textContent = data1quyTacTinhDiem.diem_thang;
    document.getElementById("diemHoa_BXH").textContent = data1quyTacTinhDiem.diem_hoa;
    document.getElementById("diemThua_BXH").textContent = data1quyTacTinhDiem.diem_thua;
    document.getElementById("truTheVang_BXH").textContent = data1quyTacTinhDiem.tru_the_vang;
    document.getElementById("truTheDoGianTiep_BXH").textContent = data1quyTacTinhDiem.tru_the_do_gian_tiep;
    document.getElementById("truTheDoTrucTiep_BXH").textContent = data1quyTacTinhDiem.tru_the_do_truc_tiep;

    //  document.getElementById("ghiChu_BXH").value = data1quyTacTinhDiem.ghi_chu || "";
    // dataTable_chon_BXH.innerHTML = `
    //     <thead>  
    //         <tr>
    //             <th style="text-align: center;">Thắng</th>
    //             <th style="text-align: center;">Hòa</th>
    //             <th style="text-align: center;">Thua</th>
    //             <th style="text-align: center;">Thẻ Vàng</th>
    //             <th style="text-align: center;">Thẻ Đỏ GT</th>
    //             <th style="text-align: center;">Thẻ Đỏ TT</th>
                
    //         </tr>
    //     </thead>
    //     <tbody id="tbody_bangXepHang"></tbody>`;
    const dataDoiBongGiaiDau = await hamChung.layDanhSach("doi_bong_giai_dau");
    
}