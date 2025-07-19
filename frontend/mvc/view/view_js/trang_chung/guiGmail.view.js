import hamChiTiet from "/frontend/mvc/model/global/model.hamChiTiet.js";
import hamChung from "/frontend/mvc/model/global/model.hamChung.js";

export function getElementIds() {
    return {
        maGiaiDau: document.getElementById('maGiaiDau'),
        maDoiBong: document.getElementById('maDoiBong'),
        maGiaiDau_cuaBan: document.getElementById('maGiaiDau_cuaBan'),
        radioQLDoiBong: document.getElementById("vaiTroQL_DoiBong"),
        radioQLGiaiDau: document.getElementById("vaiTroQL_GiaiDau"),
        formDoiBong: document.getElementById("guiGmailForm_qlDoiBong"),
        formGiaiDau: document.getElementById("guiGmailForm_qlGiaiDau"),
        subject: document.getElementById('subject'),
        message: document.getElementById('noiDungGmail'),
        subject_2: document.getElementById('subject_2'),
        message_2: document.getElementById('noiDung_2'),
    };
}


export function toggleForms() {
    const IDS = getElementIds();
    const radioQLDoiBong = IDS.radioQLDoiBong;
    const radioQLGiaiDau = IDS.radioQLGiaiDau;
    const formDoiBong = IDS.formDoiBong;
    const formGiaiDau = IDS.formGiaiDau;
    if (radioQLDoiBong.checked) {
        formDoiBong.style.display = "block";
        formGiaiDau.style.display = "none";
    } else if (radioQLGiaiDau.checked) {
        formDoiBong.style.display = "none";
        formGiaiDau.style.display = "block";
    }
}
export async function loadDanhSachGiaiDau_cuaBan(maNguoiTao) {
    const selectElement = document.getElementById("maGiaiDau_cuaBan");
    selectElement.innerHTML = '<option value="">-- Chọn Giải Đấu Của Bạn --</option>';
    const data = await hamChiTiet.layGiaiDauTheoQL(maNguoiTao);
    data.forEach(item => {
        const option = document.createElement("option");
        option.value = item.ma_giai_dau;
        option.textContent = `${item.ten_giai_dau} (${item.ma_giai_dau})`;
        selectElement.appendChild(option);
    });
}

export async function loadDanhSachGiaiDau() {
    const selectElement = document.getElementById("maGiaiDau");
    selectElement.innerHTML = '<option value="">-- Chọn Giải Đấu --</option>';
    const data = await hamChung.layDanhSach("giai_dau");
    data.forEach(item => {
        const option = document.createElement("option");
        option.value = item.ma_giai_dau;
        option.textContent = `${item.ten_giai_dau} (${item.ma_giai_dau})`;
        selectElement.appendChild(option);
    });
}

export async function loadDanhSachDoiBong_theo_quanLy(maQuanLy) {
    const selectElement = document.getElementById("maDoiBong");
    selectElement.innerHTML = '<option value="">-- Chọn Đội Bóng Của Bạn --</option>';
    const data = await hamChiTiet.layDoiBongTheoQL(maQuanLy);
    data.forEach(item => {
        const option = document.createElement("option");
        option.value = item.ma_doi_bong;
        option.textContent = `${item.ten_doi_bong} (${item.ma_doi_bong})`;
        selectElement.appendChild(option);
    });
}
export async function reset_form(){
    const IDS = getElementIds();
    IDS.formDoiBong.reset();
    IDS.formGiaiDau.reset();
    IDS.maGiaiDau.value = "";
    IDS.maDoiBong.value = "";
    IDS.maGiaiDau_cuaBan.value = "";
    IDS.subject.value = "";
    IDS.message.value = "";
    IDS.subject_2.value = "";
}