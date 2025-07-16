import hamChung from "/frontend/mvc/model/global/model.hamChung.js";
import * as controller_view from "/frontend/mvc/view/view_js/trang_chung/dangNhap.view.js";
import { GlobalStore, DoiTuyen } from "/frontend/global/global.js";
import thongBao from "/frontend/assets/components/thongBao.js";

//C:\Users\vanti\Desktop\mvc_project\frontend\mvc\controller\trang_chung\dangNhap.controller.js



const {
  loginForm,
  taiKhoanInput,
  matKhauInput,
  btnDangNhap
} = controller_view.getElementIds();




document.addEventListener("DOMContentLoaded", function () {

  localStorage.setItem("token", ""); // ✅ Lưu token vào localStorage
  DoiTuyen.setDoiTuyen_dangChon(null); // ✅ Reset đội tuyển đang chọn
  GlobalStore.setUsername(null); // ✅ Reset tên đăng nhập trong GlobalStore

  console.log("token ", localStorage.getItem("token")); // ✅ Lấy token từ localStorage
  console.log("DoiTuyen dang chon: ", DoiTuyen.getDoiTuyen_dangChon()); // ✅ Lấy đội tuyển đang chọn từ DoiTuyen
  console.log("Tên đăng nhập trong GlobalStore: ", GlobalStore.getUsername()); // ✅ Lấy tên đăng nhập từ GlobalStore

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


  const res_json = await hamChung.dangNhap(formData);
  console.log("Kết quả đăng nhập:", res_json);
  if (!res_json) {
    thongBao.thongBao_error(`Đăng nhập thất bại. Vui lòng kiểm tra lại tài khoản hoặc mật khẩu.`, null, "error");
    return;
  }
  else {

    const user = res_json.user;
    if(user.trang_thai === "Bị khóa") {
      thongBao.thongBao_error(`Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên để biết thêm chi tiết.`, null, "error");
      return;
    }
    localStorage.setItem("token", res_json.token); // ✅ Lưu token vào localStorage
    GlobalStore.setUsername(user.ma_nguoi_dung); // ✅ Lưu tên đăng nhập vào GlobalStore

    console.log("Đăng nhập thành công:", user);
    await dangNhap_chuyenTrang(user);

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
        // alert(`Bạn đã chọn đội: ${doiDuocChon.ten_doi_bong}`);
        // Chuyển hướng đến trang quản lý đội bóng
        window.location.href = "/frontend/mvc/view/view_html/quanly_doiBong/trang_chu.html";
      });
    }
    else {
      window.location.href = "/frontend/mvc/view/view_html/quanly_doiBong/trang_chu.html";
    }
    // C:\Users\vanti\Desktop\mvc_project\frontend\mvc\view\view_html\quanly\trang_chu.html

  }
}