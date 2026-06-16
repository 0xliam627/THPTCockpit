<div align="center">

<img src="./public/img/graduation-hat.png" alt="THPT Cockpit Logo" width="80" height="80" />

# THPT Cockpit 🎓

**Hệ sinh thái Tra cứu & Tư vấn Xét tuyển Đại học Thông minh**

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

*Tra cứu điểm thi, xem học bạ, gợi ý trường và theo dõi lịch trình xét tuyển chỉ trong 1 nốt nhạc.*

</div>

---

## 🌟 Giới thiệu (Overview)

**THPT Cockpit** là một giải pháp toàn diện dành cho các sĩ tử chuẩn bị bước vào cánh cửa Đại học. Ứng dụng cung cấp các công cụ thiết yếu để tra cứu thông tin thi cử (điểm thi, giấy báo, học bạ), tự động tính điểm xét tốt nghiệp/đại học, cũng như cung cấp thông tin minh chứng xét tuyển sớm một cách trực quan, tối ưu và bảo mật.

Dự án được xây dựng với kiến trúc **Next.js App Router**, tích hợp các kỹ thuật bảo mật, SEO và thiết kế giao diện (UI/UX) đạt chuẩn hiện đại.

---

## 🚀 Tính năng nổi bật (Features)

- 🔒 **Đăng nhập tích hợp (SSO):** Kết nối trực tiếp vào hệ thống thi THPT Quốc Gia với cơ chế giải mã và bypass Captcha nội bộ. Lưu trữ phiên an toàn trên `localStorage`.
- 📊 **Dashboard Tra cứu Hồ sơ:**
  - **Giấy báo dự thi:** Xem số báo danh, phòng thi, giờ tập trung.
  - **Lịch thi chi tiết:** Hiển thị môn thi, giờ phát đề, giờ làm bài dưới dạng timeline.
  - **Học bạ 3 năm:** Liệt kê điểm trung bình môn từ Lớp 10 đến Lớp 12.
- 🧮 **Máy tính Tốt nghiệp & Đại học:**
  - Tự động tính điểm tổ hợp truyền thống (A00, A01, D01, B00...).
  - Tính điểm Xét tốt nghiệp (ĐXTN) tự động dựa trên quy chế 2025+.
- 🎯 **Gợi ý trường Đại học Thông minh:**
  - Tư vấn chọn trường/ngành dựa trên điểm thi và tổ hợp tương ứng.
  - Tích hợp dữ liệu Tuyển Sinh 247.
- 📑 **Hạn nộp Minh chứng (Early Admissions):**
  - Quản lý danh sách các trường Đại học có phương thức xét tuyển sớm.
  - Phân loại theo Khu vực (Miền Bắc, Miền Trung, Miền Nam).
  - Tích hợp Link Đề án và Cổng đăng ký.

---

## 🛠 Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Library:** React 19
- **Styling:** Tailwind CSS (Custom Design System, Glassmorphism)
- **Language:** TypeScript
- **Data Parsing:** PapaParse (CSV to JSON)
- **Deployment:** Vercel

---

## 💻 Cài đặt môi trường (Local Development)

Để chạy dự án này trên máy cá nhân, vui lòng làm theo các bước sau:

1. **Clone repository:**
   ```bash
   git clone https://github.com/0xliam627/THPTCockpit.git
   cd THPTCockpit
   ```

2. **Cài đặt thư viện (Dependencies):**
   ```bash
   npm install
   ```

3. **Khởi chạy môi trường phát triển (Dev Server):**
   ```bash
   npm run dev
   ```
   *Ứng dụng sẽ chạy tại địa chỉ: `http://localhost:3000`*

4. **Biên dịch bản Production (Build):**
   ```bash
   npm run build
   npm run start
   ```

---

## 🛡 Bảo mật & Quyền riêng tư

Dự án **THPT Cockpit** tuân thủ nghiêm ngặt các nguyên tắc bảo vệ quyền riêng tư:
- Toàn bộ dữ liệu phiên đăng nhập và token được xử lý qua Next.js Serverless Functions và trả về Client để lưu tại `localStorage` cục bộ.
- Không có bất kỳ Database bên thứ ba nào lưu trữ thông tin cá nhân của người dùng.
- Mã nguồn đã áp dụng các biện pháp Base64 Encoding cho các Base URL trọng yếu để tránh các công cụ scan nội dung tự động.

---

## 📄 Giấy phép (License)

Dự án được phân phối dưới giấy phép **MIT License**. Bạn hoàn toàn có thể tự do chỉnh sửa, phân phối hoặc đóng góp vào hệ sinh thái chung.

<div align="center">
  <p>Được thiết kế và phát triển với ❤️ bởi <b><a href="https://github.com/0xliam627">harryitz</a></b></p>
</div>
