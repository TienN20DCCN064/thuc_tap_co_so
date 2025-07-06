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
        truTheVang: document.getElementById("truTheVang"),
        truTheDoGianTiep: document.getElementById("truTheDoGianTiep"),
        truTheDoTrucTiep: document.getElementById("truTheDoTrucTiep"),
        ghiChu: document.getElementById("ghiChu"),
        maGiaiDau_chon_viewbody: document.getElementById("maGiaiDau_chon_viewbody"),
        maVongDau_chon_viewbody: document.getElementById("maVongDau_chon_viewbody"),
        form: document.getElementById("inputForm"),
        tableBody: document.getElementById("dataTable"),
    };
}

export async function viewTbody(data, xemBXH, onEdit, onDelete) {
    const { tableBody } = getElementIds();
    if (!data) data = await hamChung.layDanhSach("quy_tac_tinh_diem");
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
            <td>${item.tru_the_vang}</td>
            <td>${item.tru_the_do_gian_tiep}</td>
            <td>${item.tru_the_do_truc_tiep}</td>
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

export async function loadDanhSachGiaiDau() {
    const selectElement = document.getElementById("maGiaiDau");
    selectElement.innerHTML = '<option value="">-- Chọn giải đấu --</option>';
    const data = await hamChung.layDanhSach("giai_dau");
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

export async function loadDanhSachGiaiDau_chon_viewbody() {
    const selectElement = document.getElementById("maGiaiDau_chon_viewbody");
    selectElement.innerHTML = '<option value="All">-- Chọn giải đấu --</option>';
    const data = await hamChung.layDanhSach("giai_dau");
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

export async function fillForm(item) {
    const { maGiaiDau, maVongDau, diemThang, diemHoa, diemThua, truTheVang, truTheDoGianTiep, truTheDoTrucTiep, ghiChu } = getElementIds();
    maGiaiDau.value = item.ma_giai_dau;
    await loadDanhSachVongDau(maGiaiDau.value);
    maVongDau.value = item.ma_vong_dau;
    diemThang.value = item.diem_thang;
    diemHoa.value = item.diem_hoa;
    diemThua.value = item.diem_thua;
    truTheVang.value = item.tru_the_vang;
    truTheDoGianTiep.value = item.tru_the_do_gian_tiep;
    truTheDoTrucTiep.value = item.tru_the_do_truc_tiep;
    ghiChu.value = item.ghi_chu || "";
    maGiaiDau.setAttribute("disabled", true);
    maVongDau.setAttribute("disabled", true);
    window.scrollTo({ top: 0, behavior: "smooth" });
}