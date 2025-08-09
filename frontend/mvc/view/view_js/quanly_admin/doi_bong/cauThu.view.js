import hamChung from "/frontend/mvc/model/global/model.hamChung.js";
import { GlobalStore, DoiTuyen } from "/frontend/global/global.js";
// C:\Users\vanti\Desktop\mvc_project\frontend\mvc\controller\EditFormData.controller.js
import FORM from "/frontend/MVC/controller/EditFormData.controller.js"
export function getElementIds() {
    return {
        btnLuuThayDoi: document.getElementById("button_luu"),
        btnTaiLaiTrang: document.getElementById("button_taiLaiTrang"),
        maCauThu: document.getElementById("maCauThu"),
        hoTen: document.getElementById("hoTen"),
        ngaySinh: document.getElementById("ngaySinh"),
        soAo: document.getElementById("soAo"),
        maGioiTinh: document.getElementById("maGioiTinh"),
        maViTri: document.getElementById("maViTri"),
        maDoiBong: document.getElementById("maDoiBong"),
        hinhAnh: document.getElementById("hinhAnh"),
        inputFile: document.getElementById("hinhAnhFile"),
        form: document.getElementById("inputForm"),
        maDoiBong_chon_viewbody: document.getElementById("maDoiBong_chon_viewbody"),
        tableBody: document.getElementById("dataTable"),
    };
}

export async function viewTbody(data, onEdit, onDelete) {
    const { tableBody, maDoiBong_chon_viewbody } = getElementIds();

    if (maDoiBong_chon_viewbody && maDoiBong_chon_viewbody.value !== "All") {
        data = data.filter(item => item.ma_doi_bong === maDoiBong_chon_viewbody.value);
    }
    data = data.slice(0, 20);
    tableBody.innerHTML = "";

    for (const item of data) {
        let hinh_anh = item.hinh_anh === null
            ? "/frontend/public/images/cat-2.png"
            : await hamChung.getImage(item.hinh_anh);
        const lay1ViTri = await hamChung.layThongTinTheo_ID("vi_tri_cau_thu", item.ma_vi_tri);
        const lay1doiBong = await hamChung.layThongTinTheo_ID("doi_bong", item.ma_doi_bong);

        const row = document.createElement("tr");
        row.innerHTML = `
            <td style="text-align: center;">${lay1doiBong.ten_doi_bong}</td>
            <td style="text-align: center;">${item.ho_ten}</td>
            <td style="text-align: center;">${FORM.formatDateT_to_Date(item.ngay_sinh)}</td>
            <td style="text-align: center;">${item.so_ao}</td>
            <td style="text-align: center;">${item.gioi_tinh}</td>
            <td style="text-align: center;">${lay1ViTri.ten_vi_tri}</td>
            <td style="text-align: center;"><img src="${hinh_anh}" alt="Hình ảnh" width="50"></td>
            <td style="text-align: center;"><button class="edit-btn btn btn-warning btn-sm">Sửa</button></td>
            <td style="text-align: center;"><button class="delete-btn btn btn-danger btn-sm">Xóa</button></td>
        `;
        tableBody.appendChild(row);

        row.querySelector(".edit-btn").addEventListener("click", () => onEdit(item));
        row.querySelector(".delete-btn").addEventListener("click", () => onDelete(item));
    }
}

export function fillForm(item) {
    const { maCauThu, hoTen, ngaySinh, soAo, maGioiTinh, maViTri, maDoiBong, hinhAnh } = getElementIds();
    maCauThu.value = item.ma_cau_thu;
    hoTen.value = item.ho_ten;
    ngaySinh.value = FORM.formatDateT_to_Date(item.ngay_sinh);
    soAo.value = item.so_ao;
    maGioiTinh.value = item.gioi_tinh;
    maViTri.value = item.ma_vi_tri;
    maDoiBong.value = item.ma_doi_bong;
    hinhAnh.value = item.hinh_anh;
    window.scrollTo({ top: 0, behavior: "smooth" });
}

export async function loadDanhSachViTri() {
    const selectElement = document.getElementById("maViTri");
    selectElement.innerHTML = '<option value="">-- Chọn Vị Trí --</option>';
    const data = await hamChung.layDanhSach("vi_tri_cau_thu");
    data.forEach(item => {
        const option = document.createElement("option");
        option.value = item.ma_vi_tri;
        option.textContent = `${item.ma_vi_tri} - ${item.ten_vi_tri}`;
        selectElement.appendChild(option);
    });
}

export async function loadDanhSachDoiBong(data) {
    const selectElement = document.getElementById("maDoiBong");
    selectElement.innerHTML = '<option value="">-- Chọn Đội Bóng --</option>';

    console.log("Danh sách đội bóng:", data);
    console.log("GlobalStore.getUsername", GlobalStore.getUsername());
    const dataDoiBong_theoMaQuanLy = data.filter(item => item.ma_ql_doi_bong === GlobalStore.getUsername());

    dataDoiBong_theoMaQuanLy.forEach(item => {
        const option = document.createElement("option");
        option.value = item.ma_doi_bong;
        option.textContent = `${item.ten_doi_bong}`;
        selectElement.appendChild(option);
    });
}

export async function loadDanhSachDoiBong_chon_viewbody(data) {
    const selectElement = document.getElementById("maDoiBong_chon_viewbody");
    selectElement.innerHTML = '<option value="All">Tất Cả</option>';
    // const data = await hamChung.layDanhSach("doi_bong");
    data.forEach(item => {
        const option = document.createElement("option");
        option.value = item.ma_doi_bong;
        option.textContent = `${item.ten_doi_bong}`;
        selectElement.appendChild(option);
    });
}