document.addEventListener("DOMContentLoaded", function () {
    // Your code here

    // Sử dụng Fetch API để tải nội dung file HTML và chèn vào vị trí div
    fetch('/frontend/assets/public/src/common/quanly/header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('chen').innerHTML = data;
        })
        .catch(error => console.error('Error loading HTML:', error));

});