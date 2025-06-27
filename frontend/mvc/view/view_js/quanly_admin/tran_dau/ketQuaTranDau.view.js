export function getElementIds() {
    return {
        btnLuuThayDoi: document.getElementById("button_luu"),
        btnTaiLaiTrang: document.getElementById("button_taiLaiTrang"),
        maGiaiDau: document.getElementById("maGiaiDau"),
        maTranDau: document.getElementById("maTranDau"),
        soBanDoi1: document.getElementById("soBanDoi1"),
        soBanDoi2: document.getElementById("soBanDoi2"),
        maDoiThang: document.getElementById("maDoiThang"),
        ghiChu: document.getElementById("ghiChu"),
        maGiaiDau_chon_viewbody: document.getElementById("maGiaiDau_chon_viewbody"),
        form: document.getElementById("inputForm"),
        tableBody: document.getElementById("dataTable"),
    };
}

export async function viewTbody(data, hamChung, filter, onEdit, onDelete) {
    const { tableBody, maGiaiDau_chon_viewbody } = getElementIds();
    let dataLoc = data;
    if (maGiaiDau_chon_viewbody && maGiaiDau_chon_viewbody.value !== "All") {
        dataLoc = [];
        for (const item of data) {
            const giaiDau = await hamChung.layThongTinTheo_ID("tran_dau", item.ma_tran_dau);
            if (giaiDau.ma_giai_dau === maGiaiDau_chon_viewbody.value) {
                dataLoc.push(item);
            }
        }
    }
    tableBody.innerHTML = "";
    for (const item of dataLoc) {
        const lay1TranDau = await hamChung.layThongTinTheo_ID("tran_dau", item.ma_tran_dau);
        const lay1giaiDau = await hamChung.layThongTinTheo_ID("giai_dau", lay1TranDau.ma_giai_dau);
        let ten_doi_bong = "---";
        if (item.ma_doi_thang) {
            const lay1doiBong = await hamChung.layThongTinTheo_2_ID("doi_bong_giai_dau", item.ma_doi_thang, lay1TranDau.ma_giai_dau);
            ten_doi_bong = lay1doiBong.ten_doi_bong;
        }
        const row = document.createElement("tr");
        row.innerHTML = `
            <td style="text-align: center;">${lay1giaiDau.ten_giai_dau ?? "----"}</td>
            <td style="text-align: center;">${item.ma_tran_dau ?? "----"}</td>
            <td style="text-align: center;">${ten_doi_bong}</td>
            <td style="text-align: center;">${item.so_ban_doi_1 ?? "----"}</td>
            <td style="text-align: center;">${item.so_ban_doi_2 ?? "----"}</td>
            <td style="text-align: center;">${item.ghi_chu ?? "----"}</td>
            <td style="text-align: center;"><button class="edit-btn btn btn-warning btn-sm">Sửa</button></td>
            <td style="text-align: center;"><button class="delete-btn btn btn-danger btn-sm">Xóa</button></td>
        `;
        tableBody.appendChild(row);

        row.querySelector(".edit-btn").addEventListener("click", () => onEdit(item));
        row.querySelector(".delete-btn").addEventListener("click", () => onDelete(item));
    }
}

export function fillForm(item, hamChung) {
    const { maGiaiDau, maTranDau, soBanDoi1, soBanDoi2, maDoiThang, ghiChu } = getElementIds();
    // Cần load lại danh sách trận đấu và đội thắng nếu cần
    maTranDau.value = item.ma_tran_dau;
    soBanDoi1.value = item.so_ban_doi_1;
    soBanDoi2.value = item.so_ban_doi_2;
    maDoiThang.value = item.ma_doi_thang;
    ghiChu.value = item.ghi_chu || "";
    // Nếu cần, load lại các select option ở đây
    window.scrollTo({ top: 0, behavior: "smooth" });
}

export async function loadDanhSachGiaiDau(hamChung) {
    const selectElement = document.getElementById("maGiaiDau");
    selectElement.innerHTML = '<option value="">-- Chọn Giải Đấu --</option>';
    const data = await hamChung.layDanhSach("giai_dau");
    data.forEach(item => {
        const option = document.createElement("option");
        option.value = item.ma_giai_dau;
        option.textContent = `${item.ten_giai_dau}`;
        selectElement.appendChild(option);
    });
}

export async function loadDanhSachTranDau_chua_co_kq(hamChung, maGiaiDau) {
    const selectElement = document.getElementById("maTranDau");
    selectElement.innerHTML = '<option value="">-- Chọn Trận Đấu --</option>';
    const dataTranDau = await hamChung.layDanhSach("tran_dau");
    const layDanhSach_kqTranDau = await hamChung.layDanhSach("ket_qua_tran_dau");
    const tranDauChuaKetQua = dataTranDau
        .filter(item => item.ma_giai_dau === maGiaiDau)
        .filter(item => !layDanhSach_kqTranDau.some(kq => kq.ma_tran_dau === item.ma_tran_dau));
    for (const item of tranDauChuaKetQua) {
        const doi1 = await hamChung.layThongTinTheo_2_ID("doi_bong_giai_dau", item.ma_doi_1, item.ma_giai_dau);
        const doi2 = await hamChung.layThongTinTheo_2_ID("doi_bong_giai_dau", item.ma_doi_2, item.ma_giai_dau);
        const option = document.createElement("option");
        option.value = item.ma_tran_dau;
        option.textContent = `${item.ma_tran_dau} - ${doi1.ten_doi_bong} - ${doi2.ten_doi_bong}`;
        selectElement.appendChild(option);
    }
}

export async function loadDanhSachDoiBongThamGia(hamChung, maTranDau) {
    const selectElement = document.getElementById("maDoiThang");
    selectElement.innerHTML = '<option value="">-- Chọn Đội Thắng --</option>';
    const dataTranDau = await hamChung.layThongTinTheo_ID("tran_dau", maTranDau);
    if (dataTranDau) {
        const { ma_doi_1, ma_doi_2 } = dataTranDau;
        const doi1 = await hamChung.layThongTinTheo_2_ID("doi_bong_giai_dau", ma_doi_1, dataTranDau.ma_giai_dau);
        const doi2 = await hamChung.layThongTinTheo_2_ID("doi_bong_giai_dau", ma_doi_2, dataTranDau.ma_giai_dau);
        selectElement.appendChild(new Option(doi1?.ten_doi_bong || `Đội ${ma_doi_1}`, ma_doi_1));
        selectElement.appendChild(new Option(doi2?.ten_doi_bong || `Đội ${ma_doi_2}`, ma_doi_2));
    }
}

export async function loadDanhSachGiaiDau_chon_viewbody(hamChung) {
    const selectElement = document.getElementById("maGiaiDau_chon_viewbody");
    selectElement.innerHTML = '<option value="All">Tất Cả</option>';
    const data = await hamChung.layDanhSach("giai_dau");
    data.forEach(item => {
        const option = document.createElement("option");
        option.value = item.ma_giai_dau;
        option.textContent = `${item.ten_giai_dau}`;
        selectElement.appendChild(option);
    });
}