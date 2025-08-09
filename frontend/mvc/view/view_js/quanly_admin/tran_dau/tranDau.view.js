import hamChung from "/frontend/mvc/model/global/model.hamChung.js";
import FORM from "/frontend/mvc/controller/EditFormData.controller.js";
export function getElementIds() {
    return {
        btnLuuThayDoi: document.getElementById("button_luu"),
        btnTaiLaiTrang: document.getElementById("button_taiLaiTrang"),

        button_xepLich: document.getElementById("button_xepLich"),
        button_xem_ds_trongTaiformInput: document.getElementById("button_xem_ds_trongTaiformInput"),
        button_luu_danhSachTranDau: document.getElementById("bt_luuDanhSachTranDau_tuDong"),

        maGiaiDau: document.getElementById("maGiaiDau"),
        maVongDau: document.getElementById("maVongDau"),
        maTranDau: document.getElementById("maTranDau"),
        maDoi1: document.getElementById("maDoi1"),
        maDoi2: document.getElementById("maDoi2"),
        maDoiThang: document.getElementById("maDoiThang"),
        soBanDoi1: document.getElementById("soBanDoi1"),
        soBanDoi2: document.getElementById("soBanDoi2"),
        thoiGianDienRa: document.getElementById("thoiGianDienRa"),
        sanVanDong: document.getElementById("sanVanDong"),
        trangThai: document.getElementById("trangThai"),
        ghiChu: document.getElementById("ghiChu"),


        modalXemTrongTai: document.getElementById("modalXemTrongTai"),
        danh_sach_trong_tai_tran_dau: document.getElementById("danh_sach_trong_tai_tran_dau"),


        maGiaiDau_chon_viewbody: document.getElementById("maGiaiDau_chon_viewbody"),
        maVongDau_chon_viewbody: document.getElementById("maVongDau_chon_viewbody"),
        form: document.getElementById("inputForm"),

        chon_hinhThuc_tao_tran: document.getElementById("chon_hinhThuc_tao_tran"),
        maGiaiDau_chon: document.getElementById("maGiaiDau_chon"),
        maVongDau_chon: document.getElementById("maVongDau_chon"),
        chon_ngayBatDau: document.getElementById("chon_ngayBatDau"),
        chon_gioBatDau: document.getElementById("chon_gioBatDau"),
        chon_vongDau_cho_all_tran: document.getElementById("chon_vongDau_cho_all_tran"),

        button_tao_tran: document.getElementById("button_tao_tran"),
        button_chon_tat_ca: document.getElementById("button_chon_tat_ca"),
        btnCloseBangTaoTran: document.getElementById("btnCloseBangTaoTran"),
        tableBody: document.getElementById("dataTable")
    };
}

export async function viewTableBody(data, onXemTrongTai, onXemGhiChu, onEdit, onDelete) {
    const { tableBody, maGiaiDau_chon_viewbody, maVongDau_chon_viewbody } = getElementIds();
    // if (data === undefined || data == null) {
    //     data = await hamChung.layDanhSach("tran_dau");
    // }

    if (maGiaiDau_chon_viewbody.value !== "All" && maGiaiDau_chon_viewbody.value !== "") {
        data = data.filter(item => item.ma_giai_dau === maGiaiDau_chon_viewbody.value);
    }
    if (maVongDau_chon_viewbody.value !== "All" && maVongDau_chon_viewbody.value !== "") {
        data = data.filter(item => item.ma_vong_dau === maVongDau_chon_viewbody.value);
    }
    if (maGiaiDau_chon_viewbody.value === "All" && maVongDau_chon_viewbody.value === "All") {
        data = data.slice(0, 20);
    }
    tableBody.innerHTML = "";
    console.log("data doi bong view body ", data);
    for (let i = 0; i < data.length; i++) {
        const item = data[i];

        const row = document.createElement("tr");
        const data1GiaiDau = await hamChung.layThongTinTheo_ID("giai_dau", item.ma_giai_dau);

        //  await hamChung.layThongTinTheo_2_ID("doi_bong_giai_dau", item.ma_doi_bong, item.ma_giai_dau);
        console.log("data1GiaiDau", data1GiaiDau.ma_giai_dau);
        console.log("item", item);
        const db1 = await hamChung.layThongTinTheo_2_ID("doi_bong_giai_dau", item.ma_doi_1, item.ma_giai_dau);
        const db2 = await hamChung.layThongTinTheo_2_ID("doi_bong_giai_dau", item.ma_doi_2, item.ma_giai_dau);
        const dbWin = await hamChung.layThongTinTheo_2_ID("doi_bong_giai_dau", item.ma_doi_thang, item.ma_giai_dau);

        // const db1 = item.ma_doi_1;
        // const db2 = item.ma_doi_2;
        // const dbWin = item.ma_doi_thang;

        let tenDoi1 = "---";
        let tenDoi2 = "---";
        let tenDoiThang = "---";
        // let tenDoi1 = db1;
        // let tenDoi2 = db2;
        // let tenDoiThang = dbWin;

        if (db1 && db1.ten_doi_bong)
            tenDoi1 = db1.ten_doi_bong;
        else
            tenDoi1 = (await hamChung.layThongTinTheo_ID("doi_bong", item.ma_doi_1)).ten_doi_bong;


        if (db2 && db1.ten_doi_bong)
            tenDoi2 = db2.ten_doi_bong;
        else
            tenDoi2 = (await hamChung.layThongTinTheo_ID("doi_bong", item.ma_doi_2)).ten_doi_bong;


        if (dbWin && dbWin.ten_doi_bong) {
            tenDoiThang = dbWin.ten_doi_bong;
        }

        else if (item.ma_doi_thang) {
            tenDoiThang = (await hamChung.layThongTinTheo_ID("doi_bong", item.ma_doi_thang)).ten_doi_bong;
        }


        const dataVongDau = await hamChung.layThongTinTheo_ID("vong_dau", item.ma_vong_dau);
        const data1SVD = await hamChung.layThongTinTheo_ID("san_van_dong", item.ma_san);
        //  console.log(data[i]);
        row.innerHTML = `
            <td style="text-align: center;">${data1GiaiDau.ten_giai_dau}</td>
            <td style="text-align: center;">${dataVongDau.ten_vong_dau}</td>
            <td style="text-align: center;">${item.ma_tran_dau}</td>
            <td style="text-align: center;">${tenDoi1}</td>
            <td style="text-align: center;">${item.so_ban_doi_1}:${item.so_ban_doi_2}</td>
            <td style="text-align: center;">${tenDoi2}</td>
            <td style="text-align: center;">${tenDoiThang}</td>

            <td style="text-align: center;">${FORM.formatDateT_to_DateTime(item.thoi_gian_dien_ra)}</td>
            <td style="text-align: center;">${data1SVD.ten_san}</td>
            <td style="text-align: center;">${item.trang_thai}</td>

            <td style="text-align: center;"><button class="xemTrongTai-btn btn btn-warning btn-sm">Xem</button></td>
            <td style="text-align: center;"><button class="xemGhiChu-btn btn btn-warning btn-sm">Xem</button></td>
            <td style="text-align: center;"><button class="edit-btn btn-warning btn-sm">Sửa</button></td>
            <td style="text-align: center;"><button class="delete-btn btn btn-danger btn-sm">Xóa</button></td>
        `;
        tableBody.appendChild(row);

        row.querySelector(".xemTrongTai-btn").addEventListener("click", () => onXemTrongTai(item));
        row.querySelector(".xemGhiChu-btn").addEventListener("click", () => onXemGhiChu(item));
        row.querySelector(".edit-btn").addEventListener("click", () => onEdit(item));
        row.querySelector(".delete-btn").addEventListener("click", () => onDelete(item));
    }
}

export async function viewTbody_chon(data_doiBong_giaiDau,onXemGhiChu) {
    const tableBody = document.getElementById("dataTable_chon").getElementsByTagName('tbody')[0];
    tableBody.innerHTML = "";
    for (let i = 0; i < data_doiBong_giaiDau.length; i++) {
        const item = data_doiBong_giaiDau[i];
        let hinh_anh;
        // const data1NguoiDung = await hamChung.layThongTinTheo_ID("nguoi_dung", item.ma_ql_doi_bong);

        if (item.hinh_anh === null || item.hinh_anh === "") {
            // hinh_anh = "/frontend/assets/public/images/cat-2.png";
            hinh_anh = "/frontend/assets/public/images/user-icon.png";
            // C:\Users\vanti\Desktop\mvc_project\frontend\assets\public\images\cat-2.png
        } else {
            hinh_anh = await hamChung.getImage(item.hinh_anh);
        }

        const checked = item.hat_giong === "co" ? "checked" : "";
        const row = document.createElement("tr");
        const data1doiBongTrongGiai = await hamChung.layThongTinTheo_2_ID("doi_bong_giai_dau", item.ma_doi_bong, item.ma_giai_dau);
        row.innerHTML = `
            <td style="text-align: center;">
                <input type="checkbox" class="checkbox-chon" value="${item.ma_doi_bong}">
            </td>
            <td style="text-align: center;">
                <input type="checkbox" class="checkbox-hatGiong" value="${item.ma_doi_bong}" ${checked}>
            </td>
            <td style="text-align: center;">${data1doiBongTrongGiai.ten_doi_bong}</td>
            <td style="text-align: center;"><img src="${hinh_anh}" alt="Logo" width="50"></td>
            <td style="text-align: center;"><button class="xemGhiChu_chon-btn btn btn-warning btn-sm">Xem</button></td>
        `;
        tableBody.appendChild(row);
        row.querySelector(".xemGhiChu_chon-btn").addEventListener("click", () => onXemGhiChu(item));
    }
}

export async function view_danhSachTranDau_duocTao(danhSanhTranDau_theoBang) {
    console.log("danh sách trận được được tảo theo bảng ");
    console.log(danhSanhTranDau_theoBang);
    const tbody = document.getElementById("bodyBangTaoTran");
    const maGiaiDau = document.getElementById("maGiaiDau_chon");
    const chonVongDauDaDa = document.getElementById("maVongDau_chon");
    const hinhThucTaoTran = document.getElementById("chon_hinhThuc_tao_tran");
    const dataSanVanDong = await hamChung.layDanhSach("san_van_dong");
    const dataSanVanDong_theoGiai = dataSanVanDong.filter(item => item.ma_giai_dau === maGiaiDau.value);

    const dataVongDau = await hamChung.layDanhSach("vong_dau");
    const dataVongDau_theoGiai = dataVongDau.filter(item => item.ma_giai_dau === maGiaiDau.value);


    tbody.innerHTML = "";


    for (let i = 0; i < danhSanhTranDau_theoBang.length; i++) {
        const bangData = danhSanhTranDau_theoBang[i];
        const indexBang = i;
        const bang = bangData.bang;
        const lichThiDau = bangData.lich_thi_dau;
        for (let j = 0; j < lichThiDau.length; j++) {
            const tran = lichThiDau[j];
            const indexTran = j;
            const row = document.createElement("tr");
            //  await hamChung.layThongTinTheo_2_ID("doi_bong_giai_dau", item.ma_doi_bong, item.ma_giai_dau);
            const datadoi1_end = await hamChung.layThongTinTheo_2_ID("doi_bong_giai_dau", tran.doi1, maGiaiDau.value);
            const datadoi2_end = await hamChung.layThongTinTheo_2_ID("doi_bong_giai_dau", tran.doi2, maGiaiDau.value);
            const vongDau_chon = getElementIds().chon_vongDau_cho_all_tran.value;
            const data_1vongDau_chon = await hamChung.layThongTinTheo_ID("vong_dau", vongDau_chon);
            row.innerHTML = `
                <td>${bangData.bang.ten_bang_dau || '---'}</td>
                <td>${tran.tran}</td>
                <td data-value="${tran.doi1}">${datadoi1_end.ten_doi_bong}</td>
                <td data-value="${tran.doi2}">${datadoi2_end.ten_doi_bong}</td>
                <td><input type="date" value="${tran.ngay || ''}" data-field="ngay" data-index="${indexBang}-${indexTran}"></td>
                <td><input type="time" value="${tran.gio || ''}" data-field="gio" data-index="${indexBang}-${indexTran}"></td>
                <td>
                    <select data-field="san" data-index="${indexBang}-${indexTran}">
                        ${dataSanVanDong_theoGiai.map(san => `
                        <option value="${san.ma_san}" ${tran.san === san.ma_san ? 'selected' : ''}>
                            ${san.ma_san} - ${san.ten_san}
                        </option>
                        `).join('')}
                    </select>
                </td>

                <td>
                    <select data-field="vong" data-index="${indexBang}-${indexTran}" disabled>
                        ${dataVongDau_theoGiai.map(vong => `
                            <option value="${vong.ma_vong_dau}" ${vong.ma_vong_dau === data_1vongDau_chon.ma_vong_dau ? 'selected' : ''}>
                                ${vong.ten_vong_dau}
                            </option>
                        `).join('')}
                    </select>
                </td>
             

            `;

            tbody.appendChild(row);
        }
    }
}

export async function fillForm(item) {
    console.log("fillForm", item);
    const idS = getElementIds();
    await loadDanhSachDoiBong_maDoi1_end(item.ma_giai_dau);
    await loadDanhSachDoiBong_maDoi2_end(item.ma_giai_dau);
    await loadDanhSachSanVanDong(item.ma_giai_dau);
    await loadDanhSachVongDau(item.ma_giai_dau);

    idS.maGiaiDau.value = item.ma_giai_dau;
    idS.maVongDau.value = item.ma_vong_dau;
    idS.maTranDau.value = item.ma_tran_dau;
    idS.maDoi1.value = item.ma_doi_1;
    idS.maDoi2.value = item.ma_doi_2;
    await loadDanhSachDoiBong_maDoiThang_end(item.ma_giai_dau);
    idS.maDoiThang.value = item.ma_doi_thang;
    idS.soBanDoi1.value = item.so_ban_doi_1;
    idS.soBanDoi2.value = item.so_ban_doi_2;

    idS.thoiGianDienRa.value = item.thoi_gian_dien_ra;
    idS.sanVanDong.value = item.ma_san;
    idS.trangThai.value = item.trang_thai;
    idS.ghiChu.value = item.ghi_chu;
    window.scrollTo({ top: 0, behavior: "smooth" });
}

export async function loadDanhSachGiaiDau(data) {
    const selectElement = document.getElementById("maGiaiDau");
    selectElement.innerHTML = '<option value="">-- Chọn Giải Đấu --</option>';
    // const data = await hamChung.layDanhSach("giai_dau");
    data.forEach(item => {
        const option = document.createElement("option");
        option.value = item.ma_giai_dau;
        option.textContent = `${item.ten_giai_dau}`;
        selectElement.appendChild(option);
    });
}

export async function loadDanhSachDoiBong_maDoi1_end(maGiaiDau) {
    const selectElement = document.getElementById("maDoi1");
    selectElement.innerHTML = '<option value="">-- Chọn Đội 1 --</option>';
    const dataDoiBongGiaiDau = await hamChung.layDanhSach("doi_bong_giai_dau");
    let data = maGiaiDau ? dataDoiBongGiaiDau.filter(item => item.ma_giai_dau === maGiaiDau) : [];
    data.forEach(item => {
        const option = document.createElement("option");
        option.value = item.ma_doi_bong;
        option.textContent = `${item.ten_doi_bong}`;
        selectElement.appendChild(option);
    });
}

export async function loadDanhSachDoiBong_maDoi2_end(maGiaiDau) {
    const selectElement = document.getElementById("maDoi2");
    selectElement.innerHTML = '<option value="">-- Chọn Đội 2 --</option>';
    const dataDoiBongGiaiDau = await hamChung.layDanhSach("doi_bong_giai_dau");
    let data = maGiaiDau ? dataDoiBongGiaiDau.filter(item => item.ma_giai_dau === maGiaiDau) : [];
    data.forEach(item => {
        const option = document.createElement("option");
        option.value = item.ma_doi_bong;
        option.textContent = `${item.ten_doi_bong}`;
        selectElement.appendChild(option);
    });
}
export async function loadDanhSachDoiBong_maDoiThang_end(maGiaiDau) {
    const selectElement = document.getElementById("maDoiThang");
    const madoi1 = document.getElementById("maDoi1");
    const madoi2 = document.getElementById("maDoi2");
    selectElement.innerHTML = '<option value="">-- Chọn Đội Thắng --</option>';

    const data = await hamChung.layDanhSach("doi_bong_giai_dau");
    const ds = maGiaiDau ? data.filter(d => d.ma_giai_dau === maGiaiDau) : [];

    [madoi1.value, madoi2.value].forEach(val => {
        if (val) {
            const doi = ds.find(d => d.ma_doi_bong === val);
            if (doi) {
                const option = document.createElement("option");
                option.value = doi.ma_doi_bong;
                option.textContent = doi.ten_doi_bong;
                selectElement.appendChild(option);
            }
        }
    });
}


export async function loadDanhSachVongDau(maGiaiDau) {
    const selectElement = document.getElementById("maVongDau");
    selectElement.innerHTML = '<option value="">-- Chọn Vòng Đấu --</option>';
    const dataVongDau = await hamChung.layDanhSach("vong_dau");
    let data = maGiaiDau ? dataVongDau.filter(item => item.ma_giai_dau === maGiaiDau) : [];
    data.forEach(item => {
        const option = document.createElement("option");
        option.value = item.ma_vong_dau;
        option.textContent = `${item.ma_vong_dau} - ${item.ten_vong_dau}`;
        selectElement.appendChild(option);
    });
}

export async function loadDanhSachSanVanDong(maGiaiDau) {
    const selectElement = document.getElementById("sanVanDong");
    selectElement.innerHTML = '<option value="">-- Chọn Sân Vận Động --</option>';
    const dataSanBong = await hamChung.layDanhSach("san_van_dong");
    let data = maGiaiDau ? dataSanBong.filter(item => item.ma_giai_dau === maGiaiDau) : [];
    data.forEach(item => {
        const option = document.createElement("option");
        option.value = item.ma_san;
        option.textContent = `${item.ten_san}`;
        selectElement.appendChild(option);
    });
}

export async function loadDanhSachTrongTai(id, maGiaiDau) {
    const selectElement = document.getElementById(id);
    selectElement.innerHTML = '<option value="">-- Chọn--</option>';
    let data = await hamChung.layDanhSach("trong_tai");
    data = maGiaiDau ? data.filter(item => item.ma_giai_dau === maGiaiDau) : data;
    data.forEach(item => {
        const option = document.createElement("option");
        option.value = item.ma_trong_tai;
        option.textContent = `${item.ho_ten}`;
        selectElement.appendChild(option);
    });
}

export async function loadDanhSachHinhThucXepTranDau() {
    const selectElement = document.getElementById("chon_hinhThuc_tao_tran");
    selectElement.innerHTML = '';
    const data_tao = await hamChung.taoTranDau_getHinhThucTaoDoi();
    if (!data_tao) return;
    sessionStorage.setItem("hinh_thuc_tao_tran", JSON.stringify(data_tao));
    Object.entries(data_tao).forEach(([ten, duong_dan]) => {
        const option = document.createElement("option");
        option.value = ten;
        option.textContent = `${duong_dan.ten}`;
        selectElement.appendChild(option);
    });
}

export async function loadDanhSachGiaiDau_chon(data) {
    const selectElement = document.getElementById("maGiaiDau_chon");
    selectElement.innerHTML = '<option value="All">Tất Cả</option>';
    //   const data = await hamChung.layDanhSach("giai_dau");
    data.forEach(item => {
        const option = document.createElement("option");
        option.value = item.ma_giai_dau;
        option.textContent = `${item.ten_giai_dau}`;
        selectElement.appendChild(option);
    });
}
export async function loadDanhSachVongDau_chon(maGiaiDau) {
    const selectElement = document.getElementById("maVongDau_chon");
    selectElement.innerHTML = '<option value="All">Tất Cả</option>';
    let data = await hamChung.layDanhSach("vong_dau");
    data = maGiaiDau ? data.filter(item => item.ma_giai_dau === maGiaiDau) : data;
    data.forEach(item => {
        const option = document.createElement("option");
        option.value = item.ma_vong_dau;
        option.textContent = `${item.ten_vong_dau}`;
        selectElement.appendChild(option);
    });
}
export async function loadDanhSachVongDau_cho_all_tran(maGiaiDau) {
    const selectElement = document.getElementById("chon_vongDau_cho_all_tran");
    selectElement.innerHTML = '';
    let data = await hamChung.layDanhSach("vong_dau");
    data = data.filter(item => item.ma_giai_dau === maGiaiDau);
    data.forEach(item => {
        const option = document.createElement("option");
        option.value = item.ma_vong_dau;
        option.textContent = `${item.ten_vong_dau}`;
        selectElement.appendChild(option);
    });
}
export async function loadDanhSachGiaiDau_chon_viewbody(data) {
    const selectElement = document.getElementById("maGiaiDau_chon_viewbody");
    selectElement.innerHTML = '<option value="All">Tất Cả</option>';
    // const data = await hamChung.layDanhSach("giai_dau");
    data.forEach(item => {
        const option = document.createElement("option");
        option.value = item.ma_giai_dau;
        option.textContent = `${item.ten_giai_dau}`;
        selectElement.appendChild(option);
    });
}

export async function loadDanhSachVongDau_chon_viewbody(maGiaiDau) {
    const selectElement = document.getElementById("maVongDau_chon_viewbody");
    selectElement.innerHTML = '<option value="All">Tất Cả</option>';
    let data = await hamChung.layDanhSach("vong_dau");
    data = maGiaiDau ? data.filter(item => item.ma_giai_dau === maGiaiDau) : data;
    data.forEach(item => {
        const option = document.createElement("option");
        option.value = item.ma_vong_dau;
        option.textContent = `${item.ten_vong_dau}`;
        selectElement.appendChild(option);
    });
}

