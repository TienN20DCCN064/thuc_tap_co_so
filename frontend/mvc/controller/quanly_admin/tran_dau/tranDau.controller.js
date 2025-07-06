import hamChung from "/frontend/mvc/model/global/model.hamChung.js";
import hamChiTiet from "/frontend/mvc/model/global/model.hamChiTiet.js";
import thongBao from "/frontend/assets/components/thongBao.js";
import {
    getElementIds,
    viewTableBody,
    viewTbody_chon,
    view_danhSachTranDau_duocTao,
    fillForm,
    loadDanhSachGiaiDau,
    loadDanhSachVongDau,
    loadDanhSachSanVanDong,
    loadDanhSachHinhThucXepTranDau,
    loadDanhSachGiaiDau_chon,
    loadDanhSachGiaiDau_chon_viewbody,
    loadDanhSachVongDau_chon_viewbody,
    loadDanhSachDoiBong_maDoi1_end,
    loadDanhSachDoiBong_maDoi2_end,
    loadDanhSachTrongTai
} from "/frontend/mvc/view/view_js/quanly_admin/tran_dau/tranDau.view.js";

const {
    btnLuuThayDoi, btnTaiLaiTrang, button_xepLich, button_xem_ds_trongTaiformInput,
    button_luu_danhSachTranDau,
    maGiaiDau, maVongDau, maTranDau, maDoi1, maDoi2, maDoiThang, soBanDoi1, soBanDoi2,
    thoiGianDienRa, sanVanDong, trangThai, ghiChu,
    modalXemTrongTai, danh_sach_trong_tai_tran_dau,
    maGiaiDau_chon_viewbody, maVongDau_chon_viewbody, form, chon_hinhThuc_tao_tran, maGiaiDau_chon,
    maVongDau_chon, chon_ngayBatDau, chon_gioBatDau, button_tao_tran,
    button_chon_tat_ca, btnCloseBangTaoTran
} = getElementIds();

let danhSach_doiBong_theoBang;

document.addEventListener("DOMContentLoaded", async function () {
    console.log("Trang quản lý trận đấu đã được tải");
    await loadDanhSachGiaiDau();
    await loadDanhSachVongDau();

    await loadDanhSachHinhThucXepTranDau();
    await loadDanhSachGiaiDau_chon_viewbody();


    await viewTbody();


    btnLuuThayDoi.addEventListener("click", handleLuuThayDoi);
    btnTaiLaiTrang.addEventListener("click", handleTaiLaiTrang);

    button_xem_ds_trongTaiformInput.addEventListener("click", handleXemDanhSachTrongTai_formInput);
    button_xepLich.addEventListener("click", handleXepLich);

    // button_luu_danhSachTranDau.addEventListener("click", themDanhSachTranDau_vaoDaTa);

    maGiaiDau.addEventListener("change", async function () {
        console.log("Chọn giải đấu:", maGiaiDau.value);
        await loadDanhSachVongDau(maGiaiDau.value);
        await loadDanhSachSanVanDong(maGiaiDau.value);
        await loadDanhSachDoiBong_maDoi1_end(maGiaiDau.value);
        await loadDanhSachDoiBong_maDoi2_end(maGiaiDau.value);
    });
    // maDoi1.change

    // chon_hinhThuc_tao_tran.addEventListener("change", async function () {
    //     await thongBao_tonTaiTranDau();
    // });

    maGiaiDau_chon_viewbody.addEventListener("change", async function () {
        // console.log(maGiaiDau_chon_viewbody.value);
        // maVongDau_chon_viewbody.value = "All";
        await loadDanhSachVongDau_chon_viewbody(maGiaiDau_chon_viewbody.value);
        await viewTbody();
    });

    maVongDau_chon_viewbody.addEventListener("change", async function () {
        // let data = await hamChung.layDanhSach("tran_dau");
        // console.log(maVongDau_chon_viewbody.value);
        await viewTbody();
    });
});
async function handleXemDanhSachTrongTai_formInput(event) {
    event.preventDefault();
    console.log("Xem danh sách trọng tài cho trận đấu");
    const maTranDauValue = maTranDau.value;
    const container = danh_sach_trong_tai_tran_dau;
    container.innerHTML = ""; // Clear danh sách cũ
    console.log("Trận đấu ID:", maTranDauValue);

    if (maGiaiDau.value !== "" && maVongDau.value !== "" && maTranDauValue !== "") {
        console.log("Trận đấu ID:", maTranDauValue);
        const dataTrongTai = await hamChung.layDanhSach("trong_tai_tran_dau");
        const dataLoaiTrongTai = await hamChung.layDanhSach("loai_trong_tai");

        const dsTheoTran = dataTrongTai.filter(item => item.ma_tran_dau === maTranDauValue);

        for (const tt of dsTheoTran) {
            const thongTin = await hamChung.layThongTinTheo_ID("trong_tai", tt.ma_trong_tai);
            const hoTen = thongTin?.ho_ten || "Không rõ";

            const loai = dataLoaiTrongTai.find(loai => loai.ma_loai_trong_tai === tt.ma_loai_trong_tai);
            const tenLoai = loai?.ten_loai_trong_tai || "Không rõ vai trò";

            const p = document.createElement("p");
            p.innerHTML = `👤 <strong>${hoTen}</strong> — <em>${tenLoai}</em>`;
            container.appendChild(p);
        }

        modalXemTrongTai.style.display = "block";

        document.getElementById("thoat_xem_trong_tai").onclick = () => {
            modalXemTrongTai.style.display = "none";
        };
    }
}

async function handleLuuThayDoi(event) {
    event.preventDefault();
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    let formData = {
        ma_tran_dau: maTranDau.value,
        ma_giai_dau: maGiaiDau.value,
        ma_vong_dau: maVongDau.value,
        ma_doi_1: maDoi1.value,
        ma_doi_2: maDoi2.value,
        ma_doi_thang: maDoiThang.value,
        so_ban_doi_1: soBanDoi1.value,
        so_ban_doi_2: soBanDoi2.value,
        thoi_gian_dien_ra: thoiGianDienRa.value,
        ma_san: sanVanDong.value,
        trang_thai: trangThai.value,
        ghi_chu: ghiChu.value
    };
    if (soBanDoi1.value === "" || soBanDoi2.value === "") {
        // xóa khỏi formData
        delete formData.so_ban_doi_1;
        delete formData.so_ban_doi_2;
    }
    if (maDoiThang.value === "") {
        // xóa khỏi formData
        delete formData.ma_doi_thang;
    }
    console.log("Dữ liệu gửi đi:", formData);
    if (maTranDau.value === "") {
        formData.ma_tran_dau = await hamChung.taoID_theoBang("tran_dau");
        await hamChung.them(formData, "tran_dau");
        alert("Thêm thành công!");
    }
    else {
        await hamChung.sua(formData, "tran_dau");
        alert("Sửa thành công!");
    }


    // await viewTbody();
}
function handleTaiLaiTrang(event) {
    event.preventDefault();
    location.reload();
}

async function viewTbody(data) {
    viewTableBody(data, handleXemTrongTai, handleXemGhiChu, handleEdit, handleDelete);
}

////////// btn Xem trọng tài //////////
async function handleXemTrongTai(item) {
    const container = document.getElementById("trong_tai_select_container");
    container.innerHTML = "";

    // Lấy danh sách trọng tài đã phân cho trận này
    const dsPhanCongTrongTai = await hamChiTiet.danhSachTrongTai_theo_1tranDau(item.ma_tran_dau);

    // Lấy tất cả trọng tài thuộc giải đấu
    const danhSachTrongTai_theo_1GiaiDau = await hamChiTiet.danhSachTrongTai_theoGiai(item.ma_giai_dau);
    console.log("Danh sách trọng tài theo giải đấu:", danhSachTrongTai_theo_1GiaiDau);
    console.log("Danh sách phân công trọng tài cho trận đấu:", dsPhanCongTrongTai);

    // Lấy danh sách loại trọng tài (vai trò)
    const dataLoaiTrongTai = await hamChung.layDanhSach("loai_trong_tai");

    // Tạo danh sách chọn trọng tài theo giải (dsTrongTai)
    const dsTrongTai = await Promise.all(
        danhSachTrongTai_theo_1GiaiDau.map(async tt => {
            const thongTin = await hamChung.layThongTinTheo_ID("trong_tai", tt.ma_trong_tai);
            return {
                ma_trong_tai: tt.ma_trong_tai,
                ten_trong_tai: thongTin.ho_ten
            };
        })
    );

    // Hiển thị danh sách các trọng tài đã phân công cho trận đấu
    for (let i = 0; i < dsPhanCongTrongTai.length; i++) {
        const tt = dsPhanCongTrongTai[i];
        const dong = taoDongTrongTai(i, tt.ma_trong_tai, tt.ma_loai_trong_tai, dsTrongTai, dataLoaiTrongTai);
        container.appendChild(dong);
    }

    // Sự kiện thêm dòng trọng tài mới
    document.getElementById("bt_them_trong_tai").onclick = () => {
        const soDong = container.querySelectorAll(".trong-tai-row").length;
        const dongMoi = taoDongTrongTai(soDong, "", "", dsTrongTai, dataLoaiTrongTai);
        container.appendChild(dongMoi);
    };

    // Sự kiện xoá trọng tài
    container.addEventListener("click", (e) => {
        if (e.target.classList.contains("btn-xoa-trong-tai")) {
            e.target.closest(".trong-tai-row").remove();
        }
    });

    // Mở modal
    document.getElementById("modalSuaThongTai").style.display = "block";

    // Đóng modal
    document.getElementById("bt_dong_modal_tt").onclick = () => {
        document.getElementById("modalSuaThongTai").style.display = "none";
    };

    // Lưu dữ liệu khi submit
    document.getElementById("form_trong_tai_edit").onsubmit = async (e) => {
        e.preventDefault();

        const rows = document.querySelectorAll(".trong-tai-row");
        const danhSachTrongTai_new = Array.from(rows).map(row => ({
            ma_tran_dau: item.ma_tran_dau,
            ma_trong_tai: row.querySelector(".select-trong-tai").value,
            vai_tro: row.querySelector(".select-vai-tro").value
        })).filter(t => t.ma_trong_tai && t.vai_tro);

        console.log("Dữ liệu gửi đi:", danhSachTrongTai_new);
        await capNhatTrongTaiTranDau(item.ma_tran_dau, danhSachTrongTai_new);
        alert("Lưu thành công!");
    };
}

function taoDongTrongTai(index, ma_trong_tai, ma_loai_trong_tai, dsTrongTai, dsVaiTro) {
    const div = document.createElement("div");
    div.className = "mb-3 trong-tai-row";
    div.dataset.index = index;

    div.innerHTML = `
        <label><strong>Trọng tài #${index + 1}</strong></label>
        <div class="row align-items-center">
            <div class="col-md-5">
                <select class="form-select select-trong-tai" required>
                    ${dsTrongTai.map(t => `
                        <option value="${t.ma_trong_tai}" ${t.ma_trong_tai === ma_trong_tai ? "selected" : ""}>
                           ${t.ma_trong_tai} - ${t.ten_trong_tai}
                        </option>`).join("")}
                </select>
            </div>
            <div class="col-md-5">
                <select class="form-select select-vai-tro" required>
                    ${dsVaiTro.map(t => `
                        <option value="${t.ma_loai_trong_tai}" ${t.ma_loai_trong_tai === ma_loai_trong_tai ? "selected" : ""}>
                            ${t.ma_loai_trong_tai} - ${t.ten_loai_trong_tai}
                        </option>`).join("")}
                </select>
            </div>
            <div class="col-md-2">
                <button type="button" class="btn btn-danger btn-xoa-trong-tai">❌</button>
            </div>
        </div>
    `;
    return div;
}


async function capNhatTrongTaiTranDau(maTranDau, danhSachTrongTai_new) {

    const danhSachTrongTai_theo_1tranDau = await hamChiTiet.danhSachTrongTai_theo_1tranDau(maTranDau);
    console.log("Danh sách trọng tài theo trận đấu:", danhSachTrongTai_theo_1tranDau);
    console.log("Danh sách trọng tài mới:", danhSachTrongTai_new);
    for (const item of danhSachTrongTai_theo_1tranDau) {
        await hamChung.xoa({ ma_tran_dau: maTranDau, ma_trong_tai: item.ma_trong_tai }, "trong_tai_tran_dau");
    }
    for (const item of danhSachTrongTai_new) {
        console.log("Thêm trọng tài mới:", item);
        // try {
        await hamChung.them({
            ma_tran_dau: maTranDau,
            ma_trong_tai: item.ma_trong_tai,
            ma_loai_trong_tai: item.vai_tro
        }, "trong_tai_tran_dau");
    }
}


////////////////////        /////////

// async function handleXemTrongTai(item) {
//     const tranDauId = item.ma_tran_dau;
//     const modal = document.getElementById("modalSuaThongTai");
//     const form = document.getElementById("inputForm_trongTai");
//     // Nút hủy
//     const btnHuy = document.getElementById("bt_huy_luu_tt");
//     const btnLuu = document.getElementById("bt_luu_tt");
//     // Lấy dữ liệu trọng tài theo trận đấu
//     const dataTrongTai_tranDau = await hamChung.layDanhSach("trong_tai_tran_dau");
//     const dataTheoTran = dataTrongTai_tranDau.filter(tt => tt.ma_tran_dau === tranDauId);
//     console.log("Trận đấu ID:", dataTrongTai_tranDau);
//     console.log("Dữ liệu trọng tài theo trận đấu:", dataTheoTran);
//     const ttSelects = {
//         LT01: document.getElementById("tt_chinh"),
//         LT02: document.getElementById("tt_phu"),
//         LT03: document.getElementById("tt_ban"),
//         LT04: document.getElementById("tt_var"),
//     };

//     // Hiển thị modal
//     modal.style.display = "block";

//     // Load danh sách trọng tài vào các dropdown
//     for (const key in ttSelects) {
//         await loadDanhSachTrongTai(ttSelects[key].id, item.ma_giai_dau);
//         ttSelects[key].value = ""; // reset value
//     }


//     // Gán giá trị trọng tài đã được gán trước đó
//     dataTheoTran.forEach(tt => {
//         if (ttSelects[tt.ma_loai_trong_tai]) {
//             console.log(`Gán trọng tài ${tt.ma_trong_tai} cho loại ${tt.ma_loai_trong_tai}`);
//             ttSelects[tt.ma_loai_trong_tai].value = tt.ma_trong_tai;
//         }
//     });


//     btnHuy.onclick = () => {
//         modal.style.display = "none";
//     };


//     btnLuu.onclick = async (e) => {
//         e.preventDefault();
//         if (!form.checkValidity()) {
//             form.reportValidity();
//             return;
//         }
//         await them_danhSachTrongTaiMoi_theoTran(tranDauId);
//     };
// }

async function handleXemGhiChu(item) {
    thongBao.thongBao_error(`${item.ghi_chu || "---"}`,);
}

function handleEdit(item) {
    fillForm(item);
}

// sửa lại button_xoa đi
async function handleDelete(item) {
    if (confirm(`Bạn có chắc chắn muốn xóa trận đấu ${item.ma_tran_dau}?`)) {
        await hamChung.xoa({ ma_tran_dau: item.ma_tran_dau }, "tran_dau");
        form.reset();
        load_viewTbody();
    }
}

////////////////////// xếp lịch ////////////////////
async function handleXepLich(event) {
    event.preventDefault();
    await loadDanhSachGiaiDau_chon();
    const vongDauTruocDiv = document.getElementById("vongDauTruocContainer");
    const hinhThucTaoTran = chon_hinhThuc_tao_tran.value;
    if (hinhThucTaoTran === "chia-bang") {
        vongDauTruocDiv.style.display = "none";
    } else {
        vongDauTruocDiv.style.display = "block";
    }
    document.getElementById("popupOverlay").classList.remove("hidden");
    document.getElementById("closePopup").addEventListener("click", function () {
        document.getElementById("popupOverlay").classList.add("hidden");
    });
    maGiaiDau_chon.addEventListener("change", async function () {
        await thongBao_tonTaiTranDau();
        if (chon_hinhThuc_tao_tran.value === "chia-bang") {
            document.getElementById("danhSachBangContainer").style.display = "block";
            const danhSachBang = document.getElementById("danhSachBang");
            const data_bangDau = await hamChung.layDanhSach("bang_dau");
            const data_bangDau_giaiDau = data_bangDau.filter(item => item.ma_giai_dau === maGiaiDau_chon.value);
            const danhSachBangTen = data_bangDau_giaiDau.map(item => item.ten_bang_dâu);
            danhSachBang.innerHTML = '';
            danhSachBangTen.forEach(bang => {
                const li = document.createElement('li');
                li.textContent = bang;
                danhSachBang.appendChild(li);
            });
        }
        await handleSelectionChange();
    });
    maVongDau_chon.addEventListener("change", handleSelectionChange);
    chon_hinhThuc_tao_tran.addEventListener("change", async function () {
        const vongDauTruocDiv = document.getElementById("vongDauTruocContainer");
        const danhSachBangContainer = document.getElementById("danhSachBangContainer");
        if (chon_hinhThuc_tao_tran.value === "chia-bang") {
            vongDauTruocDiv.style.display = "none";
            danhSachBangContainer.style.display = "block";
        } else {
            vongDauTruocDiv.style.display = "block";
            danhSachBangContainer.style.display = "none";
        }
        await handleSelectionChange();
    });
    button_tao_tran.addEventListener("click", async function () {
        document.getElementById("popupOverlay").classList.add("disabled-overlay");
        const tbody = document.getElementById("bodyBangTaoTran");
        tbody.innerHTML = '';
        await taoTranDau(chon_hinhThuc_tao_tran.value);
    });
    button_chon_tat_ca.addEventListener("click", function () {
        const checkboxes = document.querySelectorAll('.checkbox-chon');
        checkboxes.forEach(checkbox => {
            checkbox.checked = true;
        });
    });
}
async function thongBao_tonTaiTranDau() {
    document.getElementById("thong_bao").innerText = "";
    if (chon_hinhThuc_tao_tran.value === "chia-bang") {
        const tonTai = await check_giaiDau_coTrong_tranDau(maGiaiDau_chon.value);
        if (tonTai) {
            document.getElementById("thong_bao").innerText = "Đã tồn tại trận đấu trong giải!";
        }
    }
}

async function check_giaiDau_coTrong_tranDau(ma_giai_dau) {
    const data_tranDau = await hamChung.layDanhSach("tran_dau");
    return data_tranDau.some(tranDau => tranDau.ma_giai_dau === ma_giai_dau);
}




async function taoTranDau(hinhThucTaoTran) {
    btnCloseBangTaoTran.addEventListener("click", function (event) {
        event.preventDefault();
        document.getElementById("bangTaoTran").classList.add("hidden");
        document.getElementById("popupOverlay").classList.remove("disabled-overlay");
    });
    console.log("Hình thức tạo trận đấu: " + hinhThucTaoTran);
    const maGiaiDau = maGiaiDau_chon.value;
    const dataSanVanDong = await hamChung.layDanhSach("san_van_dong");
    const danhSachSan = dataSanVanDong.map(item => item.ma_san);
    let bangDau_tranDau;
    if (hinhThucTaoTran === "chia-bang") {
        const data_bangDau = await hamChung.layDanhSach("bang_dau");
        const data_bangDau_giaiDau = data_bangDau.filter(item => item.ma_giai_dau === maGiaiDau);
        bangDau_tranDau = await hamChung.taoTranDau_chiaBang(getSelectedCheckboxes(), getSelectedCheckboxes_hatGiong(), data_bangDau_giaiDau, false);
        danhSach_doiBong_theoBang = bangDau_tranDau;
        let danhSachBang = "<ul>";
        for (let index = 0; index < bangDau_tranDau.bangs.length; index++) {
            const bang = bangDau_tranDau.bangs[index];
            if (bang && bang.bang && bang.bang.ten_bang_dau) {
                danhSachBang += `<li><strong>Bảng ${index + 1} (${bang.bang.ten_bang_dau}):</strong><ul>`;
                if (Array.isArray(bang.doi) && bang.doi.length > 0) {
                    for (let doiIndex = 0; doiIndex < bang.doi.length; doiIndex++) {
                        const doi = bang.doi[doiIndex];
                        const data1doi = await hamChung.layThongTinTheo_2_ID("doi_bong_giai_dau", doi, maGiaiDau);
                        danhSachBang += `<li>Đội ${doiIndex + 1}: ${data1doi.ten_doi_bong}</li>`;
                    }
                } else {
                    danhSachBang += `<li>Không có đội bóng trong bảng</li>`;
                }
                danhSachBang += "</ul></li>";
            } else {
                console.warn("Dữ liệu bảng không hợp lệ:", bang);
            }
        }
        danhSachBang += "</ul>";
        document.getElementById("danhSachDoiBong_theoBang").innerHTML = "Danh sách đội bóng theo bảng đấu" + danhSachBang;
    } else if (hinhThucTaoTran === "vong-tron" || hinhThucTaoTran === "loai-truc-tiep") {
        bangDau_tranDau = await hamChung.taoTranDau_chiaBang(getSelectedCheckboxes(), getSelectedCheckboxes_hatGiong(), "A", false);
        danhSach_doiBong_theoBang = bangDau_tranDau;
    }
    const danhSachDoiBong_theoBang = bangDau_tranDau.bangs;
    let danhSanhTranDau_theoBang;
    if (hinhThucTaoTran === "loai-truc-tiep") {
        danhSanhTranDau_theoBang = await taoTranDau_theo_loaiTrucTiep(danhSachDoiBong_theoBang);
    } else {
        danhSanhTranDau_theoBang = await taoTranDau_theoNhieuBang(danhSachDoiBong_theoBang);
    }
    const danhSachTranDau_theoBang_coNgayGio = await themNgayGioSan_choData(danhSanhTranDau_theoBang);
    const ngayBatDau = chon_ngayBatDau.value;
    const gioBatDau = chon_gioBatDau.value;
    const danhSach_LichThiDauTuDong = await taoLichThiDauTuDong(danhSachTranDau_theoBang_coNgayGio, ngayBatDau, gioBatDau, danhSachSan);
    if (hinhThucTaoTran === "loai-truc-tiep" && danhSach_LichThiDauTuDong[0].doi_duoc_mien) {
        const dataDoiDuocMien = await hamChung.layThongTinTheo_2_ID("doi_bong_giai_dau", danhSach_LichThiDauTuDong[0].doi_duoc_mien, maGiaiDau);
        document.getElementById("doi_duoc_mien_dau").value = "Đội được miễn đá : " + dataDoiDuocMien.ten_doi_bong;
        document.getElementById("wrap_doi_duoc_mien").style.display = "block";
    } else {
        document.getElementById("wrap_doi_duoc_mien").style.display = "none";
    }
    await view_danhSachTranDau_duocTao(danhSach_LichThiDauTuDong);
    chon_ngayBatDau.addEventListener("change", async function () {
        const ngayBatDau = chon_ngayBatDau.value;
        const gioBatDau = chon_gioBatDau.value;
        const danhSach_LichThiDauTuDong = await taoLichThiDauTuDong(danhSachTranDau_theoBang_coNgayGio, ngayBatDau, gioBatDau, danhSachSan);
        await view_danhSachTranDau_duocTao(danhSach_LichThiDauTuDong);
    });
    chon_gioBatDau.addEventListener("change", async function () {
        const ngayBatDau = chon_ngayBatDau.value;
        const gioBatDau = chon_gioBatDau.value;
        const danhSach_LichThiDauTuDong = await taoLichThiDauTuDong(danhSachTranDau_theoBang_coNgayGio, ngayBatDau, gioBatDau, danhSachSan);
        await view_danhSachTranDau_duocTao(danhSach_LichThiDauTuDong);
    });
    document.getElementById("bangTaoTran").classList.remove("hidden");
}

async function taoTranDau_theoNhieuBang(danhSachDoiBong_theoBang) {
    let danhSanhTranDau_theoBang = [];
    for (let i = 0; i < danhSachDoiBong_theoBang.length; i++) {
        const doi = danhSachDoiBong_theoBang[i].doi;
        const bang = danhSachDoiBong_theoBang[i].bang;
        const tranDau_xepTheoBang = await hamChung.taoTranDau_vongTron(doi);
        tranDau_xepTheoBang.bang = bang;
        danhSanhTranDau_theoBang.push(tranDau_xepTheoBang);
    }
    return danhSanhTranDau_theoBang;
}

async function taoTranDau_theo_loaiTrucTiep(danhSachDoiBong_theoBang) {
    let danhSanhTranDau_theoBang = [];
    for (let i = 0; i < danhSachDoiBong_theoBang.length; i++) {
        const doi = danhSachDoiBong_theoBang[i].doi;
        const bang = danhSachDoiBong_theoBang[i].bang;
        const tranDau_xepTheoBang = await hamChung.taoTranDau_loaiTrucTiep(doi);
        tranDau_xepTheoBang.bang = bang;
        danhSanhTranDau_theoBang.push(tranDau_xepTheoBang);
    }
    return danhSanhTranDau_theoBang;
}

async function themNgayGioSan_choData(danhSachTranDau_theoBang) {
    danhSachTranDau_theoBang.forEach((tran) => {
        tran.lich_thi_dau.forEach((lichThiDau) => {
            lichThiDau.ngay = lichThiDau.ngay || "";
            lichThiDau.gio = lichThiDau.gio || "";
            lichThiDau.san = lichThiDau.san || "";
        });
    });
    return danhSachTranDau_theoBang;
}

async function taoLichThiDauTuDong(danhSachTranDau_theoBang, ngayBatDau, gioBatDau, danhSachSan) {
    let currentDate = new Date(ngayBatDau);
    let currentTime = gioBatDau;
    let currentSanIndex = 0;
    danhSachTranDau_theoBang.forEach((bangData) => {
        const lichThiDau = bangData.lich_thi_dau;
        lichThiDau.forEach((tran, indexTran) => {
            tran.ngay = currentDate.toISOString().split('T')[0];
            tran.gio = currentTime;
            tran.san = danhSachSan[currentSanIndex] || "Chưa xác định";
            currentSanIndex = (currentSanIndex + 1) % danhSachSan.length;
            if (currentSanIndex === 0) {
                currentTime = incrementTime(currentTime, 2);
            }
        });
    });
    return danhSachTranDau_theoBang;
}

function incrementTime(time, soGioTangThem = 1) {
    let [hours, minutes] = time.split(':').map(Number);
    hours += soGioTangThem;
    if (hours >= 24) {
        hours = hours % 24;
    }
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

async function handleSelectionChange() {
    const maGiaiDau = maGiaiDau_chon.value;
    const maVongDau = maVongDau_chon.value;
    console.log("Giải đấu:", maGiaiDau);
    console.log("Vòng đấu:", maVongDau);
    const data_doiBongGiaiDau = await hamChung.layDanhSach("doi_bong_giai_dau");
    let data_doiBong_giaiDau;
    if (maGiaiDau !== "All") {
        if (maVongDau === "All" || chon_hinhThuc_tao_tran.value === "chia-bang") {
            data_doiBong_giaiDau = data_doiBongGiaiDau.filter(item => item.ma_giai_dau === maGiaiDau);
            await viewTbody_chon(data_doiBong_giaiDau);
        } else {
            const data11 = await lay_data_doiBong_vong_giaiDau(maGiaiDau, maVongDau);
            await viewTbody_chon(data11);
        }
    } else {
        const tableBody = document.getElementById("dataTable_chon").getElementsByTagName('tbody')[0];
        tableBody.innerHTML = "";
    }
}

async function lay_data_doiBong_vong_giaiDau(maGiaiDau, maVongDau) {
    const data_doiBongGiaiDau = await hamChung.layDanhSach("doi_bong_giai_dau");
    let dataDoiBongTrongVong = [];
    const dataTranDau = await hamChung.layDanhSach("tran_dau");
    const dataTranDau_theoVong = dataTranDau.filter(item => item.ma_vong_dau === maVongDau);
    const dataTranDau_theoVong_giaiDau = dataTranDau_theoVong.filter(item => item.ma_giai_dau === maGiaiDau);
    const danhSachMaDoiBong = [
        ...new Set(
            dataTranDau_theoVong_giaiDau.flatMap(item => [item.ma_doi_1, item.ma_doi_2])
        )
    ];
    for (let i = 0; i < danhSachMaDoiBong.length; i++) {
        const data = await hamChung.layThongTinTheo_2_ID("doi_bong_giai_dau", danhSachMaDoiBong[i], maGiaiDau);
        dataDoiBongTrongVong.push(data);
    }
    return dataDoiBongTrongVong;
}

function getSelectedCheckboxes() {
    const checkboxes = document.querySelectorAll('.checkbox-chon');
    const selectedTeams = [];
    checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
            selectedTeams.push(checkbox.value);
        }
    });
    return selectedTeams;
}

function getSelectedCheckboxes_hatGiong() {
    const checkboxes = document.querySelectorAll('.checkbox-hatGiong');
    const selectedTeams = [];
    checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
            selectedTeams.push(checkbox.value);
        }
    });
    return selectedTeams;
}

async function themDanhSachTranDau_vaoDaTa() {
    document.getElementById("bangTaoTran").classList.add("hidden");
    document.getElementById("popupOverlay").classList.remove("disabled-overlay");
    const tbody = document.getElementById("bodyBangTaoTran");
    const rows = tbody.querySelectorAll("tr");
    const ma_giai_dau = maGiaiDau_chon.value;
    let formData_so_batDongBo_index1 = {};
    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const cells = row.querySelectorAll("td");
        const ma_tran_dau = await hamChung.taoID_theoBang("tran_dau");
        const ma_doi_1 = cells[2]?.dataset.value?.trim();
        const ma_doi_2 = cells[3]?.dataset.value?.trim();
        const ngay_dien_ra = cells[4]?.querySelector("input")?.value || null;
        const gio_dien_ra_raw = cells[5]?.querySelector("input")?.value || null;
        const gio_dien_ra = gio_dien_ra_raw ? gio_dien_ra_raw + ":00" : null;
        const ma_san = cells[6]?.querySelector("select")?.value || null;
        const selectVong = cells[7]?.querySelector('select[data-field="vong"]');
        const ma_vong_dau = selectVong?.value || null;
        let formData = {
            ma_tran_dau: ma_tran_dau,
            ma_giai_dau: ma_giai_dau,
            ma_doi_1: ma_doi_1,
            ma_doi_2: ma_doi_2,
            ngay_dien_ra: ngay_dien_ra,
            gio_dien_ra: gio_dien_ra,
            ma_san: ma_san,
            ma_vong_dau: ma_vong_dau
        };
        console.log("index " + (i + 1));
        console.log("👉 Đang thêm trận:", formData);
        if (i !== 1) {
            await hamChung.them(formData, "tran_dau");
        } else {
            formData_so_batDongBo_index1 = formData;
        }
        console.log("✅ Thêm thành công:", formData);
    }
    if (Object.keys(formData_so_batDongBo_index1).length !== 0) {
        console.log("👉 Đang thêm trận them:", formData_so_batDongBo_index1);
        const ma_tran_dau_2 = await hamChung.taoID_theoBang("tran_dau");
        formData_so_batDongBo_index1.ma_tran_dau = ma_tran_dau_2;
    }
    if (chon_hinhThuc_tao_tran.value === "chia-bang") {
        await capNhat_bangDau_doi_bong_giai_dau(danhSach_doiBong_theoBang);
    }
    alert("Thêm trận đấu thành công!");
    await viewTbody();
}

async function capNhat_bangDau_doi_bong_giai_dau(danhSach_doiBong_theoBang) {
    const data = danhSach_doiBong_theoBang.bangs;
    for (const bang of data) {
        const ma_bang_dau = bang.bang.ma_bang_dau;
        const ma_giai_dau = bang.bang.ma_giai_dau;
        for (const doi of bang.doi) {
            const form_update_bang_cho_doiBongGiaiDau = {
                ma_bang_dau: ma_bang_dau,
                ma_giai_dau: ma_giai_dau,
                ma_doi_bong: doi
            };
            console.log(form_update_bang_cho_doiBongGiaiDau);
            await hamChung.sua(form_update_bang_cho_doiBongGiaiDau, "doi_bong_giai_dau");
        }
    }
}


