export function getElementIds() {
    return {
        btnLuuThayDoi: document.getElementById("button_luu"),
        btnTaiLaiTrang: document.getElementById("button_taiLaiTrang"),
        maLoaiTrongTai: document.getElementById("maLoaiTrongTai"),
        tenLoaiTrongTai: document.getElementById("tenLoaiTrongTai"),
        form: document.getElementById("inputForm"),
        tableBody: document.getElementById("dataTable"),
    };
}

export function viewTbody(data, onEdit, onDelete) {
    const { tableBody } = getElementIds();
    tableBody.innerHTML = "";

    for (const item of data) {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td style="text-align: center;">${item.ma_loai_trong_tai}</td>
            <td style="text-align: center;">${item.ten_loai_trong_tai}</td>
            <td style="text-align: center;"><button class="edit-btn btn btn-warning btn-sm">Sửa</button></td>
            <td style="text-align: center;"><button class="delete-btn btn btn-danger btn-sm">Xóa</button></td>
        `;
        tableBody.appendChild(row);

        // Gắn sự kiện
        row.querySelector(".edit-btn").addEventListener("click", () => onEdit(item));
        row.querySelector(".delete-btn").addEventListener("click", () => onDelete(item));
    }
}
// điền dữ liệu vào form
export function fillForm(data) {
    const { maLoaiTrongTai, tenLoaiTrongTai } = getElementIds();
    maLoaiTrongTai.value = data.ma_loai_trong_tai;
    tenLoaiTrongTai.value = data.ten_loai_trong_tai;
    window.scrollTo({ top: 0, behavior: "smooth" });
}
