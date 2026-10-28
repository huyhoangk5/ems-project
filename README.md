# EMS - Event Management System
## Hệ thống Quản lý Sự kiện - Học viện Ngân hàng

---

## Công nghệ sử dụng

| Thành phần | Công nghệ |
|---|---|
| Backend | Java 17, Spring Boot 3.2, Spring Security, JWT |
| Frontend | React 18, Vite, React Router v6 |
| Database | MySQL 8.0 |
| Container | Docker, Docker Compose |

---

## Cấu trúc dự án

```
EMS/
├── docker-compose.yml          # Orchestration
├── db-init/
│   ├── 01-schema.sql           # Database schema
│   └── 02-data.sql             # Sample data
├── ems-backend/                # Spring Boot API
│   ├── Dockerfile
│   ├── pom.xml
│   └── src/main/java/com/ems/backend/
│       ├── entity/             # JPA Entities
│       ├── repository/         # Spring Data repositories
│       ├── service/            # Business logic
│       ├── controller/         # REST controllers
│       ├── dto/                # Data Transfer Objects
│       ├── security/           # JWT + Spring Security
│       └── config/             # Security, Web configs
└── ems-frontend/               # React + Vite
    ├── Dockerfile
    ├── nginx.conf
    └── src/
        ├── api/                # Axios API calls
        ├── context/            # AuthContext
        ├── components/         # Reusable components
        ├── pages/              # Page components by role
        └── utils/              # Helper functions
```

---

## Tài khoản mặc định

| Vai trò | Username | Mật khẩu |
|---|---|---|
| Quản trị viên | `admin` | `admin123` |
| Quản lý cấp cao | `trandmang` (Trần Đức Mạnh) | `password123` |
| Quản lý cấp cao | `hoangbchau` (Hoàng Bảo Châu) | `password123` |
| Quản lý cấp cao | `vuantu` (Vũ Anh Tú) | `password123` |
| CLB | `cac_club` (CLB Hướng nghiệp) | `password123` |
| CLB | `sec_club` (CLB Chứng khoán) | `password123` |
| CLB | `mcc_club` (CLB Người dẫn chương trình)| `password123` |
| CLB | `dsc_club` (CLB Khoa học Dữ liệu) | `password123` |
| Sinh viên | `27a4031327` (Lý Khánh Vy) | `password123` |
| Sinh viên | `26a4012457` (Lê Hoàng Nam) | `password123` |
| Sinh viên | `28a4073623` (Lê Ngọc Hà) | `password123` |

---

## Hướng dẫn chạy

### Yêu cầu
- Máy tính phải được cài đặt [Docker Desktop](https://www.docker.com/products/docker-desktop/).
- Đảm bảo các cổng (port) sau không bị chiếm dụng: 3000, 8080, 8081, 3306.

### Khởi động hệ thống
1. Đảm bảo **Docker Desktop** đang chạy (hoặc hệ thống sẽ tự cố gắng mở nếu bạn đang dùng Windows).
2. Nhấn đúp chuột vào file **`start.bat`**.
3. Chờ đợi quá trình tự động build image (nếu là lần đầu) và khởi động các container.
4. Khi quá trình hoàn tất, trình duyệt sẽ tự động mở trang chủ tại `http://localhost:3000`.

| Dịch vụ | URL |
|---|---|
| Frontend (React) | http://localhost:3000 |
| Backend API | http://localhost:8080/api |
| phpMyAdmin | http://localhost:8081 |

### Dừng hệ thống
1. Nhấn đúp chuột vào file **`stop.bat`**.
2. Hệ thống sẽ tự động dừng tất cả các container một cách an toàn.
3. Dữ liệu MySQL vẫn được bảo toàn. Bộ nhớ WSL2/Docker sẽ được tối ưu và giải phóng.

---

## API Endpoints

### Auth
| Method | URL | Mô tả |
|---|---|---|
| POST | `/api/auth/login` | Đăng nhập |
| POST | `/api/auth/register` | Đăng ký (Sinh viên) |

### Admin
| Method | URL | Mô tả |
|---|---|---|
| GET | `/api/admin/stats` | Thống kê tài khoản |
| GET | `/api/admin/users` | Danh sách tài khoản |
| POST | `/api/admin/users` | Tạo tài khoản |
| PUT | `/api/admin/users/{id}` | Sửa tài khoản |
| PATCH | `/api/admin/users/{id}/toggle-status` | Khóa/Mở khóa |
| DELETE | `/api/admin/users/{id}` | Xóa tài khoản |

### Club
| Method | URL | Mô tả |
|---|---|---|
| GET | `/api/club/events` | Sự kiện của CLB |
| POST | `/api/club/events` | Đăng tải sự kiện mới |
| PUT | `/api/club/events/{id}` | Sửa sự kiện |
| DELETE | `/api/club/events/{id}` | Xóa sự kiện |
| GET | `/api/club/events/{id}/registrations` | DS đăng ký |

### Approver
| Method | URL | Mô tả |
|---|---|---|
| GET | `/api/approver/stats` | Thống kê sự kiện |
| GET | `/api/approver/events` | Tất cả sự kiện |
| PATCH | `/api/approver/events/{id}/review` | Duyệt/Từ chối |

### Student
| Method | URL | Mô tả |
|---|---|---|
| GET | `/api/student/events` | Sự kiện đã duyệt |
| POST | `/api/student/events/{id}/register` | Đăng ký |
| DELETE | `/api/student/events/{id}/cancel` | Hủy đăng ký |
| GET | `/api/student/registrations` | Lịch sử đăng ký |

---

## Quy trình nghiệp vụ

```
CLB đăng tải sự kiện
    → Trạng thái: PENDING (Chờ duyệt)
    → Quản lý xem xét
        ├── Phê duyệt → APPROVED (Sinh viên có thể đăng ký)
        └── Từ chối  → REJECTED (CLB nhận thông báo + lý do)

Sinh viên đăng ký sự kiện APPROVED
    → Kiểm tra: còn hạn, chưa đủ slot, chưa đăng ký
    → Đăng ký thành công → REGISTERED
    → Hủy đăng ký (trước 24h) → CANCELLED
```
