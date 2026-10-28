@echo off
setlocal enabledelayedexpansion
title EMS - Dung he thong
color 0C
cls

echo ============================================================
echo    EMS - Dung he thong Quan ly Su kien
echo ============================================================
echo.

cd /d "%~dp0"

:: Kiem tra Docker co chay khong
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo [!] Docker Desktop khong chay. Khong can lam gi them.
    echo.
    pause
    exit /b 0
)

echo Dang dung cac container cua du an EMS...
echo (Du lieu MySQL van duoc bao toan trong volume mysql_data)
echo.

:: Chi dung va go container cua rieng du an EMS
docker-compose down

if %errorlevel% neq 0 (
    echo [!] Co loi xay ra khi dung container EMS.
) else (
    echo [OK] Da dung cac container EMS thanh cong.
)
echo.

echo ============================================================
echo   [HOAN TAT] He thong EMS da duoc dung an toan.
echo.
echo   - Du lieu MySQL: NGUYEN VEN (luu trong volume mysql_data)
echo   - Image cua EMS: GIU NGUYEN (giup lan sau bat chi mat 3 giay)
echo   - Cac du an khac: HOAN TOAN KHONG BI ANH HUONG
echo   - Docker Desktop: Van hoat dong binh thuong
echo.
echo   De bat lai he thong: chay start.bat
echo ============================================================
echo.
echo   Nhan phim bat ky de dong cua so nay...
pause >nul
endlocal

