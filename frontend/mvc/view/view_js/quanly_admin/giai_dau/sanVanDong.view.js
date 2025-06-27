export function getElementIds() {
    return {
        btnLuuThayDoi: document.getElementById("button_luu"),
        btnTaiLaiTrang: document.getElementById("button_taiLaiTrang"),
        maSan: document.getElementById("maSan"),
        tenSan: document.getElementById("tenSan"),
        diaChi: document.getElementById("diaChi"),
        sucChua: document.getElementById("sucChua"),
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
            <td style="text-align: center;">${item.ma_san}</td>
            <td style="text-align: center;">${item.ten_san}</td>
            <td style="text-align: center;">${item.dia_chi}</td>
            <td style="text-align: center;">${item.suc_chua}</td>
            <td style="text-align: center;">${item.mo_ta || ""}</td>
            <td style="text-align: center;"><button class="edit-btn btn btn-warning btn-sm">Sửa</button></td>
            <td style="text-align: center;"><button class="delete-btn btn btn-danger btn-sm">Xóa</button></td>
        `;
        tableBody.appendChild(row);

        row.querySelector(".edit-btn").addEventListener("click", () => onEdit(item));
        row.querySelector(".delete-btn").addEventListener("click", () => onDelete(item));
    });
}

export function fillForm(item) {
    const { maSan, tenSan, diaChi, sucChua, moTa } = getElementIds();
    maSan.value = item.ma_san;
    tenSan.value = item.ten_san;
    diaChi.value = item.dia_chi;
    sucChua.value = item.suc_chua;
    moTa.value = item.mo_ta || "";
    window.scrollTo({ top: 0, behavior: "smooth" });
}