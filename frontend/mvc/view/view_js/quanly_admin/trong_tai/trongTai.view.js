// frontend/mvc/view/view_js/quanly_admin/trong_tai/trong_tai.view.js
import hamChung from "/frontend/mvc/model/global/model.hamChung.js";
import FORM from "/frontend/mvc/controller/EditFormData.controller.js";
export function getElementIds() {
    return {
        btnLuuThayDoi: document.getElementById("button_luu"),
        btnTaiLaiTrang: document.getElementById("button_taiLaiTrang"),
        form: document.getElementById("inputForm"),

        maTrongTai: document.getElementById("maTrongTai"),
        maGiaiDau: document.getElementById("maGiaiDau"),
        hoTen: document.getElementById("hoTen"),
        ngaySinh: document.getElementById("ngaySinh"),
        maGioiTinh: document.getElementById("maGioiTinh"),
        maLoaiTrongTai: document.getElementById("maLoaiTrongTai"),


        hinhAnh: document.getElementById("hinhAnh"),
        inputFile: document.getElementById("hinhAnhFile"),

        giaiDau_chon_viewbody: document.getElementById("giaiDau_chon_viewbody"),
        tableBody: document.getElementById("dataTable"),
    };
}

export async function viewTbody(data, onEdit, onDelete) {
    const { tableBody, giaiDau_chon_viewbody } = getElementIds();
    tableBody.innerHTML = "";

    // if (!data) {
    //     data = await hamChung.layDanhSach("trong_tai");
    // }

    if (giaiDau_chon_viewbody.value !== "All") {
        data = data.filter(item => item.ma_giai_dau === giaiDau_chon_viewbody.value);
    }

    for (const item of data) {
        const row = document.createElement("tr");
        const hinhAnh = item.hinh_anh
            ? await hamChung.getImage(item.hinh_anh)
            : "/frontend/public/images/cat-2.png";
        const data1GiaiDau = await hamChung.layThongTinTheo_ID("giai_dau", item.ma_giai_dau);
        const data1LoaiTrongTai = await hamChung.layThongTinTheo_ID("loai_trong_tai", item.ma_loai_trong_tai);
        row.innerHTML = `
            <td style="text-align: center;">${data1GiaiDau.ten_giai_dau}</td>
            <td style="text-align: center;">${item.ho_ten}</td>
            <td style="text-align: center;">${FORM.formatDateT_to_Date(item.ngay_sinh)}</td>
            <td style="text-align: center;">${item.gioi_tinh}</td>
            <td style="text-align: center;">
                <img src="${hinhAnh}" alt="Hình ảnh" style="width: 50px; height: 50px; border-radius: 50%;">
            </td>
            <td style="text-align: center;">${data1LoaiTrongTai.ten_loai_trong_tai}</td>
            <td style="text-align: center;"><button class="edit-btn btn btn-warning btn-sm">Sửa</button></td>
            <td style="text-align: center;"><button class="delete-btn btn btn-danger btn-sm">Xóa</button></td>
        `;
        tableBody.appendChild(row);
    }

    document.querySelectorAll(".edit-btn").forEach((btn, index) => {
        btn.addEventListener("click", () => onEdit(data[index]));
    });

    document.querySelectorAll(".delete-btn").forEach((btn, index) => {
        btn.addEventListener("click", () => onDelete(data[index]));
    });
}

export function fillForm(data) {
    // const {
    //     maTrongTai, hoTen, ngaySinh, maGioiTinh, hinhAnh
    // } = getElementIds();
    const elementIDs = getElementIds();
    elementIDs.maGiaiDau.value = data.ma_giai_dau;
    elementIDs.maTrongTai.value = data.ma_trong_tai;
    elementIDs.hoTen.value = data.ho_ten;
    elementIDs.ngaySinh.value = FORM.formatDateT_to_Date(data.ngay_sinh);
    elementIDs.maGioiTinh.value = data.gioi_tinh;
    elementIDs.maLoaiTrongTai.value = data.ma_loai_trong_tai;
    elementIDs.hinhAnh.value = data.hinh_anh;

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
export async function loadDanhSachLoaiTrongTai() {
    const selectElement = document.getElementById("maLoaiTrongTai");
    selectElement.innerHTML = '<option value="">-- Chọn Loại Trọng Tài --</option>';
    const data = await hamChung.layDanhSach("loai_trong_tai");
    data.forEach(item => {
        const option = document.createElement("option");
        option.value = item.ma_loai_trong_tai;
        option.textContent = `${item.ten_loai_trong_tai}`;
        selectElement.appendChild(option);
    });
}

export async function loadDanhSachGiaiDau_chon_viewbody(data) {
    const selectElement = document.getElementById("giaiDau_chon_viewbody");
    selectElement.innerHTML = '<option value="All">-- ALL --</option>';
    // const data = await hamChung.layDanhSach("giai_dau");
    data.forEach(item => {
        const option = document.createElement("option");
        option.value = item.ma_giai_dau;
        option.textContent = `${item.ten_giai_dau}`;
        selectElement.appendChild(option);
    });
}