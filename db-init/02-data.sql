-- EMS Sample Data from Excel
-- All passwords are BCrypt hashed
-- admin123  -> $2b$10$eBnRnsrC6UNHe2FLs3SKH.LH624GGVUAV33T9rXag3DCGYDxAAiB.
-- password123 -> $2b$10$rdjrOW9D3urBxOpQ.lQazObS8Ebj7zv1BKwj5viT64wTKL0nwKsWC

SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;
USE ems_db;

-- =============================================
-- Organizations
-- =============================================
INSERT INTO organizations (orgName, orgType, description) VALUES
('Đoàn Thanh niên Học viện Ngân hàng', 'Đoàn thể', 'Tổ chức Đoàn TNCS Hồ Chí Minh tại Học viện Ngân hàng'),
('Hội Sinh viên Học viện Ngân hàng', 'Đoàn thể', 'Tổ chức Hội Sinh viên tại Học viện Ngân hàng'),
('Phòng Công tác sinh viên', 'Phòng ban', 'Phòng quản lý các hoạt động sinh viên'),
('Khoa Ngân hàng', 'Khoa', 'Khoa đào tạo chuyên ngành Ngân hàng'),
('Khoa Tài chính', 'Khoa', 'Khoa đào tạo chuyên ngành Tài chính');

-- =============================================
-- Users - Admin
-- =============================================
INSERT INTO users (fullName, username, password, role, status) VALUES
('Quản trị viên', 'admin', '$2b$10$eBnRnsrC6UNHe2FLs3SKH.LH624GGVUAV33T9rXag3DCGYDxAAiB.', 'ADMIN', 'ACTIVE');

-- =============================================
-- Users - Approvers (password: password123)
-- idOrg: 1=Đoàn TN, 2=Hội SV, 3=Phòng CTSV
-- =============================================
INSERT INTO users (fullName, username, password, role, status, phoneNumber, studentCode) VALUES
('Trần Đức Mạnh', 'trandmang', '$2b$10$rdjrOW9D3urBxOpQ.lQazObS8Ebj7zv1BKwj5viT64wTKL0nwKsWC', 'APPROVER', 'ACTIVE', '0968452173', 'NHH00265'),
('Hoàng Bảo Châu', 'hoangbchau', '$2b$10$rdjrOW9D3urBxOpQ.lQazObS8Ebj7zv1BKwj5viT64wTKL0nwKsWC', 'APPROVER', 'ACTIVE', '0906284517', '26A4029367'),
('Vũ Anh Tú', 'vuantu', '$2b$10$rdjrOW9D3urBxOpQ.lQazObS8Ebj7zv1BKwj5viT64wTKL0nwKsWC', 'APPROVER', 'ACTIVE', '0981763425', 'NHH00164');

-- =============================================
-- Users - Clubs (password: password123)
-- =============================================
INSERT INTO users (fullName, username, password, role, status, phoneNumber) VALUES
-- Phong Cong tac sinh vien (idOrg=3)
('CLB Cố vấn học tập', 'acc_club', '$2b$10$rdjrOW9D3urBxOpQ.lQazObS8Ebj7zv1BKwj5viT64wTKL0nwKsWC', 'CLUB', 'ACTIVE', '0915827364'),
('CLB Hướng nghiệp', 'cac_club', '$2b$10$rdjrOW9D3urBxOpQ.lQazObS8Ebj7zv1BKwj5viT64wTKL0nwKsWC', 'CLUB', 'ACTIVE', '0983417256'),
('CLB Nhiếp ảnh và Sự kiện', 'cop_club', '$2b$10$rdjrOW9D3urBxOpQ.lQazObS8Ebj7zv1BKwj5viT64wTKL0nwKsWC', 'CLUB', 'ACTIVE', '0867254913'),
-- Doan Thanh nien (idOrg=1)
('Liên chi đoàn Khoa Ngân hàng', 'lcd_nh', '$2b$10$rdjrOW9D3urBxOpQ.lQazObS8Ebj7zv1BKwj5viT64wTKL0nwKsWC', 'CLUB', 'ACTIVE', '0936148275'),
('Đội Thủ lĩnh Đoàn', 'doi_tld', '$2b$10$rdjrOW9D3urBxOpQ.lQazObS8Ebj7zv1BKwj5viT64wTKL0nwKsWC', 'CLUB', 'ACTIVE', '0863147258'),
('CLB Đại sứ học tập', 'clb_dsht', '$2b$10$rdjrOW9D3urBxOpQ.lQazObS8Ebj7zv1BKwj5viT64wTKL0nwKsWC', 'CLUB', 'ACTIVE', '0975261834'),
-- Hoi Sinh vien (idOrg=2)
('Đội Sinh viên tình nguyện HVNH', 'bavt_club', '$2b$10$rdjrOW9D3urBxOpQ.lQazObS8Ebj7zv1BKwj5viT64wTKL0nwKsWC', 'CLUB', 'ACTIVE', '0943157286'),
('Đội Văn nghệ HVNH', 'baat_club', '$2b$10$rdjrOW9D3urBxOpQ.lQazObS8Ebj7zv1BKwj5viT64wTKL0nwKsWC', 'CLUB', 'ACTIVE', '0865273149'),
('CLB Chứng khoán', 'sec_club', '$2b$10$rdjrOW9D3urBxOpQ.lQazObS8Ebj7zv1BKwj5viT64wTKL0nwKsWC', 'CLUB', 'ACTIVE', '0912756843'),
('CLB Người dẫn chương trình', 'mcc_club', '$2b$10$rdjrOW9D3urBxOpQ.lQazObS8Ebj7zv1BKwj5viT64wTKL0nwKsWC', 'CLUB', 'ACTIVE', '0931865427'),
('CLB Khoa học Dữ liệu', 'dsc_club', '$2b$10$rdjrOW9D3urBxOpQ.lQazObS8Ebj7zv1BKwj5viT64wTKL0nwKsWC', 'CLUB', 'ACTIVE', '0973158264'),
('CLB Tài chính', 'fc_club', '$2b$10$rdjrOW9D3urBxOpQ.lQazObS8Ebj7zv1BKwj5viT64wTKL0nwKsWC', 'CLUB', 'ACTIVE', '0985362714'),
('CLB Khởi nghiệp', 'stc_club', '$2b$10$rdjrOW9D3urBxOpQ.lQazObS8Ebj7zv1BKwj5viT64wTKL0nwKsWC', 'CLUB', 'LOCKED', '0914286753');

-- =============================================
-- Users - Students (password: password123)
-- =============================================
INSERT INTO users (fullName, username, password, role, status, gender, dateOfBirth, phoneNumber, studentCode, classCode) VALUES
('Vũ Đức Anh', '26a4020400', '$2b$10$rdjrOW9D3urBxOpQ.lQazObS8Ebj7zv1BKwj5viT64wTKL0nwKsWC', 'STUDENT', 'ACTIVE', 'Nam', '2005-10-03', '0936812457', '26A4020400', 'K26CLC-KTB'),
('Phạm Lan Hương', '26a4020830', '$2b$10$rdjrOW9D3urBxOpQ.lQazObS8Ebj7zv1BKwj5viT64wTKL0nwKsWC', 'STUDENT', 'ACTIVE', 'Nữ', '2005-06-10', '0978253146', '26A4020830', 'K26CLC-KTD'),
('Nguyễn Minh Anh', '26a4010919', '$2b$10$rdjrOW9D3urBxOpQ.lQazObS8Ebj7zv1BKwj5viT64wTKL0nwKsWC', 'STUDENT', 'ACTIVE', 'Nữ', '2005-03-15', '0912345678', '26A4010919', 'K26CLC-NHC'),
('Cao Việt Hoàng', '26a4033193', '$2b$10$rdjrOW9D3urBxOpQ.lQazObS8Ebj7zv1BKwj5viT64wTKL0nwKsWC', 'STUDENT', 'ACTIVE', 'Nam', '2005-09-30', '0854297613', '26A4033193', 'K26CLC-QTKDC'),
('Hồ Gia Bảo', '26a4011084', '$2b$10$rdjrOW9D3urBxOpQ.lQazObS8Ebj7zv1BKwj5viT64wTKL0nwKsWC', 'STUDENT', 'ACTIVE', 'Nam', '2005-07-09', '0876214539', '26A4011084', 'K26CNTCA'),
('Vũ Hải Yến', '26a4062577', '$2b$10$rdjrOW9D3urBxOpQ.lQazObS8Ebj7zv1BKwj5viT64wTKL0nwKsWC', 'STUDENT', 'ACTIVE', 'Nữ', '2005-07-28', '0867392154', '26A4062577', 'K26LKTD'),
('Trần Quốc Huy', '26a4031478', '$2b$10$rdjrOW9D3urBxOpQ.lQazObS8Ebj7zv1BKwj5viT64wTKL0nwKsWC', 'STUDENT', 'ACTIVE', 'Nam', '2005-07-22', '0987654321', '26A4031478', 'K26QTKDA'),
('Lê Hoàng Nam', '26a4012457', '$2b$10$rdjrOW9D3urBxOpQ.lQazObS8Ebj7zv1BKwj5viT64wTKL0nwKsWC', 'STUDENT', 'ACTIVE', 'Nam', '2005-04-13', '0935248176', '26A4012457', 'K26TCB'),
('Trương Mai Chi', '26a4011982', '$2b$10$rdjrOW9D3urBxOpQ.lQazObS8Ebj7zv1BKwj5viT64wTKL0nwKsWC', 'STUDENT', 'ACTIVE', 'Nữ', '2005-04-29', '0982137465', '26A4011982', 'K26TCD'),
('Nguyễn Minh Nguyệt', '27a4010670', '$2b$10$rdjrOW9D3urBxOpQ.lQazObS8Ebj7zv1BKwj5viT64wTKL0nwKsWC', 'STUDENT', 'ACTIVE', 'Nữ', '2006-05-13', '0943185625', '27A4010670', 'K27CLC-NHA'),
('Bùi Thành Nam', '27a4031256', '$2b$10$rdjrOW9D3urBxOpQ.lQazObS8Ebj7zv1BKwj5viT64wTKL0nwKsWC', 'STUDENT', 'ACTIVE', 'Nam', '2006-05-25', '0963278145', '27A4031256', 'K27CLC-QTKDA'),
('Trần Ngọc Ánh', '27a4012036', '$2b$10$rdjrOW9D3urBxOpQ.lQazObS8Ebj7zv1BKwj5viT64wTKL0nwKsWC', 'STUDENT', 'ACTIVE', 'Nữ', '2006-12-24', '0883127456', '27A4012036', 'K27CLC-TCE'),
('Phạm Minh Đức', '27a4043284', '$2b$10$rdjrOW9D3urBxOpQ.lQazObS8Ebj7zv1BKwj5viT64wTKL0nwKsWC', 'STUDENT', 'ACTIVE', 'Nam', '2006-08-07', '0974561832', '27A4043284', 'K27HTTTB'),
('Võ Thùy Dương', '27a4071661', '$2b$10$rdjrOW9D3urBxOpQ.lQazObS8Ebj7zv1BKwj5viT64wTKL0nwKsWC', 'STUDENT', 'ACTIVE', 'Nữ', '2006-03-21', '0945678123', '27A4071661', 'K27KTDTB'),
('Lý Khánh Vy', '27a4031327', '$2b$10$rdjrOW9D3urBxOpQ.lQazObS8Ebj7zv1BKwj5viT64wTKL0nwKsWC', 'STUDENT', 'ACTIVE', 'Nữ', '2006-06-05', '0837164925', '27A4031327', 'K27QTKDB'),
('Đỗ Phương Thảo', '27a4012127', '$2b$10$rdjrOW9D3urBxOpQ.lQazObS8Ebj7zv1BKwj5viT64wTKL0nwKsWC', 'STUDENT', 'ACTIVE', 'Nữ', '2006-09-17', '0916583274', '27A4012127', 'K27TCD'),
('Phạm Tuấn Kiệt', '28a4022751', '$2b$10$rdjrOW9D3urBxOpQ.lQazObS8Ebj7zv1BKwj5viT64wTKL0nwKsWC', 'STUDENT', 'ACTIVE', 'Nam', '2007-02-19', '0865247193', '28A4022751', 'K28CLC-KTB'),
('Lê Ngọc Hà', '28a4073623', '$2b$10$rdjrOW9D3urBxOpQ.lQazObS8Ebj7zv1BKwj5viT64wTKL0nwKsWC', 'STUDENT', 'ACTIVE', 'Nữ', '2007-11-08', '0973124586', '28A4073623', 'K28CLC-KTDTA'),
('Đặng Trung Kiên', '28a4073570', '$2b$10$rdjrOW9D3urBxOpQ.lQazObS8Ebj7zv1BKwj5viT64wTKL0nwKsWC', 'STUDENT', 'ACTIVE', 'Nam', '2007-03-02', '0906284517', '28A4073570', 'K28CLC-KTDTB'),
('Hoàng Thu Trang', '28a4073590', '$2b$10$rdjrOW9D3urBxOpQ.lQazObS8Ebj7zv1BKwj5viT64wTKL0nwKsWC', 'STUDENT', 'ACTIVE', 'Nữ', '2007-06-27', '0908765432', '28A4073590', 'K28CLC-KTDTB'),
('Dương Minh Quân', '28a4033475', '$2b$10$rdjrOW9D3urBxOpQ.lQazObS8Ebj7zv1BKwj5viT64wTKL0nwKsWC', 'STUDENT', 'ACTIVE', 'Nam', '2007-11-23', '0905126387', '28A4033475', 'K28CLC-MKTSA'),
('Nguyễn Quỳnh Anh', '28a4020430', '$2b$10$rdjrOW9D3urBxOpQ.lQazObS8Ebj7zv1BKwj5viT64wTKL0nwKsWC', 'STUDENT', 'ACTIVE', 'Nữ', '2007-05-16', '0917836245', '28A4020430', 'K28KTB'),
('Đặng Khánh Linh', '28a4071448', '$2b$10$rdjrOW9D3urBxOpQ.lQazObS8Ebj7zv1BKwj5viT64wTKL0nwKsWC', 'STUDENT', 'ACTIVE', 'Nữ', '2007-01-12', '0884951263', '28A4071448', 'K28KTDTA'),
('Phan Anh Dũng', '28a4052041', '$2b$10$rdjrOW9D3urBxOpQ.lQazObS8Ebj7zv1BKwj5viT64wTKL0nwKsWC', 'STUDENT', 'ACTIVE', 'Nam', '2007-08-14', '0903456781', '28A4052041', 'K28LOGA'),
('Đinh Ngọc Mai', '28a4010734', '$2b$10$rdjrOW9D3urBxOpQ.lQazObS8Ebj7zv1BKwj5viT64wTKL0nwKsWC', 'STUDENT', 'ACTIVE', 'Nữ', '2007-10-26', '0924381765', '28A4010734', 'K28NHB'),
('Mai Thanh Hằng', '28a4031140', '$2b$10$rdjrOW9D3urBxOpQ.lQazObS8Ebj7zv1BKwj5viT64wTKL0nwKsWC', 'STUDENT', 'ACTIVE', 'Nữ', '2007-02-11', '0986317254', '28A4031140', 'K28QTDLA'),
('Nguyễn Nhật Minh', '28a4030967', '$2b$10$rdjrOW9D3urBxOpQ.lQazObS8Ebj7zv1BKwj5viT64wTKL0nwKsWC', 'STUDENT', 'ACTIVE', 'Nam', '2007-01-18', '0968452173', '28A4030967', 'K28QTKDA'),
('Nguyễn Hoàng Long', '28a4031083', '$2b$10$rdjrOW9D3urBxOpQ.lQazObS8Ebj7zv1BKwj5viT64wTKL0nwKsWC', 'STUDENT', 'ACTIVE', 'Nam', '2007-12-06', '0897345612', '28A4031083', 'K28QTKDB');

-- =============================================
-- Clubs
-- Users: admin=1, approver: trandmang=2, hoangbchau=3, vuantu=4
-- Club users start at idUser=5 (acc_club) to 17 (stc_club)
-- idOrg: 1=Đoàn TN, 2=Hội SV, 3=Phòng CTSV
-- =============================================
INSERT INTO clubs (clubName, shortName, description, leaderName, leaderPhone, leaderCode, idOrg, idUser) VALUES
('CLB Cố vấn học tập', 'ACC', 'Câu lạc bộ hỗ trợ học tập và cố vấn học thuật cho sinh viên', 'Nguyễn Trọng Nghĩa', '0915827364', '26A4015832', 3, 5),
('CLB Hướng nghiệp', 'CAC', 'Câu lạc bộ hướng nghiệp và phát triển kỹ năng nghề nghiệp', 'Phạm Bảo Ngọc', '0983417256', '28A4072941', 3, 6),
('CLB Nhiếp ảnh và Sự kiện', 'COP', 'Câu lạc bộ nhiếp ảnh và tổ chức sự kiện', 'Trần Hoài Nam', '0867254913', '27A4038165', 3, 7),
('Liên chi đoàn Khoa Ngân hàng', 'LCD-NH', 'Liên chi đoàn thanh niên Khoa Ngân hàng', 'Lê Khánh Ngân', '0936148275', '26A4092753', 1, 8),
('Đội Thủ lĩnh Đoàn', 'TLĐ', 'Đội ngũ thủ lĩnh của Đoàn Thanh niên trường', 'Cao Mỹ Duyên', '0863147258', '28A4051746', 1, 9),
('CLB Đại sứ học tập', 'ĐSHT', 'Câu lạc bộ đại sứ học tập và lan tỏa văn hóa học', 'Trương Ngọc Hân', '0975261834', '27A4083517', 1, 10),
('Đội Sinh viên tình nguyện HVNH', 'BAVT', 'Đội tình nguyện phục vụ cộng đồng', 'Lê Bích Ngọc', '0943157286', '26A4054639', 2, 11),
('Đội Văn nghệ HVNH', 'BAAT', 'Đội văn nghệ biểu diễn nghệ thuật', 'Hoàng Văn Sơn', '0865273149', '26A4026481', 2, 12),
('CLB Chứng khoán', 'SEC', 'Câu lạc bộ tìm hiểu và nghiên cứu chứng khoán', 'Nguyễn Công Thành', '0912756843', '26A4069142', 2, 13),
('CLB Người dẫn chương trình', 'MCC', 'Câu lạc bộ đào tạo MC và người dẫn chương trình', 'Bùi Như Quỳnh', '0931865427', '27A4046283', 2, 14),
('CLB Khoa học Dữ liệu', 'DSC', 'Câu lạc bộ nghiên cứu khoa học dữ liệu và AI', 'Vũ Thanh Trúc', '0973158264', '28A4014286', 2, 15),
('CLB Tài chính', 'FC', 'Câu lạc bộ học thuật về tài chính và đầu tư', 'Lê Diệu Linh', '0985362714', '27A4021856', 2, 16),
('CLB Khởi nghiệp', 'STC', 'Câu lạc bộ khởi nghiệp và sáng tạo', 'Nguyễn Khắc Hùng', '0914286753', '28A4061572', 2, 17);

-- =============================================
-- Events
-- approver users: trandmang=2, hoangbchau=3, vuantu=4
-- clubs: ACC=1, CAC=2, COP=3, LCD-NH=4, TLD=5, DSHT=6, BAVT=7, BAAT=8, SEC=9, MCC=10, DSC=11, FC=12, STC=13
-- =============================================
INSERT INTO events (nameEvent, description, startDate, endDate, location, registrationDeadline, maxRegistration, numberOfRegistration, status, rejectionReason, approvedBy, approvedDate, isDeleted, idClub) VALUES

-- APPROVED events (da duyet)
-- numberOfRegistration = so ban ghi REGISTERED thuc te trong bang registrations phia duoi
-- Event 1: Banking Future → 9 REGISTERED
('Banking Future 2026',
 'Sự kiện kết nối sinh viên với các doanh nghiệp tài chính – ngân hàng hàng đầu. Cơ hội gặp gỡ nhà tuyển dụng, tham gia phỏng vấn thực tế và nhận học bổng.',
 '2026-09-25 08:00:00', '2026-09-25 17:00:00',
 'Hội trường D1 - Học viện Ngân hàng',
 '2026-09-20 23:59:00', 150, 9, 'APPROVED', NULL, 4, '2026-09-10 09:00:00', 0, 4),

-- Event 2: Workshop Kỹ năng thuyết trình → 7 REGISTERED
('Workshop Kỹ năng thuyết trình',
 'Workshop thực hành kỹ năng thuyết trình và dẫn chương trình chuyên nghiệp với sự hướng dẫn của các MC kỳ cựu. Phù hợp cho sinh viên muốn cải thiện kỹ năng nói trước đám đông.',
 '2026-09-28 14:00:00', '2026-09-28 17:00:00',
 'Phòng D2.201 - Học viện Ngân hàng',
 '2026-09-25 23:59:00', 80, 7, 'APPROVED', NULL, 2, '2026-09-12 10:00:00', 0, 10),

-- Event 3: Cuộc thi Chứng khoán → 8 REGISTERED
('Cuộc thi Chứng khoán sinh viên 2026',
 'Cuộc thi mô phỏng giao dịch chứng khoán dành cho sinh viên toàn trường. Giải thưởng hấp dẫn lên đến 10 triệu đồng. Không cần kinh nghiệm trước đó.',
 '2026-10-02 08:30:00', '2026-10-02 11:30:00',
 'Hội trường D2 - Học viện Ngân hàng',
 '2026-09-28 23:59:00', 200, 8, 'APPROVED', NULL, 3, '2026-09-11 14:00:00', 0, 9),

-- Event 4: Đêm Gala → 10 REGISTERED
('Đêm Gala Chào Tân Sinh Viên K29',
 'Chương trình gala chào đón tân sinh viên K29 với nhiều tiết mục văn nghệ đặc sắc, trò chơi hấp dẫn, quà tặng và bốc thăm may mắn từ các nhà tài trợ.',
 '2026-10-10 18:00:00', '2026-10-10 22:00:00',
 'Sân khấu ngoài trời - Học viện Ngân hàng',
 '2026-10-07 23:59:00', 500, 10, 'APPROVED', NULL, 2, '2026-09-08 16:00:00', 0, 8),

-- Event 5: Python → 6 REGISTERED
('Lớp học Lập trình Python Cơ bản',
 'Khóa học lập trình Python miễn phí dành cho sinh viên chưa có kinh nghiệm lập trình. Nội dung từ cơ bản đến ứng dụng phân tích dữ liệu thực tế.',
 '2026-09-20 08:30:00', '2026-09-20 11:30:00',
 'Phòng máy tính 305 - Tòa nhà C',
 '2026-09-17 23:59:00', 30, 6, 'APPROVED', NULL, 2, '2026-09-07 08:00:00', 0, 11),

-- Event 6: Hội thảo Định hướng nghề nghiệp → 5 REGISTERED
('Hội thảo Định hướng nghề nghiệp 2026',
 'Hội thảo kết nối sinh viên với các chuyên gia và nhà tuyển dụng hàng đầu trong lĩnh vực tài chính – ngân hàng. Chia sẻ kinh nghiệm thực tế và cơ hội việc làm.',
 '2026-10-05 08:00:00', '2026-10-05 11:30:00',
 'Hội trường A - Học viện Ngân hàng',
 '2026-10-02 23:59:00', 200, 5, 'APPROVED', NULL, 4, '2026-09-13 09:00:00', 0, 2),

-- Event 7: Hiến máu → 0 REGISTERED
('Chương trình Hiến máu nhân đạo',
 'Chương trình hiến máu tình nguyện phối hợp với Bệnh viện Hữu Nghị. Mỗi đơn vị máu hiến tặng là một nghĩa cử cao đẹp, cứu sống sinh mệnh người bệnh.',
 '2026-10-15 07:30:00', '2026-10-15 11:00:00',
 'Sân vận động - Học viện Ngân hàng',
 '2026-10-12 23:59:00', 300, 0, 'APPROVED', NULL, 2, '2026-09-14 10:00:00', 0, 7),

-- Event 8: Khởi nghiệp → 0 REGISTERED
('Ngày hội Khởi nghiệp HVNH 2026',
 'Sự kiện trình bày ý tưởng khởi nghiệp, kết nối với các nhà đầu tư và mentor, cơ hội nhận vốn hạt giống cho những ý tưởng xuất sắc.',
 '2026-11-05 08:00:00', '2026-11-05 17:00:00',
 'Hội trường lớn - Tầng 1',
 '2026-10-30 23:59:00', 150, 0, 'APPROVED', NULL, 3, '2026-09-14 11:00:00', 0, 13),

-- PENDING events (cho duyet)
('Seminar Đầu tư Tài chính Cá nhân',
 'Seminar chia sẻ kiến thức và chiến lược đầu tư tài chính cá nhân thực tế, phù hợp với sinh viên mới bắt đầu tìm hiểu về đầu tư.',
 '2026-10-20 14:00:00', '2026-10-20 16:30:00',
 'Phòng hội thảo C301',
 '2026-10-17 23:59:00', 120, 0, 'PENDING', NULL, NULL, NULL, 0, 12),

('Workshop Kỹ năng phỏng vấn xin việc',
 'Workshop thực hành kỹ năng phỏng vấn xin việc với sự tham gia của chuyên gia HR từ các công ty lớn. Có phiên mock interview 1-1.',
 '2026-10-25 14:00:00', '2026-10-25 17:00:00',
 'Phòng D2.202',
 '2026-10-22 23:59:00', 60, 0, 'PENDING', NULL, NULL, NULL, 0, 2),

('Triển lãm Nhiếp ảnh "Khoảnh khắc HVNH"',
 'Triển lãm ảnh nghệ thuật về cuộc sống học đường tại Học viện Ngân hàng. Mở cửa tự do, chào đón toàn thể sinh viên và giảng viên.',
 '2026-11-10 08:00:00', '2026-11-12 17:00:00',
 'Sảnh tầng 1 - Tòa nhà A',
 '2026-11-07 23:59:00', 500, 0, 'PENDING', NULL, NULL, NULL, 0, 3),

-- REJECTED events (bi tu choi)
('Team Building Ngoại khóa cuối tuần',
 'Chương trình team building ngoại khóa tại khu sinh thái, các trò chơi ngoài trời và BBQ.',
 '2026-10-30 06:00:00', '2026-10-30 20:00:00',
 'Khu sinh thái Đầm Long, Hà Nội',
 '2026-10-25 23:59:00', 60, 0, 'REJECTED', 'Địa điểm tổ chức ngoài khuôn viên trường, cần có kế hoạch đảm bảo an toàn chi tiết và phê duyệt từ Ban Giám hiệu trước khi tổ chức.', 2, '2026-09-12 15:00:00', 0, 10);

-- =============================================
-- Registrations
-- =============================================
-- BẢNG MAPPING idUser → Sinh viên:
-- 18=Vũ Đức Anh(26A4020400,Nam)      19=Phạm Lan Hương(26A4020830,Nữ)
-- 20=Nguyễn Minh Anh(26A4010919,Nữ)  21=Cao Việt Hoàng(26A4033193,Nam)
-- 22=Hồ Gia Bảo(26A4011084,Nam)      23=Vũ Hải Yến(26A4062577,Nữ)
-- 24=Trần Quốc Huy(26A4031478,Nam)   25=Lê Hoàng Nam(26A4012457,Nam)
-- 26=Trương Mai Chi(26A4011982,Nữ)   27=Nguyễn Minh Nguyệt(27A4010670,Nữ)
-- 28=Bùi Thành Nam(27A4031256,Nam)   29=Trần Ngọc Ánh(27A4012036,Nữ)
-- 30=Phạm Minh Đức(27A4043284,Nam)   31=Võ Thùy Dương(27A4071661,Nữ)
-- 32=Lý Khánh Vy(27A4031327,Nữ)      33=Đỗ Phương Thảo(27A4012127,Nữ)
-- 34=Phạm Tuấn Kiệt(28A4022751,Nam)  35=Lê Ngọc Hà(28A4073623,Nữ)
-- 36=Đặng Trung Kiên(28A4073570,Nam) 37=Hoàng Thu Trang(28A4073590,Nữ)
-- 38=Dương Minh Quân(28A4033475,Nam) 39=Nguyễn Quỳnh Anh(28A4020430,Nữ)
-- 40=Đặng Khánh Linh(28A4071448,Nữ)  41=Phan Anh Dũng(28A4052041,Nam)
-- 42=Đinh Ngọc Mai(28A4010734,Nữ)    43=Mai Thanh Hằng(28A4031140,Nữ)
-- 44=Nguyễn Nhật Minh(28A4030967,Nam) 45=Nguyễn Hoàng Long(28A4031083,Nam)
--
-- BẢNG MAPPING idEvent:
-- 1=Banking Future 2026 (LCD-NH, max=150)
-- 2=Workshop Kỹ năng thuyết trình (MCC, max=80)
-- 3=Cuộc thi Chứng khoán (SEC, max=200)
-- 4=Đêm Gala Chào Tân SV K29 (BAAT, max=500)
-- 5=Lớp học Python Cơ bản (DSC, max=30)
-- 6=Hội thảo Định hướng nghề nghiệp (CAC, max=200)
-- 7=Hiến máu nhân đạo (BAVT, max=300)
-- 8=Ngày hội Khởi nghiệp (STC, max=150)
-- =============================================

-- Event 1: Banking Future 2026 — 9 REGISTERED, 1 CANCELLED
-- (idUser 18-27: 9 đăng ký, idUser 27 hủy)
INSERT INTO registrations (registrationDate, status, idEvent, idStudent) VALUES
('2026-09-11 08:15:00', 'REGISTERED', 1, 18),
('2026-09-11 09:30:00', 'REGISTERED', 1, 19),
('2026-09-11 10:45:00', 'REGISTERED', 1, 20),
('2026-09-11 14:00:00', 'REGISTERED', 1, 21),
('2026-09-12 08:20:00', 'REGISTERED', 1, 22),
('2026-09-12 09:10:00', 'REGISTERED', 1, 23),
('2026-09-12 10:30:00', 'REGISTERED', 1, 24),
('2026-09-12 11:50:00', 'REGISTERED', 1, 25),
('2026-09-13 08:05:00', 'REGISTERED', 1, 26),
('2026-09-13 09:20:00', 'CANCELLED',  1, 27);  -- Nguyễn Minh Nguyệt hủy

-- Event 2: Workshop Kỹ năng thuyết trình — 7 REGISTERED, 1 CANCELLED
-- (idUser 18,20,22,24,26,28,30 đăng ký; idUser 19 hủy)
INSERT INTO registrations (registrationDate, status, idEvent, idStudent) VALUES
('2026-09-13 08:00:00', 'REGISTERED', 2, 18),
('2026-09-13 09:00:00', 'CANCELLED',  2, 19),  -- Phạm Lan Hương hủy
('2026-09-13 10:00:00', 'REGISTERED', 2, 20),
('2026-09-13 11:00:00', 'REGISTERED', 2, 22),
('2026-09-13 14:30:00', 'REGISTERED', 2, 24),
('2026-09-13 15:00:00', 'REGISTERED', 2, 26),
('2026-09-14 08:30:00', 'REGISTERED', 2, 28),
('2026-09-14 09:45:00', 'REGISTERED', 2, 30);

-- Event 3: Cuộc thi Chứng khoán sinh viên 2026 — 8 REGISTERED
-- (idUser 19,21,23,25,27,29,31,32)
INSERT INTO registrations (registrationDate, status, idEvent, idStudent) VALUES
('2026-09-13 08:10:00', 'REGISTERED', 3, 19),
('2026-09-13 09:25:00', 'REGISTERED', 3, 21),
('2026-09-13 10:40:00', 'REGISTERED', 3, 23),
('2026-09-13 11:55:00', 'REGISTERED', 3, 25),
('2026-09-14 08:15:00', 'REGISTERED', 3, 27),
('2026-09-14 09:30:00', 'REGISTERED', 3, 29),
('2026-09-14 10:45:00', 'REGISTERED', 3, 31),
('2026-09-14 11:00:00', 'REGISTERED', 3, 32);

-- Event 4: Đêm Gala Chào Tân Sinh Viên K29 — 10 REGISTERED
-- (idUser 18-27: 10 người)
INSERT INTO registrations (registrationDate, status, idEvent, idStudent) VALUES
('2026-09-09 08:00:00', 'REGISTERED', 4, 18),
('2026-09-09 08:30:00', 'REGISTERED', 4, 19),
('2026-09-09 09:00:00', 'REGISTERED', 4, 20),
('2026-09-09 09:30:00', 'REGISTERED', 4, 21),
('2026-09-09 10:00:00', 'REGISTERED', 4, 22),
('2026-09-09 10:30:00', 'REGISTERED', 4, 23),
('2026-09-09 11:00:00', 'REGISTERED', 4, 24),
('2026-09-09 11:30:00', 'REGISTERED', 4, 25),
('2026-09-09 14:00:00', 'REGISTERED', 4, 26),
('2026-09-09 14:30:00', 'REGISTERED', 4, 27);

-- Event 5: Lớp học Lập trình Python Cơ bản — 6 REGISTERED
-- (idUser 18,20,22,28,30,32 — đây là 6 sinh viên mẫu có trong DB)
INSERT INTO registrations (registrationDate, status, idEvent, idStudent) VALUES
('2026-09-08 08:00:00', 'REGISTERED', 5, 18),
('2026-09-08 08:30:00', 'REGISTERED', 5, 20),
('2026-09-08 09:00:00', 'REGISTERED', 5, 22),
('2026-09-08 09:30:00', 'REGISTERED', 5, 28),
('2026-09-08 10:00:00', 'REGISTERED', 5, 30),
('2026-09-08 10:30:00', 'REGISTERED', 5, 32);

-- Event 6: Hội thảo Định hướng nghề nghiệp 2026 — 5 REGISTERED
-- (idUser 18,19,21,23,25)
INSERT INTO registrations (registrationDate, status, idEvent, idStudent) VALUES
('2026-09-14 08:00:00', 'REGISTERED', 6, 18),
('2026-09-14 09:00:00', 'REGISTERED', 6, 19),
('2026-09-14 10:15:00', 'REGISTERED', 6, 21),
('2026-09-14 11:30:00', 'REGISTERED', 6, 23),
('2026-09-14 14:00:00', 'REGISTERED', 6, 25);

-- Event 7: Chương trình Hiến máu nhân đạo — 0 REGISTERED (chưa có ai đăng ký)
-- Event 8: Ngày hội Khởi nghiệp HVNH 2026 — 0 REGISTERED (chưa có ai đăng ký)

-- =============================================
-- Notifications
-- =============================================
INSERT INTO notifications (title, content, type, isRead, idUser) VALUES
('Sự kiện được duyệt', 'Sự kiện "Banking Future 2026" đã được phê duyệt.', 'APPROVAL', 1, 8),
('Sự kiện được duyệt', 'Sự kiện "Workshop Kỹ năng thuyết trình" đã được phê duyệt.', 'APPROVAL', 1, 14),
('Sự kiện được duyệt', 'Sự kiện "Cuộc thi Chứng khoán sinh viên 2026" đã được phê duyệt.', 'APPROVAL', 0, 13),
('Sự kiện được duyệt', 'Sự kiện "Đêm Gala Chào Tân Sinh Viên K29" đã được phê duyệt.', 'APPROVAL', 1, 12),
('Sự kiện được duyệt', 'Sự kiện "Lớp học Lập trình Python Cơ bản" đã được phê duyệt.', 'APPROVAL', 1, 15),
('Sự kiện được duyệt', 'Sự kiện "Hội thảo Định hướng nghề nghiệp 2026" đã được phê duyệt.', 'APPROVAL', 0, 6),
('Sự kiện bị từ chối', 'Sự kiện "Team Building Ngoại khóa cuối tuần" bị từ chối. Lý do: Địa điểm tổ chức ngoài khuôn viên trường.', 'REJECTION', 0, 14),
('Đăng ký thành công', 'Bạn đã đăng ký tham gia sự kiện "Banking Future 2026".', 'REGISTRATION', 1, 18),
('Đăng ký thành công', 'Bạn đã đăng ký tham gia sự kiện "Đêm Gala Chào Tân Sinh Viên K29".', 'REGISTRATION', 0, 18),
('Đăng ký thành công', 'Bạn đã đăng ký tham gia sự kiện "Banking Future 2026".', 'REGISTRATION', 1, 19);

-- =============================================
-- Recalculate numberOfRegistration từ COUNT thực tế
-- Đảm bảo luôn khớp với bảng registrations, không bao giờ hardcode
-- =============================================
UPDATE events e
SET e.numberOfRegistration = (
    SELECT COUNT(*)
    FROM registrations r
    WHERE r.idEvent = e.idEvent
      AND r.status = 'REGISTERED'
)
WHERE e.isDeleted = 0;
