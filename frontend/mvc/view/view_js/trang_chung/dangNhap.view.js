import hamChung from "/frontend/mvc/model/global/model.hamChung.js";

export function getElementIds() {
  return {
    loginForm: document.getElementById("loginForm"),
    taiKhoanInput: document.getElementById("taiKhoan"),
    matKhauInput: document.getElementById("matKhau"),
    dialog: document.getElementById("dialog-chon-doi"),
    danhSachDoi: document.getElementById("danhSachDoi"),
    btnDangNhap: document.getElementById("btnDangNhap")
  };
}


export function show_list_doiBong(dataDoiBong_theoQl, onItemClick) {
  const { dialog, danhSachDoi } = getElementIds();
  {
    danhSachDoi.innerHTML = ""; // clear

    dataDoiBong_theoQl.forEach(doi => {
      const item = document.createElement("div");
      item.className = "dialog-item";
      item.innerText = doi.ten_doi_bong;
      item.onclick = () => {
        onItemClick(doi); // controller xử lý
      };
      danhSachDoi.appendChild(item);
    });

    dialog.style.display = "flex";
  }
}

export function closeDialogChonDoi() {
  const dialog = document.getElementById("dialog-chon-doi");
  if (dialog) dialog.style.display = "none";
}

export function setupDialogCloseHandler() {
  const dialog = document.getElementById("dialog-chon-doi");

  dialog.addEventListener("click", (e) => {
    if (e.target === dialog) {
      dialog.style.display = "none";
    }
  });
}