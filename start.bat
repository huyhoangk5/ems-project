@echo off
setlocal enabledelayedexpansion
title EMS - Khoi dong he thong
color 0A
cls

echo ============================================================
echo    EMS - He thong Quan ly Su kien
echo    Hoc vien Ngan hang
echo ============================================================
echo.

cd /d "%~dp0"

:: ==========================================================
:: BUOC 1: Kiem tra Docker Desktop
:: ==========================================================
echo [1/4] Kiem tra Docker Desktop...

docker info >nul 2>&1
if !errorlevel! equ 0 goto :docker_ok

echo     [!] Docker Desktop chua chay! Dang mo...
start "" "C:\Program Files\Docker\Docker\Docker Desktop.exe"
echo     Cho Docker khoi dong (toi da 60 giay)...

set /a waitd=0
:loop_docker
timeout /t 5 /nobreak >nul
docker info >nul 2>&1
if !errorlevel! equ 0 goto :docker_ok
set /a waitd=!waitd!+1
if !waitd! lss 12 goto :loop_docker

echo     [X] Khong ket noi duoc Docker Desktop.
echo         Hay mo Docker Desktop thu cong roi chay lai.
pause
exit /b 1

:docker_ok
echo     [OK] Docker Desktop dang chay.
echo.

:: ==========================================================
:: BUOC 2: Kiem tra image da build chua
:: ==========================================================
echo [2/4] Kiem tra image...
set "NEED_BE=0"
set "NEED_FE=0"

docker image inspect ems-backend >nul 2>&1
if !errorlevel! neq 0 set "NEED_BE=1"

docker image inspect ems-frontend >nul 2>&1
if !errorlevel! neq 0 set "NEED_FE=1"

if "!NEED_BE!"=="0" (echo     [OK] Da co image backend.) else (echo     [!] Chua co image backend - can build.)
if "!NEED_FE!"=="0" (echo     [OK] Da co image frontend.) else (echo     [!] Chua co image frontend - can build.)
echo.

:: ==========================================================
:: BUOC 3: Build neu can, roi khoi dong
:: ==========================================================
echo [3/4] Khoi dong cac service...
echo.

if "!NEED_BE!"=="1" (
    echo     Building backend - vui long cho 3-5 phut...
    docker-compose build backend
    if !errorlevel! neq 0 (
        echo [X] Build backend that bai!
        pause & exit /b 1
    )
    echo     [OK] Build backend xong.
)

if "!NEED_FE!"=="1" (
    echo     Building frontend - vui long cho 1-2 phut...
    docker-compose build frontend
    if !errorlevel! neq 0 (
        echo [X] Build frontend that bai!
        pause & exit /b 1
    )
    echo     [OK] Build frontend xong.
)

echo     Dung container cu (neu co)...
docker-compose down >nul 2>&1

echo     Khoi dong tat ca container...
docker rm -f ems-mysql ems-phpmyadmin ems-backend ems-frontend >nul 2>&1
docker-compose up -d
if !errorlevel! neq 0 (
    echo.
    echo [X] Loi khi khoi dong! Chay lenh sau de xem log:
    echo     docker-compose logs
    pause & exit /b 1
)
echo.
echo [4/4] Cho backend khoi dong (toi da 3 phut)...
echo.

set /a att=0
:loop_backend
set /a att=!att!+1
if !att! gtr 36 (
    echo     [!] Backend chua phan hoi sau 3 phut.
    echo         Thu truy cap http://localhost:3000 sau them 1-2 phut.
    goto :done
)
powershell -Command "try{Invoke-WebRequest -UseBasicParsing -Uri 'http://localhost:8080/api/auth/login' -Method POST -ContentType 'application/json' -Body '{\"username\":\"x\",\"password\":\"x\"}' -TimeoutSec 3|Out-Null}catch{if(-not $_.Exception.Response){exit 1}};exit 0" >nul 2>&1
if !errorlevel! equ 0 (
    echo     [OK] Backend da san sang!
    goto :done
)
echo     Dang cho... [!att!/36]
timeout /t 5 /nobreak >nul
goto :loop_backend

:done
echo.
echo ============================================================
echo   [THANH CONG] He thong EMS da san sang!
echo ============================================================
echo.
echo   Dia chi truy cap:
echo     Frontend   :  http://localhost:3000
echo     Backend API:  http://localhost:8080
echo     phpMyAdmin :  http://localhost:8081
echo.
echo ============================================================
echo   TAI KHOAN DEMO  ^|  Mat khau chung: password123
echo ============================================================
echo.
echo   VAI TRO          TEN DANG NHAP      HO VA TEN
echo   ----------------------------------------------------
echo   Admin            admin              Quan tri vien
echo                    (Mat khau: admin123)
echo.
echo   Quan ly cap cao  trandmang          Tran Duc Manh
echo   Quan ly cap cao  hoangbchau         Hoang Bao Chau
echo   Quan ly cap cao  vuantu             Vu Anh Tu
echo.
echo   CLB Huong nghiep cac_club           CLB Huong nghiep
echo   CLB Chung khoan  sec_club           CLB Chung khoan
echo   CLB MC           mcc_club           CLB MC
echo   CLB KHdl         dsc_club           CLB Khoa hoc Du lieu
echo.
echo   Sinh vien        27a4031327         Ly Khanh Vy
echo   Sinh vien        26a4012457         Le Hoang Nam
echo   Sinh vien        28a4073623         Le Ngoc Ha
echo.
echo   (Tat ca tai khoan tren dung mat khau: password123)
echo   (Rieng admin dung mat khau: admin123)
echo ============================================================
echo.
timeout /t 2 /nobreak >nul
start "" http://localhost:3000
echo   Nhan phim bat ky de dong cua so nay...
pause >nul
endlocal
