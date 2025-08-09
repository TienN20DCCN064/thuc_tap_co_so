import hamChung from "/frontend/mvc/model/global/model.hamChung.js";
//C:\Users\vanti\Desktop\mvc_project\frontend\mvc\controller\EditFormData.controller.js
import FORM from "/frontend/mvc/controller/EditFormData.controller.js";
export function getElementIds() {
    return {
        btnLuuThayDoi: document.getElementById("button_luu"),
        btnTaiLaiTrang: document.getElementById("button_taiLaiTrang"),
        maNguoiDung: document.getElementById("maNguoiDung"),
        maTruong: document.getElementById("maTruong"),
        hoTen: document.getElementById("hoTen"),
        gioiTinh: document.getElementById("gioiTinh"),
        email: document.getElementById("email"),
        soDienThoai: document.getElementById("soDienThoai"),
        ngaySinh: document.getElementById("ngaySinh"),
        form: document.getElementById("inputForm"),
        tableBody: document.getElementById("dataTable"),
        maTruong_chon_viewbody: document.getElementById("maTruong_chon_viewbody"),
        gioiTinh_chon_viewbody: document.getElementById("gioiTinh_chon_viewbody"),
    };
}

export async function viewTbody(data, onEdit, onDelete) {
    const { tableBody, maTruong_chon_viewbody, gioiTinh_chon_viewbody } = getElementIds();
     if (maTruong_chon_viewbody && maTruong_chon_viewbody.value === "not_truong") {
        data = data.filter(item => !item.ma_truong);
    }
    else if (maTruong_chon_viewbody && maTruong_chon_viewbody.value !== "All") {
        data = data.filter(item => item.ma_truong === maTruong_chon_viewbody.value);
    }
   
    if (gioiTinh_chon_viewbody && gioiTinh_chon_viewbody.value !== "All") {
        data = data.filter(item => item.gioi_tinh === gioiTinh_chon_viewbody.value);
    }
    tableBody.innerHTML = "";

    for (const item of data) {
        let tenTruong = "---";
        if(item.ma_truong) {
            const data1Truong = await hamChung.layThongTinTheo_ID("truong", item.ma_truong);
            tenTruong = data1Truong.ten_truong ?? "---";
        }
        // console.log("item", item.ngay_sinh);
        // console.log("formattedDate", FORM.formatDateT_to_Date(item.ngay_sinh));
        const row = document.createElement("tr");
        row.innerHTML = `
            <td style="text-align: center;">${item.ma_nguoi_dung}</td>
            <td>${tenTruong}</td>
            <td>${item.ho_ten ?? "---"}</td>
            <td>${item.gioi_tinh ?? "---"}</td>
            <td>${item.email ?? "---"}</td>
            <td>${item.so_dien_thoai ?? "---"}</td>
            <td>${FORM.formatDateT_to_Date(item.ngay_sinh) ?? "---"}</td>
            <td style="text-align: center;"><button class="edit-btn btn btn-warning btn-sm">Sửa</button></td>
            <td style="text-align: center;"><button class="delete-btn btn btn-danger btn-sm">Xóa</button></td>
        `;
        tableBody.appendChild(row);

        row.querySelector(".edit-btn").addEventListener("click", () => onEdit(item));
        row.querySelector(".delete-btn").addEventListener("click", () => onDelete(item));
    }
}

export function fillForm(item) {
    const { maNguoiDung, maTruong, hoTen, gioiTinh, email, soDienThoai, ngaySinh } = getElementIds();
    maNguoiDung.value = item.ma_nguoi_dung;
    maTruong.value = item.ma_truong;
    hoTen.value = item.ho_ten;
    gioiTinh.value = item.gioi_tinh;;
    email.value = item.email;
    soDienThoai.value = item.so_dien_thoai;
    ngaySinh.value = FORM.formatDateT_to_Date(item.ngay_sinh);
    window.scrollTo({ top: 0, behavior: "smooth" });
}

export async function loadDanhSachTruong() {
    const selectElement = document.getElementById("maTruong");
    selectElement.innerHTML = '<option value="">-- Chọn Trường --</option>';
    const data = await hamChung.layDanhSach("truong");
    data.forEach(item => {
        const option = document.createElement("option");
        option.value = item.ma_truong;
        option.textContent = `${item.ma_truong} - ${item.ten_truong}`;
        selectElement.appendChild(option);
    });
}
export async function loadDanhSachTruong_chon_viewbody() {
    const selectElement = document.getElementById("maTruong_chon_viewbody");
    selectElement.innerHTML = '<option value="All">-- All trường --</option>';
    selectElement.innerHTML += '<option value="not_truong">-- Không thuộc trường nào --</option>';
    const data = await hamChung.layDanhSach("truong");
    data.forEach(item => {
        const option = document.createElement("option");
        option.value = item.ma_truong;
        option.textContent = `${item.ma_truong} - ${item.ten_truong}`;
        selectElement.appendChild(option);
    });
}