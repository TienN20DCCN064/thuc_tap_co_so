// import hamChung from "/frontend/mvc/model/global/model.hamChung.js";

// export function getElementIds() {
//     return {
//         btnLuuThayDoi: document.getElementById("button_luu"),
//         btnTaiLaiTrang: document.getElementById("button_taiLaiTrang"),
//         button_xepLich: document.getElementById("button_xepLich"),
//         maTranDau: document.getElementById("maTranDau"),
//         maGiaiDau: document.getElementById("maGiaiDau"),
//         maDoi1: document.getElementById("maDoi1"),
//         maDoi2: document.getElementById("maDoi2"),
//         ngayDienRa: document.getElementById("ngayDienRa"),
//         gioDienRa: document.getElementById("gioDienRa"),
//         sanVanDong: document.getElementById("sanVanDong"),
//         button_xem_ds_trongTai: document.getElementById("button_xem_ds_trongTai"),
//         button_luu_danhSachTranDau: document.getElementById("bt_luuDanhSachTranDau_tuDong"),
//         trangThai: document.getElementById("trangThai"),
//         maVongDau: document.getElementById("maVongDau"),
//         maGiaiDau_chon_viewbody: document.getElementById("maGiaiDau_chon_viewbody"),
//         maVongDau_chon_viewbody: document.getElementById("maVongDau_chon_viewbody"),
//         form: document.getElementById("inputForm"),
//         tableBody: document.getElementById("dataTable"),
//     };
// }

// // Hiển thị danh sách trận đấu
// export async function viewTbody(data, onEdit, onDelete, onEditKQ, onXemTrongTai) {
//     const {
//         maGiaiDau_chon_viewbody,
//         maVongDau_chon_viewbody,
//         tableBody
//     } = getElementIds();

//     if (!data) data = await hamChung.layDanhSach("tran_dau");
//     if (maGiaiDau_chon_viewbody && maGiaiDau_chon_viewbody.value !== "All") {
//         data = data.filter(item => item.ma_giai_dau === maGiaiDau_chon_viewbody.value);
//     }
//     if (maVongDau_chon_viewbody && maVongDau_chon_viewbody.value !== "All") {
//         data = data.filter(item => item.ma_vong_dau === maVongDau_chon_viewbody.value);
//     }
//     tableBody.innerHTML = "";

//     for (let i = 0; i < data.length; i++) {
//         const item = data[i];
//         const ketQua = await layKetQua(item.ma_tran_dau);
//         const row = document.createElement("tr");
//         const dataGiaiDau = await hamChung.layThongTinTheo_ID("giai_dau", item.ma_giai_dau);
//         const dataDoiBongGiaiDau = await hamChung.layDanhSach("doi_bong_giai_dau");
//         const dd1 = dataDoiBongGiaiDau.find(dd => dd.ma_doi_bong === item.ma_doi_1 && dd.ma_giai_dau === item.ma_giai_dau);
//         const dd2 = dataDoiBongGiaiDau.find(dd => dd.ma_doi_bong === item.ma_doi_2 && dd.ma_giai_dau === item.ma_giai_dau);
//         const dataVongDau = await hamChung.layThongTinTheo_ID("vong_dau", item.ma_vong_dau);
//         const data1SVD = await hamChung.layThongTinTheo_ID("san_van_dong", item.ma_san);
//         row.innerHTML = `
//             <td style="text-align: center;">${dataGiaiDau?.ten_giai_dau || ""}</td>
//             <td style="text-align: center;">${dataVongDau?.ten_vong || ""}</td>
//             <td style="text-align: center;">${item.ma_tran_dau}</td>
//             <td style="text-align: center;">${dd1?.ten_doi_bong || ""}</td>
//             <td style="text-align: center;">${dd2?.ten_doi_bong || ""}</td>
//             <td style="text-align: center;">${item.ngay_dien_ra}</td>
//             <td style="text-align: center;">${item.gio_dien_ra}</td>
//             <td style="text-align: center;">${data1SVD?.ten_san || ""}</td>
//             <td style="text-align: center;"><button class="xemTrongTai-btn btn btn-warning btn-sm">Xem ds</button></td>
//             <td style="text-align: center;">${item.trang_thai}</td>
//             <td style="text-align: center;">${ketQua}</td>
//             <td style="text-align: center;"><button class="edit-btn btn btn-warning btn-sm">Sửa thông tin</button></td>
//             <td style="text-align: center;"><button class="edit-kq-btn btn btn-warning btn-sm">Sửa kết quả</button></td>
//             <td style="text-align: center;"><button class="delete-btn btn btn-danger btn-sm">Xóa</button></td>
//         `;
//         tableBody.appendChild(row);

//         row.querySelector(".edit-btn").addEventListener("click", () => onEdit(item));
//         row.querySelector(".delete-btn").addEventListener("click", () => onDelete(item));
//         row.querySelector(".edit-kq-btn").addEventListener("click", () => onEditKQ(item));
//         row.querySelector(".xemTrongTai-btn").addEventListener("click", () => onXemTrongTai(item));
//     }
// }

// // Điền dữ liệu vào form
// export function fillForm(item) {
//     const {
//         maTranDau, maGiaiDau, maDoi1, maDoi2, ngayDienRa, gioDienRa, sanVanDong, trangThai, maVongDau
//     } = getElementIds();
//     maTranDau.value = item.ma_tran_dau;
//     maGiaiDau.value = item.ma_giai_dau;
//     maDoi1.value = item.ma_doi_1;
//     maDoi2.value = item.ma_doi_2;
//     ngayDienRa.value = item.ngay_dien_ra;
//     gioDienRa.value = item.gio_dien_ra;
//     sanVanDong.value = item.ma_san;
//     trangThai.value = item.trang_thai;
//     maVongDau.value = item.ma_vong_dau;
//     window.scrollTo({ top: 0, behavior: "smooth" });
// }

// // Các hàm load select option
// export async function loadDanhSachGiaiDau() {
//     const selectElement = document.getElementById("maGiaiDau");
//     selectElement.innerHTML = '<option value="">-- Chọn Giải Đấu --</option>';
//     const data = await hamChung.layDanhSach("giai_dau");
//     data.forEach(item => {
//         const option = document.createElement("option");
//         option.value = item.ma_giai_dau;
//         option.textContent = `${item.ten_giai_dau}`;
//         selectElement.appendChild(option);
//     });
// }

// export async function loadDanhSachDoiBong_maDoi1_end(maGiaiDau) {
//     const selectElement = document.getElementById("maDoi1");
//     selectElement.innerHTML = '<option value="">-- Chọn Đội 1 --</option>';
//     const dataDoiBongGiaiDau = await hamChung.layDanhSach("doi_bong_giai_dau");
//     let data = [];
//     if (maGiaiDau != "") {
//         data = dataDoiBongGiaiDau.filter(item => item.ma_giai_dau === maGiaiDau);
//     }
//     data.forEach(item => {
//         const option = document.createElement("option");
//         option.value = item.ma_doi_bong;
//         option.textContent = `${item.ten_doi_bong}`;
//         selectElement.appendChild(option);
//     });
// }

// export async function loadDanhSachDoiBong_maDoi2_end(maGiaiDau) {
//     const selectElement = document.getElementById("maDoi2");
//     selectElement.innerHTML = '<option value="">-- Chọn Đội 2 --</option>';
//     const dataDoiBongGiaiDau = await hamChung.layDanhSach("doi_bong_giai_dau");
//     let data = [];
//     if (maGiaiDau != "") {
//         data = dataDoiBongGiaiDau.filter(item => item.ma_giai_dau === maGiaiDau);
//     }
//     data.forEach(item => {
//         const option = document.createElement("option");
//         option.value = item.ma_doi_bong;
//         option.textContent = `${item.ten_doi_bong}`;
//         selectElement.appendChild(option);
//     });
// }

// export async function loadDanhSachVongDau() {
//     const selectElement = document.getElementById("maVongDau");
//     selectElement.innerHTML = '<option value="">-- Chọn Vòng Đấu --</option>';
//     const data = await hamChung.layDanhSach("vong_dau");
//     data.forEach(item => {
//         const option = document.createElement("option");
//         option.value = item.ma_vong_dau;
//         option.textContent = `${item.ma_vong_dau} - ${item.ten_vong}`;
//         selectElement.appendChild(option);
//     });
// }

// export async function loadDanhSachSanVanDong() {
//     const selectElement = document.getElementById("sanVanDong");
//     selectElement.innerHTML = '<option value="">-- Chọn Sân Vận Động --</option>';
//     const data = await hamChung.layDanhSach("san_van_dong");
//     data.forEach(item => {
//         const option = document.createElement("option");
//         option.value = item.ma_san;
//         option.textContent = `${item.ten_san}`;
//         selectElement.appendChild(option);
//     });
// }

// export async function loadDanhSachGiaiDau_chon_viewbody() {
//     const selectElement = document.getElementById("maGiaiDau_chon_viewbody");
//     selectElement.innerHTML = '<option value="All">Tất Cả</option>';
//     const data = await hamChung.layDanhSach("giai_dau");
//     data.forEach(item => {
//         const option = document.createElement("option");
//         option.value = item.ma_giai_dau;
//         option.textContent = `${item.ten_giai_dau}`;
//         selectElement.appendChild(option);
//     });
// }

// export async function loadDanhSachVongDau_chon_viewbody() {
//     const selectElement = document.getElementById("maVongDau_chon_viewbody");
//     selectElement.innerHTML = '<option value="All">Tất Cả</option>';
//     const data = await hamChung.layDanhSach("vong_dau");
//     data.forEach(item => {
//         const option = document.createElement("option");
//         option.value = item.ma_vong_dau;
//         option.textContent = `${item.ten_vong}`;
//         selectElement.appendChild(option);
//     });
// }

// // Hàm lấy kết quả trận đấu
// export async function layKetQua(ma_tran_dau) {
//     let stringKetQua = "---";
//     let tenDoiThang = "";
//     const data_kqTranDau = await hamChung.layDanhSach("ket_qua_tran_dau");
//     const dataTranDau = await hamChung.layDanhSach("tran_dau");
//     const checkTranDau_coKq_chua = data_kqTranDau.find(data => data.ma_tran_dau === ma_tran_dau);
//     if (!checkTranDau_coKq_chua) {
//         return stringKetQua;
//     } else {
//         const data1KqTranDau = await hamChung.layThongTinTheo_ID("ket_qua_tran_dau", ma_tran_dau);
//         const data1TranDau = await hamChung.layThongTinTheo_ID("tran_dau", ma_tran_dau);
//         if (data1KqTranDau.ma_doi_thang != null) {
//             const data_doiThang = await hamChung.layThongTinTheo_2_ID("doi_bong_giai_dau", data1KqTranDau.ma_doi_thang, data1TranDau.ma_giai_dau);
//             tenDoiThang = data_doiThang.ten_doi_bong;
//         }
//         stringKetQua = tenDoiThang + " " + data1KqTranDau.so_ban_doi_1 + ":" + data1KqTranDau.so_ban_doi_2;
//     }
//     return stringKetQua;
// }
