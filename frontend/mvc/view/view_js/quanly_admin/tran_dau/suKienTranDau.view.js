import hamChung from "/frontend/mvc/model/global/model.hamChung.js";
export function getElementIds() {
    return {
        btnLuuThayDoi: document.getElementById("button_luu"),
        btnTaiLaiTrang: document.getElementById("button_taiLaiTrang"),
        maSuKien: document.getElementById("maSuKien"),
        maGiaiDau: document.getElementById("maGiaiDau"),
        maTranDau: document.getElementById("maTranDau"),
        maDoiBong: document.getElementById("maDoiBong"),
        thoiDiem: document.getElementById("thoiDiem"),
        loaiSuKien: document.getElementById("loaiSuKien"),
        maCauThu: document.getElementById("maCauThu"),
        ghiChu: document.getElementById("ghiChu"),
        form: document.getElementById("inputForm"),


        maGiaiDau_chon_viewbody: document.getElementById("maGiaiDau_chon_viewbody"),
        //  maVongDau_chon_viewbody: document.getElementById("maVongDau_chon_viewbody"),
        maTranDau_chon_viewbody: document.getElementById("maTranDau_chon_viewbody"),
        tableBody: document.getElementById("dataTable"),
    };
}

export async function viewTbody(data, onEdit, onDelete) {
    const { tableBody } = getElementIds();
    console.log("viewTbody data", data);

    if (maGiaiDau_chon_viewbody.value !== "All") {
        let cmddata = [];
        for (const item of data) {
            const data1TranDau = await hamChung.layThongTinTheo_ID("tran_dau", item.ma_tran_dau);
            // nếu trận đấu đó thuộc giải đấu
            if (data1TranDau.ma_giai_dau === maGiaiDau_chon_viewbody.value) {
                cmddata.push(item);
            }
        }
        data = cmddata;
    }
    // if (maVongDau_chon_viewbody.value !== "All") {
    //     data = data.filter(item => item.ma_vong_dau === maVongDau_chon_viewbody.value);
    // }
    if (maTranDau_chon_viewbody.value !== "All") {
        data = data.filter(item => item.ma_tran_dau === maTranDau_chon_viewbody.value);
    }
    console.log("viewTbody data", data);

    tableBody.innerHTML = "";
    for (const item of data) {
        const tranDau = await hamChung.layThongTinTheo_ID("tran_dau", item.ma_tran_dau);
        const data1GiaiDau = await hamChung.layThongTinTheo_ID("giai_dau", tranDau.ma_giai_dau);
        const cauThu = await hamChung.layThongTinTheo_ID("cau_thu", item.ma_cau_thu);
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${data1GiaiDau?.ten_giai_dau || item.ma_giai_dau}</td>
            <td>${item.ma_su_kien}</td>
            <td>${tranDau?.ten_tran_dau || item.ma_tran_dau}</td>
            <td>${item.thoi_diem}</td>
            <td>${item.loai_su_kien}</td>
            <td>${cauThu?.ho_ten || item.ma_cau_thu}</td>
            <td>${item.ghi_chu || ""}</td>
            <td><button class="edit-btn btn btn-warning btn-sm">Sửa</button></td>
            <td><button class="delete-btn btn btn-danger btn-sm">Xóa</button></td>
        `;
        tableBody.appendChild(row);
        row.querySelector(".edit-btn").addEventListener("click", () => onEdit(item));
        row.querySelector(".delete-btn").addEventListener("click", () => onDelete(item));
    }
}

export async function fillForm(item) {
    const { maSuKien, maGiaiDau, maTranDau, maDoiBong, thoiDiem, loaiSuKien, maCauThu, ghiChu } = getElementIds();
    console.log("fillForm item", item);
    const data1TranDau = await hamChung.layThongTinTheo_ID("tran_dau", item.ma_tran_dau);
    const data1GiaiDau = await hamChung.layThongTinTheo_ID("giai_dau", data1TranDau.ma_giai_dau);
    // tìm cầu thủ thuộc đổi bóng nào trong mùa giải đó
    const data1CauThuGiaiDau = await hamChung.layThongTinTheo_2_ID("cau_thu_giai_dau", item.ma_cau_thu, data1GiaiDau.ma_giai_dau);
    const data1DoiBongGiaiDau = await hamChung.layThongTinTheo_2_ID("doi_bong_giai_dau", data1CauThuGiaiDau.ma_doi_bong, data1GiaiDau.ma_giai_dau);
    console.log("data1GiaiDau", data1CauThuGiaiDau);
    console.log("data1DoiBongGiaiDau", data1DoiBongGiaiDau);

    maSuKien.value = item.ma_su_kien;
    maGiaiDau.value = data1GiaiDau.ma_giai_dau;
    await loadDanhSachTranDau(data1GiaiDau.ma_giai_dau);
    await loadDanhSachDoiBong(data1TranDau.ma_tran_dau);
    maTranDau.value = item.ma_tran_dau;
    maDoiBong.value = data1DoiBongGiaiDau.ma_doi_bong;
    thoiDiem.value = item.thoi_diem;
    loaiSuKien.value = item.loai_su_kien;
    await loadDanhSachCauThu(data1DoiBongGiaiDau.ma_doi_bong, data1GiaiDau.ma_giai_dau);
    maCauThu.value = item.ma_cau_thu;
    ghiChu.value = item.ghi_chu || "";
    maSuKien.setAttribute("disabled", true);
    window.scrollTo({ top: 0, behavior: "smooth" });
}
export async function loadDanhSachGiaiDau(data) {
    const select = document.getElementById("maGiaiDau");
    select.innerHTML = '<option value="">--Chọn Giải Đấu--</option>';
    // const data = await hamChung.layDanhSach("maGiaiDau");
    data.forEach(item => {
        const option = document.createElement("option");
        option.value = item.ma_giai_dau;
        option.textContent = item.ten_giai_dau || item.ma_giai_dau;
        select.appendChild(option);
    });
}

export async function loadDanhSachTranDau(maGiaiDau) {
    const select = document.getElementById("maTranDau");
    select.innerHTML = '<option value="">--Chọn trận đấu--</option>';
    let data = await hamChung.layDanhSach("tran_dau");
    data = data.filter(item => item.ma_giai_dau === maGiaiDau);
    for (const item of data) {

        const option = document.createElement("option");
        let tenTranDau = "";
        const data1TranDau = await hamChung.layThongTinTheo_ID("tran_dau", item.ma_tran_dau);
        const dataDoi1 = await hamChung.layThongTinTheo_ID("doi_bong", data1TranDau.ma_doi_1);
        const dataDoi2 = await hamChung.layThongTinTheo_ID("doi_bong", data1TranDau.ma_doi_2);
        tenTranDau = `${dataDoi1?.ten_doi_bong} vs ${dataDoi2?.ten_doi_bong}`;
        if (data1TranDau) {
            option.value = item.ma_tran_dau;
            option.textContent = `${item.ma_tran_dau} : ${tenTranDau}`;
            select.appendChild(option);
        }
    }
}

export async function loadDanhSachCauThu(maDoiBong, maGiaiDau) {
    const select = document.getElementById("maCauThu");
    select.innerHTML = '<option value="">--Chọn cầu thủ--</option>';
    let data = await hamChung.layDanhSach("cau_thu_giai_dau");
    data = data.filter(item => item.ma_giai_dau === maGiaiDau);
    data = data.filter(item => item.ma_doi_bong === maDoiBong);

    data.forEach(item => {
        const option = document.createElement("option");
        option.value = item.ma_cau_thu;
        option.textContent = item.ho_ten || item.ma_cau_thu;
        select.appendChild(option);
    });
}
export async function loadDanhSachDoiBong(maTranDau) {
    const select = document.getElementById("maDoiBong");
    select.innerHTML = '<option value="">--Chọn đội bóng--</option>';
    const data1TranDau = await hamChung.layThongTinTheo_ID("tran_dau", maTranDau);
    const data_doiBong1_giaiDau = await hamChung.layThongTinTheo_ID("doi_bong", data1TranDau.ma_doi_1);
    const data_doiBong2_giaiDau = await hamChung.layThongTinTheo_ID("doi_bong", data1TranDau.ma_doi_2);
    if (data_doiBong1_giaiDau) {
        const option1 = document.createElement("option");
        option1.value = data_doiBong1_giaiDau.ma_doi_bong;
        option1.textContent = data_doiBong1_giaiDau.ten_doi_bong || data_doiBong1_giaiDau.ma_doi_bong;
        select.appendChild(option1);
    }
    if (data_doiBong2_giaiDau) {
        const option2 = document.createElement("option");
        option2.value = data_doiBong2_giaiDau.ma_doi_bong;
        option2.textContent = data_doiBong2_giaiDau.ten_doi_bong || data_doiBong2_giaiDau.ma_doi_bong;
        select.appendChild(option2);
    }
}
// Load danh sách giải đấu cho filter viewbody
export async function loadDanhSachGiaiDau_chon_viewbody(data) {
    const ids = getElementIds();
    //  const ds = await hamChung.layDanhSach("giai_dau");
    ids.maGiaiDau_chon_viewbody.innerHTML = `<option value="All">-- All --</option>`;
    data.forEach(item => {
        ids.maGiaiDau_chon_viewbody.innerHTML += `<option value="${item.ma_giai_dau}">${item.ten_giai_dau}</option>`;
    });
}

export async function loadDanhSachTranDau_chon_viewbody(maGiaiDau) {
    const ids = getElementIds();
    let data = await hamChung.layDanhSach("tran_dau");
    data = data.filter(item => item.ma_giai_dau === maGiaiDau);

    ids.maTranDau_chon_viewbody.innerHTML = `<option value="All">-- All --</option>`;
    data.forEach(item => {
        ids.maTranDau_chon_viewbody.innerHTML += `<option value="${item.ma_tran_dau}">${item.ma_tran_dau}</option>`;
    });


}