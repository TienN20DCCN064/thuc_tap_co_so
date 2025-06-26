document.addEventListener('DOMContentLoaded', () => {
    // Lấy tham chiếu tới ô tìm kiếm và danh sách sản phẩm
    const searchInput = document.getElementById('searchInput');
    const productContainer = document.getElementById('product-container');
    const products = productContainer.getElementsByClassName('product');

    // Lắng nghe sự kiện nhập liệu trong ô tìm kiếm
    searchInput.addEventListener('input', function () {
        const filter = searchInput.value.toLowerCase();

        // Lặp qua tất cả sản phẩm
        for (const product of products) {
            const masp = product.getAttribute('data-masp').toLowerCase();

            // Kiểm tra nếu mã sản phẩm chứa từ khóa tìm kiếm
            if (masp.includes(filter)) {
                product.style.display = ''; // Hiển thị sản phẩm
            } else {
                product.style.display = 'none'; // Ẩn sản phẩm
            }
        }
    });
});
