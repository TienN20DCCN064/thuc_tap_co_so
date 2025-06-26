const PrimaryKeys = {
    "truong": ["ma_truong"],
    // Trường học
    "vai_tro": ["ma_vai_tro"],                        // Vai trò người dùng
    "nguoi_dung": ["ma_nguoi_dung"],                 // Người dùng
    "tai_khoan": ["ma_nguoi_dung"],                  // Dùng chung mã người dùng làm khóa chính

    "doi_bong": ["ma_doi_bong"],                     // Đội bóng
    "vi_tri_cau_thu": ["ma_vi_tri"],                 // Vị trí cầu thủ
    "cau_thu": ["ma_cau_thu"],                       // Cầu thủ

    "loai_trong_tai": ["ma_loai_trong_tai"],         // Loại trọng tài
    "trong_tai": ["ma_trong_tai"],

    "giai_dau": ["ma_giai_dau"],                     // Giải đấu
    "cau_hinh_giai_dau": ["ma_giai_dau"],            // Cấu hình cho giải đấu
    "vong_dau": ["ma_giai_dau", "ten_vong_dau"],     // Vòng đấu (khóa chính kép)
    "bang_dau": ["ma_giai_dau", "ten_bang_dau"],     // Bảng đấu (khóa chính kép)
    "san_van_dong": ["ma_san"],                      // tên sân trong 1 giải có thể trùng nhau

    "doi_bong_giai_dau": ["ma_doi_bong", "ma_giai_dau"], // Đội đăng ký giải
    "cau_thu_giai_dau": ["ma_cau_thu", "ma_giai_dau"], // Thông tin cầu thủ trong giải
    "trong_tai_tran_dau": ["ma_tran_dau", "ma_trong_tai"], // Gán trọng tài cho trận

    "tran_dau": ["ma_tran_dau"],                     // Trận đấu
    "su_kien_tran_dau": ["ma_su_kien"],              // Sự kiện trong trận

    "bang_xep_hang_vong_dau": ["ma_giai_dau", "ten_vong_dau", "ma_doi_bong"], // Bảng xếp hạng theo vòng
    "quy_tac_tinh_diem": ["ma_giai_dau", "ten_vong_dau"],  // Quy tắc tính điểm theo vòng
};

export default PrimaryKeys;