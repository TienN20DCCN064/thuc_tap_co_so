import hamChung from "/frontend/mvc/model/global/model.hamChung.js";
export function getElementIds() {
    return {
        btnLuuThayDoi: document.getElementById("button_luu"),
        btnTaiLaiTrang: document.getElementById("button_taiLaiTrang"),
        maGiaiDau: document.getElementById("maGiaiDau"),
        maBangDau: document.getElementById("maBangDau"),
        maDoiBong: document.getElementById("maDoiBong"),
        madiem: document.getElementById("diem"),
        ghiChu: document.getElementById("ghiChu"),
        
        chon_GiaiDau: document.getElementById("maGiaiDau_chon"),
        chon_bangDau: document.getElementById("maBangDau_chon"),
    };
}
export async function viewTbody(ma_giai_dau, ma_bang_dau) {
    let data = await hamChung.layDanhSach("doi_bong_giai_dau");
    if (ma_giai_dau) {
        data = data.filter(item => item.ma_giai_dau === ma_giai_dau);
    }
    if (ma_bang_dau) {
        data = data.filter(item => item.ma_bang_dau === ma_bang_dau);
    }
    data = sapXep_danhDanh_bangXepHang_theoDiem(data);

    const tableBody = document.getElementById("dataTable");
    tableBody.innerHTML = "";

    for (let i = 0; i < data.length; i++) {
        const item = data[i];
        const data1giaiDau = await hamChung.layThongTinTheo_ID("giai_dau", item.ma_giai_dau);
        const data1doiBong_giaiDau = await hamChung.layThongTinTheo_2_ID("doi_bong_giai_dau", item.ma_doi_bong, item.ma_giai_dau);
        let tenBangDau = "---";
        if (item.ma_bang_dau) {
            const data1bangDau = await hamChung.layThongTinTheo_ID("bang_dau", item.ma_bang_dau);
            tenBangDau = data1bangDau.ten_bang_dau;
        }
        const data_demThongSo = await tinhSoTran_hinhThucKetQua_theo_doiBongGiaiDau(item.ma_doi_bong, item.ma_giai_dau, "V1");
        const row = document.createElement("tr");
        row.innerHTML = `
            <td style="text-align: center;">${data1giaiDau.ten_giai_dau}</td>
            <td style="text-align: center;">${tenBangDau}</td>
            <td style="text-align: center;">${data1doiBong_giaiDau.ten_doi_bong}</td>
            <td style="text-align: center;">${data_demThongSo.soTranThang}</td>
            <td style="text-align: center;">${data_demThongSo.soTranHoa}</td>
            <td style="text-align: center;">${data_demThongSo.soTranThua}</td>
            <td style="text-align: center;">${data_demThongSo.soBanThang}</td>
            <td style="text-align: center;">${data_demThongSo.soBanThua}</td>
            <td style="text-align: center;">${item.diem_vong_loai}</td>
            <td style="text-align: center;"><button class="edit-btn btn btn-warning btn-sm">Sửa</button></td>
        `;
        tableBody.appendChild(row);
    }
    button_sua(data);
}

export function button_sua(dataChung) {
    document.querySelectorAll(".edit-btn").forEach((btn, index) => {
        btn.addEventListener("click", async () => {
            document.getElementById("maGiaiDau").disabled = true;
            document.getElementById("maDoiBong").disabled = true;
            const item = dataChung[index];
            if (item.ma_bang_dau) {
                document.getElementById("maBangDau").disabled = true;
            }
            const tttt = await hamChung.layThongTinTheo_ID("giai_dau", item.ma_giai_dau);
            await loadDanhSachGiaiDau();
            await loadDanhSachBangDau(tttt.ma_giai_dau);
            document.getElementById("maGiaiDau").value = tttt.ma_giai_dau;
            document.getElementById("maBangDau").value = item.ma_bang_dau;
            await loadDanhSachDoiBong_theoBangDau(document.getElementById("maGiaiDau").value, document.getElementById("maBangDau").value);
            document.getElementById("maDoiBong").value = item.ma_doi_bong;
            document.getElementById("diem").value = item.diem_vong_loai;
            document.getElementById("ghiChu").value = item.ghi_chu;
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    });
}

export function sapXep_danhDanh_bangXepHang_theoDiem(data) {
    return data.sort((a, b) => b.diem_vong_loai - a.diem_vong_loai);
}

export async function loadDanhSachGiaiDau() {
    const selectElement = document.getElementById("maGiaiDau");
    selectElement.innerHTML = '<option value="">-- All giải --</option>';
    const data = await hamChung.layDanhSach("giai_dau");
    data.forEach(item => {
        const option = document.createElement("option");
        option.value = item.ma_giai_dau;
        option.textContent = `${item.ten_giai_dau}`;
        selectElement.appendChild(option);
    });
}
export async function loadDanhSachBangDau(maGiaiDau) {
    const selectElement = document.getElementById("maBangDau");
    selectElement.innerHTML = '<option value="">-- All bảng --</option>';
    const data = await hamChung.layDanhSach("bang_dau");
    const dataBangDau_theo_maGiaiDau = data.filter(item => item.ma_giai_dau === maGiaiDau);
    dataBangDau_theo_maGiaiDau.forEach(item => {
        const option = document.createElement("option");
        option.value = item.ma_bang_dau;
        option.textContent = `${item.ten_bang_dau}`;
        selectElement.appendChild(option);
    });
}
export async function loadDanhSachDoiBong_theoBangDau(maGiaiDau, maBangDau) {
    const selectElement = document.getElementById("maDoiBong");
    selectElement.innerHTML = '<option value="">-- All đội bóng --</option>';
    const dataDBGD = await hamChung.layDanhSach("doi_bong_giai_dau");
    const dataTheoGiaiDau = dataDBGD.filter(item => item.ma_giai_dau === maGiaiDau);
    let data = dataTheoGiaiDau;
    if (maBangDau) {
        data = data.filter(item => item.ma_bang_dau === maBangDau);
    }
    for (let i = 0; i < data.length; i++) {
        const item = data[i];
        const option = document.createElement("option");
        option.value = item.ma_doi_bong;
        option.textContent = `${item.ten_doi_bong}`;
        selectElement.appendChild(option);
    }
}
export async function loadDanhSachGiaiDau_chon() {
    const selectElement = document.getElementById("maGiaiDau_chon");
    selectElement.innerHTML = '<option value="">-- All giải --</option>';
    const data = await hamChung.layDanhSach("giai_dau");
    data.forEach(item => {
        const option = document.createElement("option");
        option.value = item.ma_giai_dau;
        option.textContent = `${item.ten_giai_dau}`;
        selectElement.appendChild(option);
    });
}
export async function loadDanhSachBangDau_1GiaiDau(ma_giai_dau) {
    const selectElement = document.getElementById("maBangDau_chon");
    selectElement.innerHTML = '<option value="">-- All bảng --</option>';
    let data = await hamChung.layDanhSach("bang_dau");
    if (ma_giai_dau) {
        data = data.filter(item => item.ma_giai_dau == ma_giai_dau);
    }
    data.forEach(item => {
        const option = document.createElement("option");
        option.value = item.ma_bang_dau;
        option.textContent = `${item.ten_bang_dau}`;
        selectElement.appendChild(option);
    });
}
export async function tinhSoTran_hinhThucKetQua_theo_doiBongGiaiDau(maDoiBong, maGiaiDau, maVongDau) {
    const datatran_dau = await hamChung.layDanhSach("tran_dau");
    const dataket_qua_tran_dau = await hamChung.layDanhSach("ket_qua_tran_dau");
    const datatran_dau_theo_vongDau_GiaiDau = datatran_dau.filter(item => item.ma_giai_dau === maGiaiDau && item.ma_vong_dau === maVongDau);
    const maTranDauList_theoVD_GD = datatran_dau_theo_vongDau_GiaiDau.map(item => item.ma_tran_dau);
    const dataket_qua_tran_dau_theo_vongDau_GiaiDau = dataket_qua_tran_dau.filter(item => maTranDauList_theoVD_GD.includes(item.ma_tran_dau));
    let form = { soTranThang: 0, soTranHoa: 0, soTranThua: 0, soBanThang: 0, soBanThua: 0 };
    for (let i = 0; i < dataket_qua_tran_dau_theo_vongDau_GiaiDau.length; i++) {
        let dataXet = dataket_qua_tran_dau_theo_vongDau_GiaiDau[i];
        if (dataXet.ma_doi_thang === maDoiBong) {
            form.soTranThang += 1;
        } else if (dataXet.ma_doi_thang === null) {
            const data1tranDau = await hamChung.layThongTinTheo_ID("tran_dau", dataXet.ma_tran_dau);
            if (data1tranDau.ma_doi_1 === maDoiBong || data1tranDau.ma_doi_2 === maDoiBong) {
                form.soTranHoa += 1;
            }
        } else {
            const dataTranDau_xet = await hamChung.layThongTinTheo_ID("tran_dau", dataXet.ma_tran_dau);
            if (dataTranDau_xet.ma_doi_1 === maDoiBong || dataTranDau_xet.ma_doi_2 === maDoiBong) {
                form.soTranThua += 1;
            }
        }
        if (dataXet.ma_doi_thang === maDoiBong) {
            const data1kqtranDau = await hamChung.layThongTinTheo_ID("ket_qua_tran_dau", dataXet.ma_tran_dau);
            let soBanLonHon = data1kqtranDau.so_ban_doi_1;
            if (data1kqtranDau.so_ban_doi_1 < data1kqtranDau.so_ban_doi_2) {
                soBanLonHon = data1kqtranDau.so_ban_doi_2;
            }
            form.soBanThang += soBanLonHon;
        } else {
            if (dataXet.ma_doi_thang === null) {
                const data1tranDau = await hamChung.layThongTinTheo_ID("tran_dau", dataXet.ma_tran_dau);
                if (data1tranDau.ma_doi_1 === maDoiBong || data1tranDau.ma_doi_2 === maDoiBong) {
                    const data1kqtranDau = await hamChung.layThongTinTheo_ID("ket_qua_tran_dau", dataXet.ma_tran_dau);
                    let soBanBeNhat = data1kqtranDau.so_ban_doi_1;
                    if (data1kqtranDau.so_ban_doi_1 > data1kqtranDau.so_ban_doi_2) {
                        soBanBeNhat = data1kqtranDau.so_ban_doi_2;
                    }
                    form.soBanThua += soBanBeNhat;
                    if (data1kqtranDau.so_ban_doi_1 === data1kqtranDau.so_ban_doi_2) {
                        form.soBanThang += soBanBeNhat;
                        form.soBanThua += soBanBeNhat;
                    }
                }
            }
        }
    }
    return form;
}