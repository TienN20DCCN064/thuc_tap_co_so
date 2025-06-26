import hamChung from "../../../model/global/model.hamChung.js";

import { getElementIds, viewTbody, fillForm } from "../../../view/view_js/quanly_admin/trong_tai/loai_trong_tai.view.js";
 //                                    /frontend/mvc/controller/view/view_js/quanly_admin/trong_tai/loai_trong_tai.js 
// C:\Users\vanti\Downloads\mvc_project\frontend\mvc\view\view_js\quanly_admin\trong_tai\loai_trong_tai.js

document.addEventListener("DOMContentLoaded", () => {
    const {
        btnLuuThayDoi,
        btnTaiLaiTrang,
        form,
        maLoaiTrongTai,
        tenLoaiTrongTai,
    } = getElementIds();

    load_viewTbody(); 

    btnLuuThayDoi.addEventListener("click", async (event) => {
        event.preventDefault();
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        let formData = {
            ten_loai_trong_tai: tenLoaiTrongTai.value,
        };

        if (maLoaiTrongTai.value === "") {
            formData.ma_loai_trong_tai = await hamChung.taoID_theoBang("loai_trong_tai");
            await hamChung.them(formData, "loai_trong_tai");
            alert("Thêm thành công!");
        } else {
            formData.ma_loai_trong_tai = maLoaiTrongTai.value;
            await hamChung.sua(formData, "loai_trong_tai");
            alert("Sửa thành công!");
        }

        load_viewTbody();
    });

    btnTaiLaiTrang.addEventListener("click", (e) => {
        e.preventDefault();
        location.reload();
    });
});

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
