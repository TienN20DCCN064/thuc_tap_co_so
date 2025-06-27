import hamChung from "../../../model/global/model.hamChung.js";

import { getElementIds, viewTbody, fillForm } from "../../../view/view_js/quanly_admin/trong_tai/loaiTrongTai.view.js";
//                                    /frontend/mvc/controller/view/view_js/quanly_admin/trong_tai/loai_trong_tai.js 
// C:\Users\vanti\Downloads\mvc_project\frontend\mvc\view\view_js\quanly_admin\trong_tai\loai_trong_tai.js
const {
    btnLuuThayDoi,
    btnTaiLaiTrang,
    form,
    maLoaiTrongTai,
    tenLoaiTrongTai,
} = getElementIds();

document.addEventListener("DOMContentLoaded", () => {

    load_viewTbody();

    btnLuuThayDoi.addEventListener("click", handleLuuThayDoi);
    btnTaiLaiTrang.addEventListener("click", handleTaiLaiTrang);

});

// Thêm/Sửa trọng tài
async function handleLuuThayDoi(event) {
    event.preventDefault(); // Ngừng hành động gửi form mặc định

    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    let formData = {};
    if (maLoaiTrongTai.value === "") {
        formData = {
            ma_loai_trong_tai: await hamChung.taoID_theoBang("loai_trong_tai"),
            ten_loai_trong_tai: tenLoaiTrongTai.value,
        };
        await hamChung.them(formData, "loai_trong_tai");
        alert("Thêm thành công!");
    } else {
        // nếu là sửa thì hình ảnh có thể thay và không thay

        formData = {
            ma_loai_trong_tai: maLoaiTrongTai.value,
            ten_loai_trong_tai: tenLoaiTrongTai.value,
        };
        await hamChung.sua(formData, "loai_trong_tai");
        alert("Sửa thành công!");
    }
    console.log(formData);
    load_viewTbody();
}

// Xử lý tải lại trang
function handleTaiLaiTrang(event) {
    event.preventDefault();
    location.reload();
}




async function load_viewTbody() {
    const data = await hamChung.layDanhSach("loai_trong_tai");
    viewTbody(data, handleEdit, handleDelete);
}

function handleEdit(item) {
    fillForm(item);
}

async function handleDelete(item) {
    if (confirm(`Bạn có chắc chắn muốn xóa loại trọng tài ${item.ten_loai_trong_tai}?`)) {
        await hamChung.xoa({ ma_loai_trong_tai: item.ma_loai_trong_tai }, "loai_trong_tai");
        load_viewTbody();
    }
}
