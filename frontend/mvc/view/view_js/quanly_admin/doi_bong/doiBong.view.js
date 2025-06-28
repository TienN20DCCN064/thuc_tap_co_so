import hamChung from "/frontend/mvc/model/global/model.hamChung.js";
export function getElementIds() {
    return {
        btnLuuThayDoi: document.getElementById("button_luu"),
        btnTaiLaiTrang: document.getElementById("button_taiLaiTrang"),
        maDoiBong: document.getElementById("maDoiBong"),
        tenDoiBong: document.getElementById("tenDoiBong"),
        maGioiTinh: document.getElementById("maGioiTinh"),
        hinhAnh: document.getElementById("hinhAnh"),
        maQlDoiBong: document.getElementById("maQlDoiBong"),
        ghiChu: document.getElementById("ghiChu"),
        inputFile: document.getElementById("hinhAnhFile"),

        form: document.getElementById("inputForm"),

        gioiTinh_chon_viewbody: document.getElementById("gioiTinh_chon_viewbody"),
        maQlDoiBong_chon_viewbody: document.getElementById("maQlDoiBong_chon_viewbody"),
        tableBody: document.getElementById("dataTable"),
    };
}

export async function viewTbody(data, onEdit, onDelete) {
    const { tableBody } = getElementIds();
    tableBody.innerHTML = "";

    for (const item of data) {
        let hinh_anh;

        if (item.hinh_anh === null || item.hinh_anh === "") {
            // hinh_anh = "/frontend/assets/public/images/cat-2.png";
            hinh_anh = "/frontend/assets/public/images/user-icon.png";
            // C:\Users\vanti\Desktop\mvc_project\frontend\assets\public\images\cat-2.png
        } else {
            hinh_anh = await hamChung.getImage(item.hinh_anh);
        }
        let qllDoiBong = "---";
        if (item.ma_ql_doi_bong != null) {
            const data1NguoiDung = await hamChung.layThongTinTheo_ID("nguoi_dung", item.ma_ql_doi_bong);
            qllDoiBong = data1NguoiDung.ho_ten;
        }
        const row = document.createElement("tr");
        row.innerHTML = `
            <td style="text-align: center;">${item.ma_doi_bong}</td>
            <td style="text-align: center;">${item.ten_doi_bong}</td>
            <td style="text-align: center;">${item.gioi_tinh}</td>
            <td style="text-align: center;"><img src="${hinh_anh}" alt="Logo" width="50"></td>
            <td style="text-align: center;">${qllDoiBong}</td>
            <td style="text-align: center;">${item.ghi_chu || "---"}</td>
            <td style="text-align: center;"><button class="edit-btn btn btn-warning btn-sm">Sửa</button></td>
            <td style="text-align: center;"><button class="delete-btn btn btn-danger btn-sm">Xóa</button></td>
        `;
        tableBody.appendChild(row);

        row.querySelector(".edit-btn").addEventListener("click", () => onEdit(item));
        row.querySelector(".delete-btn").addEventListener("click", () => onDelete(item));
    }
}

export function fillForm(item) {
    const { maDoiBong, tenDoiBong, maGioiTinh, hinhAnh, maQlDoiBong, ghiChu } = getElementIds();
    maDoiBong.value = item.ma_doi_bong;
    tenDoiBong.value = item.ten_doi_bong;
    maGioiTinh.value = item.gioi_tinh;
    hinhAnh.value = item.hinh_anh || "";
    maQlDoiBong.value = item.ma_ql_doi_bong;
    ghiChu.value = item.ghi_chu;
    window.scrollTo({ top: 0, behavior: "smooth" });
}
export async function loadDanhSachNguoiDung() {
    const selectElement = document.getElementById("maQlDoiBong");
    selectElement.innerHTML = '<option value="All">Tất Cả</option>';
    const data = await hamChung.layDanhSach("nguoi_dung");
    data.forEach(item => {
        const option = document.createElement("option");
        option.value = item.ma_nguoi_dung;
        option.textContent = `${item.ho_ten}`;
        selectElement.appendChild(option);
    });
}
export async function loadDanhSachQuanLy_view_body() {
    const selectElement = document.getElementById("maQlDoiBong_chon_viewbody");
    selectElement.innerHTML = '<option value="All">-- Tất cả --</option>';
    const dataDoiBong = await hamChung.layDanhSach("doi_bong");
    // lấy ra danh sách dataDoiBong.ma_ql_doi_bong
    const maQlDoiBongSet = new Set(dataDoiBong.map(item => item.ma_ql_doi_bong));

    for (const QlDoiBong of maQlDoiBongSet) {
        const data1NguoiDung = await hamChung.layThongTinTheo_ID("nguoi_dung", QlDoiBong);
        if (data1NguoiDung) {
            const option = document.createElement("option");
            option.value = QlDoiBong;
            option.textContent = `${QlDoiBong} - ${data1NguoiDung.ho_ten}`;
            selectElement.appendChild(option);
        }
    }
}