// import hamChung from "/frontend/mvc/model/global/model.hamChung.js";

// export function getElementIds() {
//     return {
//         ngayBatDau_chon_viewbody: document.getElementById("ngayBatDau_chon_viewbody"),
//         tableBody: document.getElementById("dataTable"),
//         modalDangKy: document.getElementById("modalDangKy"),
//         thongTinGiaiDau: document.getElementById("thongTinGiaiDau"),
//         dangKyGiai: document.getElementById("dangKyGiai"),
//         xacNhanDangKy: document.getElementById("xacNhanDangKy"),
//         modalDanhSachCauThu: document.getElementById("modalDanhSachCauThu"),
//         playerListBody: document.getElementById("playerListBody"),
//         closeModal: document.getElementById("closeModal"),
//         closeModalBtn: document.getElementById("closeModalBtn"),
//         huyDangKy: document.getElementById("huyDangKy"),
//     };
// }

// // Hiển thị danh sách giải đấu
// export async function viewTbody(data, DoiTuyen, hamChiTiet, onShowModal, onSignUp, onOpenPlayerList) {
//     const { tableBody, ngayBatDau_chon_viewbody } = getElementIds();
//     const doiTuyenDangChon = DoiTuyen.getDoiTuyen_dangChon();
//     tableBody.innerHTML = "";

//     if (ngayBatDau_chon_viewbody.value !== "") {
//         data = data.filter(item => {
//             const ngayKetThucDangKy = item.ngay_ket_thuc_dang_ky_giai.split("T")[0];
//             return ngayKetThucDangKy >= ngayBatDau_chon_viewbody.value;
//         });
//     }

//     for (const item of data) {
//         const row = document.createElement("tr");
//         row.innerHTML = `
//             <td style="text-align: center;">${item.ten_giai_dau}</td>
//             <td style="text-align: center;">${item.ngay_bat_dau}</td>
//             <td style="text-align: center;">${item.ngay_ket_thuc}</td>
//             <td style="text-align: center;"><button class="xemMoTa-btn btn btn-warning btn-sm">Xem</button></td>
//             <td style="text-align: center;">
//                 <button class="sign_up-btn btn btn-warning btn-sm" data-magiaidau="${item.ma_giai_dau}">
//                     Đăng ký
//                 </button>
//             </td>
//         `;
//         tableBody.appendChild(row);

//         row.querySelector(".xemMoTa-btn").addEventListener("click", () => onShowModal(item));
//         row.querySelector(".sign_up-btn").addEventListener("click", () => onSignUp(item));
//     }
// }

// // Hiển thị modal thông tin giải đấu
// export function showModalGiaiDau(item, dataCauHinhGiaiDau) {
//     const { thongTinGiaiDau, modalDangKy, dangKyGiai } = getElementIds();
//     thongTinGiaiDau.innerHTML = `
//         <p><strong>Tên Giải Đấu:</strong> ${item.ten_giai_dau}</p>
//         <p><strong>Tên Tổ Chức:</strong> ${item.ten_to_chuc}</p>
//         <p><strong>Ngày Bắt Đầu:</strong> ${item.ngay_bat_dau}</p>
//         <p><strong>Ngày Kết Thúc:</strong> ${item.ngay_ket_thuc}</p>
//         <p><strong>Ngày Kết Thúc Đăng Ký:</strong> ${item.ngay_ket_thuc_dang_ky_giai}</p>
//         <p><strong>Mô Tả:</strong> ${item.mo_ta || ""}</p>
//         <p><strong>Giới Tính Yêu Cầu:</strong> ${dataCauHinhGiaiDau.gioi_tinh_yeu_cau}</p>
//         <p><strong>Số Lượng Cầu Thủ Tối Đa:</strong> ${dataCauHinhGiaiDau.so_luong_cau_thu_toi_da_moi_doi}</p>
//         <p><strong>Số Lượng Cầu Thủ Tối Thiểu:</strong> ${dataCauHinhGiaiDau.so_luong_cau_thu_toi_thieu_moi_doi}</p>
//         <p><strong>Ghi Chú:</strong> ${dataCauHinhGiaiDau.ghi_chu || ""}</p>
//         <p><strong>Số Lượng Đội Bóng Tối Đa:</strong> ${dataCauHinhGiaiDau.so_luong_doi_bong_toi_da_dang_ky}</p>
//     `;
//     dangKyGiai.style.display = "block";
//     modalDangKy.style.display = "flex";
// }

// // Hiển thị danh sách cầu thủ để chọn
// export async function showPlayerList(data_cauThu_cua_DoiBong, hamChung) {
//     const { playerListBody, modalDanhSachCauThu } = getElementIds();
//     playerListBody.innerHTML = '';
//     for (let i = 0; i < data_cauThu_cua_DoiBong.length; i++) {
//         const player = data_cauThu_cua_DoiBong[i];
//         let hinh_anh = player.hinh_anh === null
//             ? "/frontend/public/images/cat-2.png"
//             : await hamChung.getImage(player.hinh_anh);
//         const data1viTri = await hamChung.layThongTinTheo_ID("vi_tri_cau_thu", player.ma_vi_tri);
//         const row = document.createElement('tr');
//         row.innerHTML = `
//             <td style="text-align: center;">${player.ho_ten}</td>
//             <td style="text-align: center;">${player.so_ao}</td>
//             <td style="text-align: center;">${data1viTri.ten_vi_tri}</td>
//             <td style="text-align: center;">${player.gioi_tinh}</td>
//             <td style="text-align: center;"><img src="${hinh_anh}" alt="Logo" width="50"></td>
//             <td style="text-align: center;">
//                 <input type="checkbox" class="player-checkbox" data-player-id="${player.ma_cau_thu}">
//             </td>
//         `;
//         playerListBody.appendChild(row);
//     }
//     modalDanhSachCauThu.style.display = 'flex';
// }