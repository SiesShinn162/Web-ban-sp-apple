@echo off
title HoangPhanStore - Trinh khoi chay du an nhanh

:menu
cls
echo ==========================================================
echo               HoangPhanStore - TRINH KHOI CHAY DU AN
echo ==========================================================
echo.
echo Dang kiem tra thu muc du an...
if not exist "server" (
    echo [LOI] Khong tim thay thu muc server. Hay chay file nay o thu muc goc cua du an.
    pause
    exit /b
)

if not exist "client" (
    echo [LOI] Khong tim thay thu muc client. Hay chay file nay o thu muc goc cua du an.
    pause
    exit /b
)

echo [OK] Thu muc du an hop le.
echo.
echo Chon mot tuy chon de bat dau:
echo [1] Chay TOAN BO du an [Khuyen dung: Backend API + Tailwind Watcher + Web Server 3000]
echo [2] Chay Backend API + Tailwind Watcher [Dung Go Live cua VS Code]
echo [3] Cai dat tat ca thu vien [Chay npm install cho ca client va server]
echo [4] Nap du lieu mau [Seed database vao MongoDB]
echo [5] Chi chay Backend API
echo [6] Chi chay Tailwind CSS Watcher
echo [7] Huong dan cai dat va su dung
echo [8] Thoat
echo ==========================================================
set /p choice="Nhap lua chon cua ban [1-8, mac dinh la 1]: "

if "%choice%"=="" set choice=1

if "%choice%"=="1" (
    echo.
    echo --- Dang khoi chay Backend - Cong 5000...
    start "HoangPhanStore - Backend API - Port 5000" cmd /k "cd server && npm run dev"

    echo --- Dang khoi chay Tailwind CSS Watcher...
    start "HoangPhanStore - Frontend Tailwind" cmd /k "cd client && npm run watch:css"

    echo --- Dang khoi chay Web Server cho Frontend - Cong 3000...
    start "HoangPhanStore - Frontend Server - Port 3000" cmd /k "npx -y http-server client -p 3000 -c-1"

    echo.
    echo [THANH CONG] Tat ca dich vu da duoc khoi chay!
    echo - Backend API: http://localhost:5000/api
    echo - Frontend URL: http://localhost:3000
    echo.
    echo Dang tu dong mo trang Frontend tren trinh duyet sau 3 giay...
    timeout /t 3 > nul
    start http://localhost:3000
    exit
)

if "%choice%"=="2" (
    echo.
    echo --- Dang khoi chay Backend - Cong 5000...
    start "HoangPhanStore - Backend API - Port 5000" cmd /k "cd server && npm run dev"

    echo --- Dang khoi chay Tailwind CSS Watcher...
    start "HoangPhanStore - Frontend Tailwind" cmd /k "cd client && npm run watch:css"

    echo.
    echo [THANH CONG] Da chay Backend va Tailwind Watcher.
    echo Bay gio ban co the mo bang Go Live cua VS Code de xem giao dien.
    pause
    goto menu
)

if "%choice%"=="3" (
    echo.
    echo --- Dang cai dat thu vien cho Backend...
    cd server && call npm install && cd ..
    echo.
    echo --- Dang cai dat thu vien cho Frontend...
    cd client && call npm install && cd ..
    echo.
    echo [THANH CONG] Cai dat toan bo thu vien hoan tat!
    pause
    goto menu
)

if "%choice%"=="4" (
    echo.
    echo --- Dang nap du lieu mau vao MongoDB...
    cd server && call npm run seed && cd ..
    echo.
    echo [THANH CONG] Nap du lieu mau thanh cong!
    pause
    goto menu
)

if "%choice%"=="5" (
    echo.
    echo --- Dang khoi chay Backend - Cong 5000...
    start "HoangPhanStore - Backend API - Port 5000" cmd /k "cd server && npm run dev"
    exit
)

if "%choice%"=="6" (
    echo.
    echo --- Dang khoi chay Tailwind CSS Watcher...
    start "HoangPhanStore - Frontend Tailwind" cmd /k "cd client && npm run watch:css"
    exit
)

if "%choice%"=="7" (
    echo.
    echo ==========================================================
    echo           HUONG DAN CAI DAT VA SU DUNG HOANGPHANSTORE
    echo ==========================================================
    echo.
    echo 1. Yeu cau he thong:
    echo    - Node.js [phien ban 16 tro len]
    echo    - MongoDB dang chay tren may local [mac dinh: localhost:27017]
    echo.
    echo 2. Cac buoc thiet lap du an tu dau:
    echo    - Buoc 1: Chon tuy chon [3] tu menu de tu dong tai va cai dat
    echo             tat ca cac thu vien can thiet cho ca Frontend va Backend.
    echo    - Buoc 2: Chon tuy chon [4] de nap du lieu mau [Seed products,
    echo             categories] vao co so du lieu MongoDB.
    echo.
    echo 3. Cach khoi chay va su dung:
    echo    - Khoi chay toan bo du an bang tuy chon [1]. Chuong trinh se
    echo      khoi chay Backend, Tailwind Watcher va Web Server o cong 3000.
    echo      Frontend se tu dong mo tren trinh duyet [http://localhost:3000].
    echo    - Neu ban muon dung extension "Go Live" trong VS Code, hay
    echo      chon tuy chon [2] de chi chay Backend API + Tailwind Watcher.
    echo.
    echo 4. Thong tin cac Cong / Services:
    echo    - Frontend Web Server: http://localhost:3000
    echo    - Backend API: http://localhost:5000/api
    echo    - Database: mongodb://localhost:27017/istore_db
    echo ==========================================================
    pause
    goto menu
)

if "%choice%"=="8" (
    exit
)

echo.
echo Lua chon khong hop le! Vui long chon lai.
timeout /t 2 > nul
goto menu
