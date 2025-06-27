const btnLuuThayDoi = document.getElementById("button_luu");
const btnTaiLaiTrang = document.getElementById("button_taiLaiTrang");

const maSan = document.getElementById("maSan");
const tenSan = document.getElementById("tenSan");
const diaChi = document.getElementById("diaChi");
const sucChua = document.getElementById("sucChua");
const moTa = document.getElementById("moTa");

document.addEventListener("DOMContentLoaded", function () {
    viewTbody();

    btnLuuThayDoi.addEventListener("click", handleLuuThayDoi);
    btnTaiLaiTrang.addEventListener("click", handleTaiLaiTrang);
});

// Hiển thị danh sách sân vận động
async function viewTbody() {
    const data = await hamChung.layDanhSach("san_van_dong");
    const tableBody = document.getElementById("dataTable");
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
    });

    button_sua(data);
    button_xoa(data);
}

async function handleLuuThayDoi(event) {
    event.preventDefault();

    const form = document.getElementById("inputForm");

    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    let formData = {};

    if (maSan.value === "") {
        formData = {
            ma_san: await hamChung.taoID_theoBang("san_van_dong"),
            ten_san: tenSan.value,
            dia_chi: diaChi.value,
            suc_chua: parseInt(sucChua.value),
            mo_ta: moTa.value
        };
        await hamChung.them(formData, "san_van_dong");
        alert("Thêm thành công!");
    } else {
        formData = {
            ma_san: maSan.value,
            ten_san: tenSan.value,
            dia_chi: diaChi.value,
            suc_chua: parseInt(sucChua.value),
            mo_ta: moTa.value
        };
        await hamChung.sua(formData, "san_van_dong");
        alert("Sửa thành công!");
    }

    viewTbody();
    form.reset();
    maSan.value = ""; // Đảm bảo ô mã sân về rỗng
}

function handleTaiLaiTrang(event) {
    event.preventDefault();
    location.reload();
}

function button_sua(data) {
    document.querySelectorAll(".edit-btn").forEach((btn, index) => {
        btn.addEventListener("click", () => {
            const item = data[index];
            maSan.value = item.ma_san;
            tenSan.value = item.ten_san;
            diaChi.value = item.dia_chi;
            sucChua.value = item.suc_chua;
            moTa.value = item.mo_ta || "";

            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    });
}

function button_xoa(data) {
    document.querySelectorAll(".delete-btn").forEach((btn, index) => {
        btn.addEventListener("click", async () => {
            if (confirm(`Bạn có chắc chắn muốn xóa sân "${data[index].ten_san}"?`)) {
                const formData = {
                    ma_san: data[index].ma_san,
                };
                await hamChung.xoa(formData, "san_van_dong");
                viewTbody();
            }
        });
    });
}
