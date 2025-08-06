import hamChung from "/frontend/mvc/model/global/model.hamChung.js";
export function getElementIds() {
    return {
        btnLuuThayDoi: document.getElementById("button_luu"),
        btnTaiLaiTrang: document.getElementById("button_taiLaiTrang"),
        maGiaiDau: document.getElementById("maGiaiDau"),
        maVongDau: document.getElementById("maVongDau"),
        diemThang: document.getElementById("diemThang"),
        diemHoa: document.getElementById("diemHoa"),
        diemThua: document.getElementById("diemThua"),
        banThang: document.getElementById("banThang"),
        truTheVang: document.getElementById("truTheVang"),
        truTheDo: document.getElementById("truTheDo"),

        ghiChu: document.getElementById("ghiChu"),
        maGiaiDau_chon_viewbody: document.getElementById("maGiaiDau_chon_viewbody"),
        maVongDau_chon_viewbody: document.getElementById("maVongDau_chon_viewbody"),
        maGiaiDau_chon_BXH: document.getElementById("maGiaiDau_chon_BXH"),
        maVongDau_chon_BXH: document.getElementById("maVongDau_chon_BXH"),
        dataTable_chon_BXH: document.getElementById("dataTable_chon_BXH"),

        diemThang_BXH: document.getElementById("diemThang_BXH"),
        diemHoa_BXH: document.getElementById("diemHoa_BXH"),
        diemThua_BXH: document.getElementById("diemThua_BXH"),
        diemBanThang_BXH: document.getElementById("diemBanThang_BXH"),
        truTheVang_BXH: document.getElementById("truTheVang_BXH"),
        truTheDo_BXH: document.getElementById("truTheDo_BXH"),



        form: document.getElementById("inputForm"),
        tableBody: document.getElementById("dataTable"),
    };
}

export async function viewTbody(data, xemBXH, onEdit, onDelete) {
    const { tableBody } = getElementIds();

    if (maGiaiDau_chon_viewbody.value !== "All") {
        data = data.filter(item => item.ma_giai_dau === maGiaiDau_chon_viewbody.value);
    }
    if (maVongDau_chon_viewbody.value !== "All") {
        data = data.filter(item => item.ma_vong_dau === maVongDau_chon_viewbody.value);
    }

    tableBody.innerHTML = "";
    for (const item of data) {
        const giaiDau = await hamChung.layThongTinTheo_ID("giai_dau", item.ma_giai_dau);
        const vongDau = await hamChung.layThongTinTheo_ID("vong_dau", item.ma_vong_dau);
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${giaiDau?.ten_giai_dau || "---"}</td>
            <td>${vongDau?.ten_vong_dau || "---"}</td>
            <td>${item.diem_thang}</td>
            <td>${item.diem_hoa}</td>
            <td>${item.diem_thua}</td>
            <td>${item.diem_ban_thang}</td>
            <td>${item.tru_the_vang}</td>
            <td>${item.tru_the_do}</td>
            <td>${item.ghi_chu || ""}</td>
            <td><button class="view-btn btn btn-info btn-sm">Xem BXH</button></td>
            <td><button class="edit-btn btn btn-warning btn-sm">Sửa</button></td>
            <td><button class="delete-btn btn btn-danger btn-sm">Xóa</button></td>
        `;
        tableBody.appendChild(row);
        row.querySelector(".view-btn").addEventListener("click", () => xemBXH(item));
        row.querySelector(".edit-btn").addEventListener("click", () => onEdit(item));
        row.querySelector(".delete-btn").addEventListener("click", () => onDelete(item));
    }
}

export async function fillForm(item) {
    const { maGiaiDau, maVongDau, diemThang, diemHoa, diemThua, banThang, truTheVang, truTheDo, ghiChu } = getElementIds();
    maGiaiDau.value = item.ma_giai_dau;
    await loadDanhSachVongDau(maGiaiDau.value);
    maVongDau.value = item.ma_vong_dau;
    diemThang.value = item.diem_thang;
    diemHoa.value = item.diem_hoa;
    diemThua.value = item.diem_thua;
    banThang.value = item.diem_ban_thang;
    truTheVang.value = item.tru_the_vang;
    truTheDo.value = item.tru_the_do;
    ghiChu.value = item.ghi_chu || "";
    maGiaiDau.setAttribute("disabled", true);
    maVongDau.setAttribute("disabled", true);
    window.scrollTo({ top: 0, behavior: "smooth" });
}


export async function loadDanhSachGiaiDau(data) {
    const selectElement = document.getElementById("maGiaiDau");
    selectElement.innerHTML = '<option value="">-- Chọn giải đấu --</option>';
    // const data = await hamChung.layDanhSach("giai_dau");
    data.forEach(item => {
        const option = document.createElement("option");
        option.value = item.ma_giai_dau;
        option.textContent = item.ten_giai_dau;
        selectElement.appendChild(option);
    });
}

export async function loadDanhSachVongDau(maGiaiDau) {
    const selectElement = document.getElementById("maVongDau");
    selectElement.innerHTML = '<option value="">-- Chọn vòng đấu --</option>';
    let data = await hamChung.layDanhSach("vong_dau");
    data = data.filter(item => item.ma_giai_dau === maGiaiDau);
    data.forEach(item => {
        const option = document.createElement("option");
        option.value = item.ma_vong_dau;
        option.textContent = item.ten_vong_dau;
        selectElement.appendChild(option);
    });
}


export async function loadDanhSachGiaiDau_chon_viewbody(data) {
    const selectElement = document.getElementById("maGiaiDau_chon_viewbody");
    selectElement.innerHTML = '<option value="All">-- Chọn giải đấu --</option>';
    // const data = await hamChung.layDanhSach("giai_dau");
    data.forEach(item => {
        const option = document.createElement("option");
        option.value = item.ma_giai_dau;
        option.textContent = item.ten_giai_dau;
        selectElement.appendChild(option);
    });
}
export async function loadDanhSachVongDau_chon_viewbody(maGiaiDau) {
    const selectElement = document.getElementById("maVongDau_chon_viewbody");
    selectElement.innerHTML = '<option value="All">-- Chọn vòng đấu --</option>';
    let data = await hamChung.layDanhSach("vong_dau");
    data = data.filter(item => item.ma_giai_dau === maGiaiDau);
    data.forEach(item => {
        const option = document.createElement("option");
        option.value = item.ma_vong_dau;
        option.textContent = item.ten_vong_dau;
        selectElement.appendChild(option);
    });
}


export async function loadDanhSachGiaiDau_chon_BXH(data) {
    const selectElement = document.getElementById("maGiaiDau_chon_BXH");
    selectElement.innerHTML = '<option value="All">-- Chọn giải đấu --</option>';
    //  const data = await hamChung.layDanhSach("giai_dau");
    data.forEach(item => {
        const option = document.createElement("option");
        option.value = item.ma_giai_dau;
        option.textContent = item.ten_giai_dau;
        selectElement.appendChild(option);
    });
}
export async function loadDanhSachVongDau_chon_BXH(maGiaiDau) {
    const selectElement = document.getElementById("maVongDau_chon_BXH");
    selectElement.innerHTML = '<option value="All">-- Chọn vòng đấu --</option>';
    let data = await hamChung.layDanhSach("vong_dau");
    data = data.filter(item => item.ma_giai_dau === maGiaiDau);
    data.forEach(item => {
        const option = document.createElement("option");
        option.value = item.ma_vong_dau;
        option.textContent = item.ten_vong_dau;
        selectElement.appendChild(option);
    });
}

export async function reset_BangQuyTacTinhDiem_bangXepHang() {
    document.getElementById("dataTable_chon_BXH").querySelector("tbody").innerHTML = "";
    document.getElementById("diemThang_BXH").value = "";
    document.getElementById("diemHoa_BXH").value = "";
    document.getElementById("diemThua_BXH").value = "";
    document.getElementById("diemBanThang_BXH").value = "";
    document.getElementById("truTheVang_BXH").value = "";
    document.getElementById("truTheDo_BXH").value = "";
}
export async function hienThi_bangQuyTacTinhDiem(data1quyTacTinhDiem) {
    document.getElementById("diemThang_BXH").value = data1quyTacTinhDiem.diem_thang;
    document.getElementById("diemHoa_BXH").value = data1quyTacTinhDiem.diem_hoa;
    document.getElementById("diemThua_BXH").value = data1quyTacTinhDiem.diem_thua;
    document.getElementById("diemBanThang_BXH").value = data1quyTacTinhDiem.diem_ban_thang;
    document.getElementById("truTheVang_BXH").value = data1quyTacTinhDiem.tru_the_vang;
    document.getElementById("truTheDo_BXH").value = data1quyTacTinhDiem.tru_the_do;
}
export async function hienThi_bangXepHang(tbody, doiBong, thongSoDoiBong, tongDiem) {
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
export function get_form_diemBXH() {
    let form = {
        diem_thang: parseInt(document.getElementById("diemThang_BXH").value),
        diem_hoa: parseInt(document.getElementById("diemHoa_BXH").value),
        diem_thua: parseInt(document.getElementById("diemThua_BXH").value),
        diem_ban_thang: parseInt(document.getElementById("diemBanThang_BXH").value),
        tru_the_do: parseInt(document.getElementById("truTheDo_BXH").value),
        tru_the_vang: parseInt(document.getElementById("truTheVang_BXH").value)
    };
    if (isNaN(form.diem_thang) && isNaN(form.diem_hoa) && isNaN(form.diem_thua) && isNaN(form.diem_ban_thang) && isNaN(form.tru_the_do) && isNaN(form.tru_the_vang))
        return null;
    return form;
}
