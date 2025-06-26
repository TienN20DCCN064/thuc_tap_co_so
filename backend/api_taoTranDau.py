from flask import Flask, request, jsonify
import itertools
import random
from flask_cors import CORS  # Import flask_cors

app = Flask(__name__)
port = 5001 ;           # api chạy trên cổng
# Cho phép CORS cho tất cả các nguồn (origins)
CORS(app)

# # Chia bảng 
# ok ok ok ok ok 
#  POST /api/chia-bang
# {
#   "teams": ["Đội A", "Đội B", "Đội C", "Đội D"],
#   "so_bang": 2,
#   "random": true
# }
# 2. POST /api/vong-tron
# {
#   "teams": ["Đội A", "Đội B", "Đội C"]
# }

# # 3. POST /api/loai-truc-tiep
# {
#   "teams": ["Đội A", "Đội B", "Đội C", "Đội D", "Đội E", "Đội F", "Đội G", "Đội H", "Đội T"],
#   "randomize": false
# }

hinh_thuc_tao_doi = {
    "chia-bang": {
        "ten":"chia bảng",
        "url": "/api_taoTranDau/chia-bang",
        "mo_ta": "Chia các đội vào các bảng"
    },
    "vong-tron": {
         "ten":"vòng tròn",
        "url": "/api_taoTranDau/vong-tron",
        "mo_ta": "Xếp lịch thi đấu vòng tròn giữa các đội"
    },
    "loai-truc-tiep": {
         "ten":"loại trực tiếp",
        "url": "/api_taoTranDau/loai-truc-tiep",
        "mo_ta": "Thi đấu loại trực tiếp, nếu số đội lẻ sẽ có đội được miễn"
    }
}


def chia_thanh_bang(danh_sach_doi, danh_sach_doi_hatDong, danh_sach_bang, ngau_nhien=False):
    so_bang = len(danh_sach_bang)

    # Xáo trộn nếu có yêu cầu
    if ngau_nhien:
        random.shuffle(danh_sach_doi_hatDong)
        random.shuffle(danh_sach_doi)
        

    # # Loại bỏ các đội hạt giống khỏi danh_sach_doi để không bị trùng
    # danh_sach_doi = [doi for doi in danh_sach_doi if doi not in danh_sach_doi_hatDong]
    # Chỉ giữ các đội hạt giống có trong danh_sach_doi
    danh_sach_doi_hatDong = [doi for doi in danh_sach_doi_hatDong if doi in danh_sach_doi]

    # Loại các đội hạt giống khỏi danh_sach_doi để tránh bị trùng
    danh_sach_doi = [doi for doi in danh_sach_doi if doi not in danh_sach_doi_hatDong]

    # print("Danh sách đội hạt giống:", danh_sach_doi_hatDong)
    # print("Danh sách đội còn lại:", danh_sach_doi)

    # Khởi tạo danh sách bảng với tên và danh sách đội rỗng
    danh_sach_bang_ket_qua = [
        {
            "bang": danh_sach_bang[i] if i < len(danh_sach_bang) else f"Bảng {chr(65 + i)}",
            "doi": []
        }
        for i in range(so_bang)
    ]

    # Bước 1: Chia đều đội hạt giống vào các bảng
    for idx, doi in enumerate(danh_sach_doi_hatDong):
        index_bang = idx % so_bang
        danh_sach_bang_ket_qua[index_bang]["doi"].append(doi)

    # Bước 2: Chia các đội còn lại vào bảng một cách đều nhau
    tong_doi_con_lai = len(danh_sach_doi)
    doi_moi_bang = tong_doi_con_lai // so_bang
    du = tong_doi_con_lai % so_bang

    start = 0
    for i in range(so_bang):
        so_doi = doi_moi_bang + (1 if i < du else 0)
        danh_sach_bang_ket_qua[i]["doi"].extend(danh_sach_doi[start:start + so_doi])
        start += so_doi

    return danh_sach_bang_ket_qua


# Lịch vòng tròn
#  ok ok ok ok ok ok ok okok
def xep_lich_vong_tron(danh_sach_doi):
    tran_dau = list(itertools.combinations(danh_sach_doi, 2))
    ket_qua = []
    for i, tran in enumerate(tran_dau, start=1):
        ket_qua.append({
            "tran": i,
            "doi1": tran[0],
            "doi2": tran[1]
        })
    return ket_qua

# Lịch loại trực tiếp
# nếu danh sách là lẻ thì miễn thi đấu cho đổi đầu tiên
def xep_lich_loai_truc_tiep(danh_sach_doi, randomize=True):
    ds_doi = danh_sach_doi.copy()
    
    if randomize:
        random.shuffle(ds_doi)

    doi_duoc_mien = None
    if len(ds_doi) % 2 != 0:
        if randomize:
            doi_duoc_mien = ds_doi.pop()
        else:
            doi_duoc_mien = ds_doi[0]
            ds_doi = ds_doi[1:]

    ket_qua = []
    for i in range(0, len(ds_doi), 2):
        ket_qua.append({
            "tran": (i // 2) + 1,
            "doi1": ds_doi[i],
            "doi2": ds_doi[i + 1]
        })

    return ket_qua, doi_duoc_mien


# ------------------- API -------------------
@app.route("/api_taoTranDau", methods=["GET"])
def api_hinh_thuc_tao_doi():
    return jsonify(hinh_thuc_tao_doi)




@app.route("/api_taoTranDau/chia-bang", methods=["POST"])
def api_chia_bang():
    data = request.json
    print("Dữ liệu nhận được từ client:", data)
    # Lấy danh sách đội
    danh_sach_doi = data.get("teams", [])  # Tất cả các đội
    danh_sach_doi_hat_dong = data.get("danh_sach_doi_hat_dong", [])  # Danh sách đội hạt giống
    danh_sach_bang = data.get("bangs", [])  # Danh sách tên bảng
    ngau_nhien = data.get("random", False)

    # Gọi hàm chia bảng mới
    ket_qua = chia_thanh_bang(danh_sach_doi, danh_sach_doi_hat_dong, danh_sach_bang, ngau_nhien)

    return jsonify({"bangs": ket_qua})




@app.route("/api_taoTranDau/vong-tron", methods=["POST"])
def api_vong_tron():
    data = request.json
    doi_bong = data.get("teams", [])

    ket_qua = xep_lich_vong_tron(doi_bong)
    return jsonify({"lich_thi_dau": ket_qua})


# API cho xếp lịch loại trực tiếp
@app.route("/api_taoTranDau/loai-truc-tiep", methods=["POST"])
def api_loai_truc_tiep():
    data = request.json
    doi_bong = data.get("teams", [])
    randomize = data.get("randomize", False)  # Mặc định là False nếu không có tham số này

    ket_qua, duoc_mien = xep_lich_loai_truc_tiep(doi_bong, randomize)

    return jsonify({
        "lich_thi_dau": ket_qua,
        "doi_duoc_mien": duoc_mien
    })

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=port)

    # cd "C:\Users\vanti\Desktop\5_2\6A _ NMCN Phần Mềm_ Châu Văn Vân\DO_AN\quan_ly_tran_dau\backend\services\global"
