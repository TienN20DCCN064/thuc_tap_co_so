
const FORM = {
    formatDateT_to_Date(dateTimeStr) {
        return formatDateT_to_Date(dateTimeStr);
    },
    formatDateT_to_DateTime(dateTimeStr) {
        return formatDateT_to_DateTime(dateTimeStr);
    }
};

function formatDateT_to_Date(dateTimeStr) {
    // Tạo đối tượng Date từ chuỗi
    const date = new Date(dateTimeStr);

    // Lấy yyyy-mm-dd
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

function formatDateT_to_DateTime(dateTimeStr) {
    const date = new Date(dateTimeStr);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}`;
}



export default FORM;