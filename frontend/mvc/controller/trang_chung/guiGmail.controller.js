import hamChiTiet from "/frontend/mvc/model/global/model.hamChiTiet.js";
import hamChung from "/frontend/mvc/model/global/model.hamChung.js";
import { GlobalStore, DoiTuyen } from "/frontend/global/global.js";
//C:\Users\vanti\Desktop\mvc_project\frontend\mvc\controller\trang_chung\dangNhap.controller.js
import {
    getElementIds,
    toggleForms,
    loadDanhSachGiaiDau_cuaBan,
    loadDanhSachGiaiDau,
    loadDanhSachDoiBong_theo_quanLy,
    reset_form,
} from "/frontend/mvc/view/view_js/trang_chung/guiGmail.view.js";
// C:\Users\vanti\Desktop\mvc_project\frontend\mvc\view\view_js\trang_chung\hoSoCaNhan.view.js

const IDS = getElementIds();

document.addEventListener("DOMContentLoaded", async function () {
    // Load danh sách giải đấu
    const maNguoiDung = GlobalStore.getUsername();
    console.log("Người dùng:", maNguoiDung);
    await loadDanhSachGiaiDau();
    await loadDanhSachDoiBong_theo_quanLy(maNguoiDung);
    await loadDanhSachGiaiDau_cuaBan(maNguoiDung);
    IDS.radioQLDoiBong.addEventListener("change", toggleForms);
    IDS.radioQLGiaiDau.addEventListener("change", toggleForms);

    IDS.formDoiBong.addEventListener('submit', async function (event) {
        event.preventDefault();
        await handleFormSubmit_vaiTroQLDoiBong();
        reset_form();
        // Handle form submission logic here
    });
    IDS.formGiaiDau.addEventListener('submit', async function (event) {
        event.preventDefault();
        await handleFormSubmit_vaiTroQLGiaiDau();
        reset_form();
        // Handle form submission logic here
    });

});
async function handleFormSubmit_vaiTroQLDoiBong() {
    if (!IDS.formDoiBong.checkValidity()) {
        IDS.formDoiBong.reportValidity();
        return;
    }
    const data1NguoiDung = await hamChung.layThongTinTheo_ID("nguoi_dung", GlobalStore.getUsername());
    const data1GiaiDau = await hamChung.layThongTinTheo_ID("giai_dau", IDS.maGiaiDau.value);
    const data1DoiBong = await hamChung.layThongTinTheo_ID("doi_bong", IDS.maDoiBong.value);
    const data1_nguoiTaoGiaiDau = await hamChung.layThongTinTheo_ID("nguoi_dung", data1GiaiDau.ma_nguoi_tao);
    const messageHTML = `
                                <p><strong>Email người gửi:</strong> ${data1NguoiDung.email}</p>
                                <p><strong>Giải đấu:</strong> ${data1GiaiDau.ma_giai_dau} (${data1GiaiDau.ten_giai_dau})</p>
                                <p><strong>Đội bóng:</strong> ${data1DoiBong.ma_doi_bong} (${data1DoiBong.ten_doi_bong})</p>
                                <p><strong>Nội dung:</strong><br>${IDS.message.value.replace(/\n/g, '<br>')}</p>
                            `;


    console.log(messageHTML);

    //   console.log(document.getElementById('email_gui').value);
    const form_sendGmail = {
        email_receiver: data1_nguoiTaoGiaiDau.email,
        subject: subject.value,
        message: messageHTML
    }
    console.log(form_sendGmail);
    await hamChung.sendEmail(form_sendGmail.email_receiver, form_sendGmail.subject, form_sendGmail.message);


}

// gửi lên cho admin giải đấu
async function handleFormSubmit_vaiTroQLGiaiDau() {
    if (!IDS.formGiaiDau.checkValidity()) {
        IDS.formGiaiDau.reportValidity();
        return;
    }
    const data1NguoiDung = await hamChung.layThongTinTheo_ID("nguoi_dung", GlobalStore.getUsername());
    const data1GiaiDau = await hamChung.layThongTinTheo_ID("giai_dau", IDS.maGiaiDau_cuaBan.value);
    // const data1_nguoiTaoGiaiDau = await hamChung.layThongTinTheo_ID("nguoi_dung", data1GiaiDau.ma_nguoi_tao);
    const dataTaKhoan = await hamChung.layDanhSach("tai_khoan");
    // tìm kiếm người dùng có vai trò VT01 và tài khoản đang hoạt đônng
    const taiKhoan_admin = dataTaKhoan.find(item => item.ma_vai_tro === "VT01" && item.trang_thai === "Hoạt động");
    const nguoiDung_admin = await hamChung.layThongTinTheo_ID("nguoi_dung", taiKhoan_admin.ma_nguoi_dung);
    const messageHTML = `
                                <p><strong>Email người gửi:</strong> ${data1NguoiDung.email}</p>
                                <p><strong>Giải đấu:</strong> ${data1GiaiDau.ma_giai_dau} (${data1GiaiDau.ten_giai_dau})</p>
                                <p><strong>Nội dung:</strong><br>${IDS.message_2.value.replace(/\n/g, '<br>')}</p>
                            `;


    //   console.log(document.getElementById('email_gui').value);
    const form_sendGmail = {
        email_receiver: nguoiDung_admin.email,
        subject: subject_2.value,
        message: messageHTML
    }
    console.log(form_sendGmail);
    await hamChung.sendEmail(form_sendGmail.email_receiver, form_sendGmail.subject, form_sendGmail.message);

}
