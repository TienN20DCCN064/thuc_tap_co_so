import hamChung from "/frontend/mvc/model/global/model.hamChung.js";

// C:\Users\vanti\Desktop\mvc_project\frontend\assets\public\src\common\chung_thongBao\thongBao.js
export function getElementIds() {
    return {
        btnLuuThayDoi: document.getElementById("button_luu"),
        btnTaiLaiTrang: document.getElementById("button_taiLaiTrang"),

        maGiaiDau: document.getElementById("maGiaiDau"),
        maBangDau: document.getElementById("maBangDau"),
        maDoiBong: document.getElementById("maDoiBong"),
        tenDoiBong: document.getElementById("tenDoiBong"),
        thoiGianDangKy: document.getElementById("thoiGianDangKy"),
        trangThai: document.getElementById("trangThai"),
        hatGiong: document.getElementById("hatGiong"),
        hinhAnh: document.getElementById("hinhAnh"),

        inputFile: document.getElementById("hinhAnhFile"),
        lyDoTuChoi: document.getElementById("lyDoTuChoi"),
        ghiChu: document.getElementById("ghiChu"),

        form: document.getElementById("inputForm"),



        maGiaiDau_chon_viewbody: document.getElementById("maGiaiDau_chon_viewbody"),
        maBangDau_chon_viewbody: document.getElementById("maBangDau_chon_viewbody"),


        tableBody: document.getElementById("dataTable"),
        button_xem_danh_sach_dang_ky: document.getElementById("button_xem_danh_sach_dang_ky"),


    };
}

// Render tbody danh sách đội bóng giải đấu
export async function viewTbody(data, handleLDTC, handleGhiChu, handleEdit, handleDelete) {

    const { tableBody } = getElementIds();
    tableBody.innerHTML = "";
    if (!data || !Array.isArray(data)) return;

    for (const item of data) {
        const tr = document.createElement("tr");
        const data1GiaiDau = await hamChung.layThongTinTheo_ID("giai_dau", item.ma_giai_dau);
        let tenBangDau = "";
        if (item.ma_bang_dau) {
            const data1BangDau = await hamChung.layThongTinTheo_ID("bang_dau", item.ma_bang_dau);
            tenBangDau = data1BangDau.ten_bang_dau || "";
        }
        tr.innerHTML = `
            <td style="text-align:center">${data1GiaiDau.ten_giai_dau || ""}</td>
            <td style="text-align:center">${tenBangDau}</td>
            <td style="text-align:center">${item.ma_doi_bong || ""}</td>
            <td style="text-align:center">${item.ten_doi_bong || ""}</td>
            <td style="text-align:center">${item.thoi_gian_dang_ky ? item.thoi_gian_dang_ky.replace('T', ' ').slice(0, 16) : ""}</td>
            <td style="text-align:center">${item.trang_thai || ""}</td>
            <td style="text-align:center">${item.hat_giong === "co" ? "Có" : "Không"}</td>
            <td style="text-align:center">
                ${item.hinh_anh ? `<img src="/frontend/assets/public/src/images/${item.hinh_anh}" alt="logo" style="height:40px">` : ""}
            </td>
           
            <td style="text-align:center">
                <button class="btn btn-secondary btn-sm btn-ldtc">Xem</button>
            </td>
            <td style="text-align:center">
                <button class="btn btn-secondary btn-sm btn-ghiChu">Xem</button>
            </td>

            <td style="text-align:center">
                <button class="btn btn-warning btn-sm btn-edit">Sửa</button>
            </td>
            <td style="text-align:center">
                <button class="btn btn-danger btn-sm btn-delete">Xóa</button>
            </td>
        `;
        tr.querySelector(".btn-ldtc").onclick = () => handleLDTC(item);
        tr.querySelector(".btn-ghiChu").onclick = () => handleGhiChu(item);
        // Sửa
        tr.querySelector(".btn-edit").onclick = () => handleEdit(item);
        // Xóa
        tr.querySelector(".btn-delete").onclick = () => handleDelete(item);

        tableBody.appendChild(tr);
    }
}

// Đổ dữ liệu vào form khi sửa
export function fillForm(item) {
    const ids = getElementIds();
    ids.maDoiBong.value = item.ma_doi_bong || "";
    ids.maGiaiDau.value = item.ma_giai_dau || "";
    //
    console.log(item);
    ids.maBangDau.value = item.ma_bang_dau || "";
    ids.tenDoiBong.value = item.ten_doi_bong || "";
    ids.hatGiong.value = item.hat_giong || "khong";
    ids.hinhAnh.value = item.logo || "";
    ids.thoiGianDangKy.value = item.thoi_gian_dang_ky;
    ids.trangThai.value = item.trang_thai || "Chờ duyệt";
    ids.lyDoTuChoi.value = item.ly_do_tu_choi || "";
    ids.ghiChu.value = item.ghi_chu || "";
    // Disable mã đội bóng, giải đấu khi sửa
    ids.maDoiBong.disabled = true;
    ids.maGiaiDau.disabled = true;
    window.scrollTo({ top: 0, behavior: "smooth" });
}

// Load danh sách đội bóng cho select
export async function loadDanhSachDoiBong() {
    const ids = getElementIds();
    const ds = await hamChung.layDanhSach("doi_bong");
    ids.maDoiBong.innerHTML = `<option value="">-- Chọn Đội Bóng --</option>`;
    ds.forEach(item => {
        ids.maDoiBong.innerHTML += `<option value="${item.ma_doi_bong}">${item.ten_doi_bong}</option>`;
    });
    
}

// Load danh sách giải đấu cho select
export async function loadDanhSachGiaiDau(data) {
    const ids = getElementIds();
    // const ds = await hamChung.layDanhSach("giai_dau");
    ids.maGiaiDau.innerHTML = `<option value="">-- Chọn Giải Đấu --</option>`;
    data.forEach(item => {
        ids.maGiaiDau.innerHTML += `<option value="${item.ma_giai_dau}">${item.ten_giai_dau}</option>`;
    });
}

// Load danh sách bảng đấu theo giải đấu
export async function loadDanhSachBangDau(maGiaiDau) {
    const ids = getElementIds();
    const ds = await hamChung.layDanhSach("bang_dau");
    ids.maBangDau.innerHTML = `<option value="">-- Chọn Bảng Đấu --</option>`;
    ds.filter(b => b.ma_giai_dau === maGiaiDau).forEach(item => {
        ids.maBangDau.innerHTML += `<option value="${item.ma_bang_dau}">${item.ten_bang_dau}</option>`;
    });
}

// Load danh sách giải đấu cho filter viewbody
export async function loadDanhSachGiaiDau_chon_viewbody(data) {
    const ids = getElementIds();
    //const ds = await hamChung.layDanhSach("giai_dau");
    ids.maGiaiDau_chon_viewbody.innerHTML = `<option value="All">-- All --</option>`;
    data.forEach(item => {
        ids.maGiaiDau_chon_viewbody.innerHTML += `<option value="${item.ma_giai_dau}">${item.ten_giai_dau}</option>`;
    });
}

// Load danh sách bảng đấu cho filter viewbody
export async function loadDanhSachBangDau_chon_viewbody(maGiaiDau) {
    const ids = getElementIds();
    const ds = await hamChung.layDanhSach("bang_dau");
    ids.maBangDau_chon_viewbody.innerHTML = `<option value="All">-- All --</option>`;
    ds.filter(b => maGiaiDau === "All" || b.ma_giai_dau === maGiaiDau).forEach(item => {
        ids.maBangDau_chon_viewbody.innerHTML += `<option value="${item.ma_bang_dau}">${item.ten_bang_dau}</option>`;
    });
}


export async function loadDanhSachGiaiDau_chon(data) {
    const selectElement = document.getElementById("maGiaiDau_chon");
    selectElement.innerHTML = '<option value="All">Tất Cả</option>'; // Reset danh sách
    // const data = await hamChung.layDanhSach("giai_dau");
    data.forEach(item => {
        const option = document.createElement("option");
        option.value = item.ma_giai_dau;
        option.textContent = `${item.ten_giai_dau}`;
        selectElement.appendChild(option);
    });
}