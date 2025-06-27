export function getElementIds() {
    return {
        btnLuuThayDoi: document.getElementById("button_luu"),
        btnTaiLaiTrang: document.getElementById("button_taiLaiTrang"),
        maDoiBong: document.getElementById("maDoiBong"),
        tenDoiBong: document.getElementById("tenDoiBong"),
        quocGia: document.getElementById("quocGia"),
        maGioiTinh: document.getElementById("maGioiTinh"),
        hinhAnh: document.getElementById("logo"),
        inputFile: document.getElementById("logoFile"),
        form: document.getElementById("inputForm"),
        maQlDoiBong: document.getElementById("maQlDoiBong"),
        gioiTinh_chon_viewbody: document.getElementById("gioiTinh_chon_viewbody"),
        tableBody: document.getElementById("dataTable"),
    };
}

export async function viewTbody(data, hamChung, filter, onEdit, onDelete) {
    const { tableBody, gioiTinh_chon_viewbody } = getElementIds();
    if (!data) data = await hamChung.layDanhSach("doi_bong");
    if (gioiTinh_chon_viewbody && gioiTinh_chon_viewbody.value !== "All") {
        data = data.filter(item => item.gioi_tinh === gioiTinh_chon_viewbody.value);
    }
    tableBody.innerHTML = "";

    for (const item of data) {
        let hinh_anh = item.logo === null
            ? "/frontend/public/images/cat-2.png"
            : await hamChung.getImage(item.logo);
        let qllDoiBong = "---";
        if (item.ma_ql_doi_bong != null) {
            const data1NguoiDung = await hamChung.layThongTinTheo_ID("nguoi_dung", item.ma_ql_doi_bong);
            qllDoiBong = data1NguoiDung.ho_ten;
        }
        const row = document.createElement("tr");
        row.innerHTML = `
            <td style="text-align: center;">${item.ma_doi_bong}</td>
            <td style="text-align: center;">${item.ten_doi_bong}</td>
            <td style="text-align: center;">${item.quoc_gia}</td>
            <td style="text-align: center;">${item.gioi_tinh}</td>
            <td style="text-align: center;"><img src="${hinh_anh}" alt="Logo" width="50"></td>
            <td style="text-align: center;">${qllDoiBong}</td>
            <td style="text-align: center;"><button class="edit-btn btn btn-warning btn-sm">Sửa</button></td>
            <td style="text-align: center;"><button class="delete-btn btn btn-danger btn-sm">Xóa</button></td>
        `;
        tableBody.appendChild(row);

        row.querySelector(".edit-btn").addEventListener("click", () => onEdit(item));
        row.querySelector(".delete-btn").addEventListener("click", () => onDelete(item));
    }
}

export function fillForm(item) {
    const { maDoiBong, tenDoiBong, quocGia, maGioiTinh, hinhAnh, maQlDoiBong } = getElementIds();
    maDoiBong.value = item.ma_doi_bong;
    tenDoiBong.value = item.ten_doi_bong;
    quocGia.value = item.quoc_gia;
    maGioiTinh.value = item.gioi_tinh;
    hinhAnh.value = item.logo;
    maQlDoiBong.value = item.ma_ql_doi_bong;
    window.scrollTo({ top: 0, behavior: "smooth" });
}

export async function loadDanhSachNguoiDung_quanLyDoiBong(hamChung) {
    const selectElement = document.getElementById("maQlDoiBong");
    selectElement.innerHTML = '<option value="">-- Chưa Nhập --</option>';
    const dataTaiKhoan = await hamChung.layDanhSach("tai_khoan");
    const dataNguoiDung = await hamChung.layDanhSach("nguoi_dung");
    const taiKhoanQuanLyDoiBong = dataTaiKhoan.filter(tk => tk.ma_vai_tro === 2);
    const nguoiDungQuanLyDoiBong = dataNguoiDung.filter(nd =>
        taiKhoanQuanLyDoiBong.some(tk => tk.tai_khoan === nd.tai_khoan)
    );
    nguoiDungQuanLyDoiBong.forEach(item => {
        const option = document.createElement("option");
        option.value = item.ma_nguoi_dung;
        option.textContent = `${item.ma_nguoi_dung} - ${item.ho_ten}`;
        selectElement.appendChild(option);
    });
}