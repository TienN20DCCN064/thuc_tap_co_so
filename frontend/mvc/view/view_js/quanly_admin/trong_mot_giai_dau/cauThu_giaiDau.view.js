export function getElementIds() {
    return {
        btnLuuThayDoi: document.getElementById("button_luu"),
        btnTaiLaiTrang: document.getElementById("button_taiLaiTrang"),
        maCauThu: document.getElementById("maCauThu"),
        maDoiBong: document.getElementById("maDoiBong"),
        maGiaiDau: document.getElementById("maGiaiDau"),
        hoTen: document.getElementById("hoTen"),
        soAo: document.getElementById("soAo"),
        viTri: document.getElementById("maViTri"),
        hinhAnh: document.getElementById("hinhAnh"),
        inputFile: document.getElementById("hinhAnhFile"),
        form: document.getElementById("inputForm"),
        maGiaiDau_chon_viewbody: document.getElementById("maGiaiDau_chon_viewbody"),
        maDoiBong_chon_viewbody: document.getElementById("maDoiBong_chon_viewbody"),
        tableBody: document.getElementById("dataTable"),
    };
}

export async function viewTbody(data, hamChung, onEdit, onDelete) {
    const { tableBody, maGiaiDau_chon_viewbody, maDoiBong_chon_viewbody } = getElementIds();
    if (!data) data = await hamChung.layDanhSach("cau_thu_giai_dau");
    // Lọc theo giải đấu và đội bóng nếu có chọn
    if (maGiaiDau_chon_viewbody && maGiaiDau_chon_viewbody.value !== "All") {
        data = data.filter(item => item.ma_giai_dau === maGiaiDau_chon_viewbody.value);
    }
    if (maDoiBong_chon_viewbody && maDoiBong_chon_viewbody.value !== "All") {
        data = data.filter(item => item.ma_doi_bong === maDoiBong_chon_viewbody.value);
    }
    tableBody.innerHTML = "";
    for (const item of data) {
        let hinh_anh = item.hinh_anh === null
            ? "/frontend/public/images/cat-2.png"
            : await hamChung.getImage(item.hinh_anh);
        const dataCauThu = await hamChung.layThongTinTheo_ID("cau_thu", item.ma_cau_thu);
        const dataDoiBong = await hamChung.layThongTinTheo_ID("doi_bong", item.ma_doi_bong);
        const dataGiaiDau = await hamChung.layThongTinTheo_ID("giai_dau", item.ma_giai_dau);
        const dataViTri = await hamChung.layThongTinTheo_ID("vi_tri_cau_thu", item.ma_vi_tri);
        const row = document.createElement("tr");
        row.innerHTML = `
            <td style="text-align: center;">${dataGiaiDau?.ten_giai_dau || "---"}</td>
            <td style="text-align: center;">${dataDoiBong?.ten_doi_bong || "---"}</td>
            <td style="text-align: center;">${dataCauThu?.ho_ten || "---"}</td>
            <td style="text-align: center;">${item.ho_ten || "---"}</td>
            <td style="text-align: center;"><img src="${hinh_anh}" alt="Hình ảnh" width="50"></td>
            <td style="text-align: center;">${item.so_ao || "---"}</td>
            <td style="text-align: center;">${dataViTri?.ten_vi_tri || "---"}</td>
            <td style="text-align: center;"><button class="edit-btn btn btn-warning btn-sm">Sửa</button></td>
            <td style="text-align: center;"><button class="delete-btn btn btn-danger btn-sm">Xóa</button></td>
        `;
        tableBody.appendChild(row);

        row.querySelector(".edit-btn").addEventListener("click", () => onEdit(item));
        row.querySelector(".delete-btn").addEventListener("click", () => onDelete(item));
    }
}

export function fillForm(item) {
    const { maCauThu, maDoiBong, maGiaiDau, hoTen, soAo, viTri, hinhAnh } = getElementIds();
    maCauThu.value = item.ma_cau_thu;
    maDoiBong.value = item.ma_doi_bong;
    maGiaiDau.value = item.ma_giai_dau;
    hoTen.value = item.ho_ten;
    soAo.value = item.so_ao;
    viTri.value = item.ma_vi_tri;
    hinhAnh.value = item.hinh_anh;
    maCauThu.setAttribute("disabled", true);
    maGiaiDau.setAttribute("disabled", true);
    window.scrollTo({ top: 0, behavior: "smooth" });
}

export async function loadDanhSachCauThu(hamChung, maDoiBong) {
    const selectElement = document.getElementById("maCauThu");
    selectElement.innerHTML = '<option value="">-- Chọn cầu thủ --</option>';
    let data = await hamChung.layDanhSach("cau_thu");
    if (maDoiBong) data = data.filter(item => item.ma_doi_bong === maDoiBong);
    data.forEach(item => {
        const option = document.createElement("option");
        option.value = item.ma_cau_thu;
        option.textContent = `${item.ho_ten}`;
        selectElement.appendChild(option);
    });
}

export async function loadDanhSachDoiBong(hamChung, maGiaiDau) {
    const selectElement = document.getElementById("maDoiBong");
    selectElement.innerHTML = '<option value="">-- Chọn Đội Bóng --</option>';
    let data = await hamChung.layDanhSach("doi_bong_giai_dau");
    if (maGiaiDau) data = data.filter(item => item.ma_giai_dau === maGiaiDau);
    data.forEach(item => {
        const option = document.createElement("option");
        option.value = item.ma_doi_bong;
        option.textContent = `${item.ten_doi_bong}`;
        selectElement.appendChild(option);
    });
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

export async function loadDanhSachViTri(hamChung) {
    const selectElement = document.getElementById("maViTri");
    selectElement.innerHTML = '<option value="">-- Chọn Vị Trí --</option>';
    const data = await hamChung.layDanhSach("vi_tri_cau_thu");
    data.forEach(item => {
        const option = document.createElement("option");
        option.value = item.ma_vi_tri;
        option.textContent = `${item.ten_vi_tri}`;
        selectElement.appendChild(option);
    });
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

export async function loadDanhSachDoiBongTheoGiaiDau_chon_viewbody(hamChung, maGiaiDau) {
    const selectElement = document.getElementById("maDoiBong_chon_viewbody");
    selectElement.innerHTML = '<option value="All">Tất Cả</option>';
    let data = await hamChung.layDanhSach("doi_bong_giai_dau");
    if (maGiaiDau && maGiaiDau !== "All") data = data.filter(item => item.ma_giai_dau === maGiaiDau);
    data.forEach(item => {
        const option = document.createElement("option");
        option.value = item.ma_doi_bong;
        option.textContent = `${item.ten_doi_bong}`;
        selectElement.appendChild(option);
    });
}