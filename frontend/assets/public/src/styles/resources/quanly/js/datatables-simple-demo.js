/*
tìm phần tử có id="datatablesSimple" và nếu nó tồn tại,
 nó sẽ sử dụng simpleDatatables.DataTable 
 để biến bảng này thành một bảng có thể tìm kiếm, phân trang và sắp xếp.
*/
window.addEventListener('DOMContentLoaded', event => {
    // Simple-DataTables
    // https://github.com/fiduswriter/Simple-DataTables/wiki

    const datatablesSimple = document.getElementById('datatablesSimple');
    if (datatablesSimple) {
        new simpleDatatables.DataTable(datatablesSimple);
    }
});
