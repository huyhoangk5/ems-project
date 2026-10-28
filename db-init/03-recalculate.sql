-- Script recalculate numberOfRegistration
-- Chạy SAU khi đã có đủ dữ liệu registrations từ 02-data.sql
-- Đảm bảo numberOfRegistration trong bảng events luôn = COUNT(REGISTERED) thực tế

SET NAMES utf8mb4;
USE ems_db;

UPDATE events e
SET e.numberOfRegistration = (
    SELECT COUNT(*)
    FROM registrations r
    WHERE r.idEvent = e.idEvent
      AND r.status = 'REGISTERED'
)
WHERE e.isDeleted = 0;
