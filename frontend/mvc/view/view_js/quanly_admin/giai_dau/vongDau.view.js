export function getElementIds() {
    return {
        btnLuuThayDoi: document.getElementById("button_luu"),
        btnTaiLaiTrang: document.getElementById("button_taiLaiTrang"),
        maVongDau: document.getElementById("maVongDau"),
        tenVong: document.getElementById("tenVong"),
        moTa: document.getElementById("moTa"),
        form: document.getElementById("inputForm"),
        tableBody: document.getElementById("dataTable"),
    };
}

export function viewTbody(data, onEdit, onDelete) {
    const { tableBody } = getElementIds();
    tableBody.innerHTML = "";
    data.forEach(item => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td style="text-align: center;">${item.ma_vong_dau}</td>
            <td style="text-align: center;">${item.ten_vong}</td>
            <td style="text-align: center;">${item.mo_ta}</td>
            <td style="text-align: center;"><button class="edit-btn btn btn-warning btn-sm">Sửa</button></td>
            <td style="text-align: center;"><button class="delete-btn btn btn-danger btn-sm">Xóa</button></td>
        `;
        tableBody.appendChild(row);

        row.querySelector(".edit-btn").addEventListener("click", () => onEdit(item));
        row.querySelector(".delete-btn").addEventListener("click", () => onDelete(item));
    });
}

export function fillForm(item) {
    const { maVongDau, tenVong, moTa } = getElementIds();
    maVongDau.value = item.ma_vong_dau;
    tenVong.value = item.ten_vong;
    moTa.value = item.mo_ta;
    window.scrollTo({ top: 0, behavior: "smooth" });
}