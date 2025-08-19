import hamChung from "/frontend/mvc/model/global/model.hamChung.js";
import { GlobalStore, DoiTuyen } from "/frontend/global/global.js";
import FORM from "/frontend/mvc/controller/EditFormData.controller.js";
const MA_DOI_BONG = DoiTuyen.getDoiTuyen_dangChon(); // Lấy mã đội bóng đang chọn từ global
export function getElementIds() {
    return {

        form: document.getElementById("inputForm"),
        ngay_chon_viewbody: document.getElementById("ngay_chon_viewbody"),

        tableBody: document.getElementById("dataTable"),
    };
}

export async function viewTbody(data) {
    console.log("viewTbody", data);
    const { tableBody } = getElementIds();
    tableBody.innerHTML = "";
    for (const item of data) {
        let maDoiNha;
        let maDoiKhach;
        if (item.ma_doi_1 === MA_DOI_BONG) {
            maDoiNha = item.ma_doi_1;
            maDoiKhach = item.ma_doi_2;

        } else {
            maDoiNha = item.ma_doi_2;
            maDoiKhach = item.ma_doi_1;
        }
        console.log("maDoiNha_khach", maDoiNha, "----", maDoiKhach);


        const dataGiaiDau = await hamChung.layThongTinTheo_ID("giai_dau", item.ma_giai_dau);
        const dataDoiNha = await hamChung.layThongTinTheo_ID("doi_bong", maDoiNha);
        const dataDoiKhach = await hamChung.layThongTinTheo_ID("doi_bong", maDoiKhach);
        const dataSan = await hamChung.layThongTinTheo_ID("san_van_dong", item.ma_san);
        const row = document.createElement("tr");
        row.innerHTML = `
            <td style="text-align: center;">${dataGiaiDau.ten_giai_dau || "---"}</td>
            <td style="text-align: center;">${item.ma_tran_dau || "---"}</td>
            <td style="text-align: center;">${dataDoiNha.ten_doi_bong || "---"}</td>
            <td style="text-align: center;">${dataDoiKhach.ten_doi_bong || "---"}</td>
            <td style="text-align: center;">${FORM.formatDateT_to_DateTime(item.thoi_gian_dien_ra) || "---"}</td>
            <td style="text-align: center;">${dataSan.ten_san || "---"}</td>
        `;
        tableBody.appendChild(row);
    }
}


