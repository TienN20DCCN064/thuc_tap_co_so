import hamChung from "/frontend/mvc/model/global/model.hamChung.js";
import hamChiTiet from "/frontend/mvc/model/global/model.hamChiTiet.js";
import * as controller_view from "/frontend/mvc/view/view_js/trang_chung/dangNhap.view.js";
import { GlobalStore, DoiTuyen } from "/frontend/global/global.js";

//C:\Users\vanti\Desktop\mvc_project\frontend\mvc\controller\trang_chung\dangNhap.controller.js


const {
  loginForm,
  taiKhoanInput,
  matKhauInput,
  btnDangNhap
} = controller_view.getElementIds();




document.addEventListener("DOMContentLoaded", function () {
  console.log("Đã tải trang đăng nhập");
  btnDangNhap.addEventListener("click", check_dangNhap);
  controller_view.setupDialogCloseHandler();
});

async function check_dangNhap(event) {
  event.preventDefault(); // Ngừng hành động gửi form mặc định

  if (!loginForm.checkValidity()) {
    loginForm.reportValidity();
    return;
  }
  const formData = {
    tenDangNhap: taiKhoanInput.value.trim(),
    matKhau: matKhauInput.value.trim()
  };


  const user = await hamChiTiet.dangNhap(formData);
  if (user) {
    // ✅ Đăng nhập thành công
    alert("Đăng nhập thành công!");
    await dangNhap_chuyenTrang(user);
  } else {
    // ❌ Đăng nhập thất bại (sai tài khoản hoặc lỗi API)
    alert("Đăng nhập thất bại. Vui lòng kiểm tra lại tài khoản hoặc mật khẩu.");
  }

}
async function dangNhap_chuyenTrang(user) {


  console.log(user)
  if (user.ma_vai_tro === "VT01") {
    window.location.href = "/frontend/mvc/view/view_html/quanly_admin/trang_chu.html";
  }
  else if (user.ma_vai_tro === "VT02") {
    await layDanhSachDoiBong_theoQuanLy(user.ma_nguoi_dung);
    // window.location.href = "/frontend/mvc/view/view_html/quanly/doi_bong/quanLyDoiBong.html";
  }
  else {
    alert("Vai trò không hợp lệ");
    return;
  }
}

async function layDanhSachDoiBong_theoQuanLy(ma_nguoi_dung) {

  //window.location.href = "/frontend/view/quanly/doi_bong/cau_thu.html";
  // const data_1NguoiDung = await hamChung.layThongTinTheo_ID("nguoi_dung", ma_nguoi_dung);
  const dataDoiBong = await hamChung.layDanhSach("doi_bong");
  const dataDoiBong_theoQl = dataDoiBong.filter((item) => item.ma_ql_doi_bong === ma_nguoi_dung);
  if (dataDoiBong_theoQl.length !== 0) {
    // Gửi callback để xử lý khi người dùng chọn đội
    controller_view.show_list_doiBong(dataDoiBong_theoQl, (doiDuocChon) => {
      DoiTuyen.setDoiTuyen_dangChon(doiDuocChon.ma_doi_bong);
      console.log("Đã chọn đội:", doiDuocChon.ten_doi_bong);
      alert(`Bạn đã chọn đội: ${doiDuocChon.ten_doi_bong}`);
      // Chuyển hướng đến trang quản lý đội bóng
      window.location.href = "/frontend/mvc/view/view_html/quanly/trang_chu.html";
    });
  }
  else {
    window.location.href = "/frontend/mvc/view/view_html/quanly/trang_chu.html";
  }
 // C:\Users\vanti\Desktop\mvc_project\frontend\mvc\view\view_html\quanly\trang_chu.html

}