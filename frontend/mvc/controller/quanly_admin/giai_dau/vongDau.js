const btnLuuThayDoi = document.getElementById("button_luu");
const btnTaiLaiTrang = document.getElementById("button_taiLaiTrang");

const maVongDau = document.getElementById("maVongDau");
const tenVong = document.getElementById("tenVong");
const moTa = document.getElementById("moTa");

document.addEventListener("DOMContentLoaded", function () {
    viewTbody();
    btnLuuThayDoi.addEventListener("click", handleLuuThayDoi);
    btnTaiLaiTrang.addEventListener("click", handleTaiLaiTrang);
});

async function viewTbody() {
    const data = await hamChung.layDanhSach("vong_dau");
    console.log(data);
    const tableBody = document.getElementById("dataTable");
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
    });

    button_sua(data);
    button_xoa(data);
}

function button_sua(data) {
    document.querySelectorAll(".edit-btn").forEach((btn, index) => {
        btn.addEventListener("click", () => {
            const item = data[index];
            document.getElementById("maVongDau").value = item.ma_vong_dau;
            document.getElementById("tenVong").value = item.ten_vong;
            document.getElementById("moTa").value = item.mo_ta;


            
            // Scroll lên đầu trang
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    });
}


// Xử lý nút "Xóa"
function button_xoa(data) {
    document.querySelectorAll(".delete-btn").forEach((btn, index) => {
        btn.addEventListener("click", async () => {
            if (confirm(`Bạn có chắc chắn muốn xóa bảng đấu "${data[index].ten_vong}"?`)) {
                const formData = { ma_vong_dau: data[index].ma_vong_dau };
                await hamChung.xoa(formData, "vong_dau");
                viewTbody();
            }
        });
    });
}


// Thêm/Sửa bảng đấu
async function handleLuuThayDoi(event) {
    event.preventDefault(); // Ngăn chặn reload trang
    let formData = {};
    if (maVongDau.value === "") {
        formData = {
            ma_vong_dau: await hamChung.taoID_theoBang("vong_dau"),
            ten_vong: tenVong.value,
            mo_ta: moTa.value
        };
        await hamChung.them(formData, "vong_dau");
        alert("Thêm thành công!");
    } else {
        formData = {
            ma_vong_dau: maVongDau.value,
            ten_vong: tenVong.value,
            mo_ta: moTa.value
        };
        await hamChung.sua(formData, "vong_dau");
        alert("Sửa thành công!");
    }
    console.log(formData);

    viewTbody();
}

// Xử lý tải lại trang
function handleTaiLaiTrang(event) {
    event.preventDefault();
    location.reload();
}