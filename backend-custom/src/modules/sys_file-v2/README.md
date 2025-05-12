
<a id="readme-top"></a>
<div align="center">
  <h3 align="center">Administrators documentation</h3>
</div>
<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li><a href="#database">Database</a></li>
    <li><a href="#main-flow">Main flow</a></li>
    <li><a href="#important-processing-flows">Important processing flows</a></li>
    <li><a href="#functions-on-web-management">Functions on web management</a></li>
  </ol>
</details>

<br>

# Database

<p align="right">(<a href="#readme-top">back to top</a>)</p>

# Main flow
- Form Data cần save, ngoài các data dạng text lưu vào database, có thêm dữ liệu là file.
- Loại nghiệp vụ này Client xử lý qua 2 bước. 
- Bước 1: Upload hết toàn bộ file lên.
    - Client gọi đến API upload file. Upload lần lượt toàn bộ file lên server.
    - Server trả về thông tin file đã được upload. vd: tên file, 


# MODULE Upload file
## Tổng quan
- Lưu trữ file
- File public không giới hạn quyền, miễn có id file là có thể download đc

## Luồng sử dụng
- UPLOAD
    + Gọi api upload file 
    + nhận về thông tin file
    + tiếp tục xử lý các nghiệp vụ tiếp theo, lưu lại server_filename để truy xuất sau này

- TRUY XUẤT FILE
    + Gọi qua service
    + Input: server_filename đã lưu trước đó
    + Trả về thông tin file + url file (+ blurHash + url các cấu hình resize nếu là hình)
    
- DOWNLOAD
    + Input: server_filename