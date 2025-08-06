
const PrimaryKeys = {
  // "truong": ["ma_truong"],                                
  // "vai_tro": ["ma_vai_tro"],                              
  // "nguoi_dung": ["ma_nguoi_dung"],                        
  // "tai_khoan": ["ma_nguoi_dung"],                         

  "doi_bong": ["ma_doi_bong"],                           
  "vi_tri_cau_thu": ["ma_vi_tri"],                        
  "cau_thu": ["ma_cau_thu"],                              

  "loai_trong_tai": ["ma_loai_trong_tai"],                
  "trong_tai": ["ma_trong_tai"],                          

  "giai_dau": ["ma_giai_dau"],                          // dùng        
  "cau_hinh_giai_dau": ["ma_giai_dau"],                   // dùng 
  "vong_dau": ["ma_vong_dau"],                            
  "bang_dau": ["ma_bang_dau"],                           
  "san_van_dong": ["ma_san"],                            

  "doi_bong_giai_dau": ["ma_doi_bong", "ma_giai_dau"],    
  "cau_thu_giai_dau": ["ma_cau_thu", "ma_giai_dau"],     
  "trong_tai_tran_dau": ["ma_tran_dau", "ma_trong_tai"], 

  "tran_dau": ["ma_tran_dau"],
  "su_kien_tran_dau": ["ma_su_kien"],

  
  "quy_tac_tinh_diem": ["ma_giai_dau", "ma_vong_dau"],    
  "cau_hinh_giao_dien": ["ma_cau_hinh_giao_dien"],                

};

const PrimaryKeys_not_token = {
  "truong": ["ma_truong"],                                // Trường học
  "vai_tro": ["ma_vai_tro"],                              // Vai trò người dùng
  "nguoi_dung": ["ma_nguoi_dung"],                        // Người dùng
  "tai_khoan": ["ma_nguoi_dung"],                         // Tài khoản (dùng chung mã người dùng)

  "doi_bong": ["ma_doi_bong"],                            // Đội bóng
  "vi_tri_cau_thu": ["ma_vi_tri"],                        // Vị trí cầu thủ
  "cau_thu": ["ma_cau_thu"],                              // Cầu thủ

  "loai_trong_tai": ["ma_loai_trong_tai"],                // Loại trọng tài
  "trong_tai": ["ma_trong_tai"],                          // Trọng tài

  "giai_dau": ["ma_giai_dau"],                            // Giải đấu
  "cau_hinh_giai_dau": ["ma_giai_dau"],                   // Cấu hình giải đấu
  "vong_dau": ["ma_vong_dau"],                            // Vòng đấu (đã chuyển sang dùng mã vòng đấu làm PK)
  "bang_dau": ["ma_bang_dau"],                            // Bảng đấu (đã chuyển sang dùng mã bảng đấu làm PK)
  "san_van_dong": ["ma_san"],                             // Sân vận động

  "doi_bong_giai_dau": ["ma_doi_bong", "ma_giai_dau"],    // Đội bóng tham gia giải
  "cau_thu_giai_dau": ["ma_cau_thu", "ma_giai_dau"],      // Cầu thủ tham gia giải
  "trong_tai_tran_dau": ["ma_tran_dau", "ma_trong_tai"],  // Phân công trọng tài trận

  "tran_dau": ["ma_tran_dau"],                            // Trận đấu
  "su_kien_tran_dau": ["ma_su_kien"],                     // Sự kiện trận đấu

  // "bang_xep_hang_vong_dau": ["ma_giai_dau", "ma_vong_dau", "ma_doi_bong"], // BXH vòng đấu
  "quy_tac_tinh_diem": ["ma_giai_dau", "ma_vong_dau"],    // Quy tắc tính điểm
  "cau_hinh_giao_dien": ["ma_cau_hinh_giao_dien"],                // Cấu hình giao diện người dùng
};



export default PrimaryKeys;
export { PrimaryKeys_not_token };