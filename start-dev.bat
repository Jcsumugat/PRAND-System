@echo off
echo Starting PRAND System...

REM Start Apache via XAMPP
echo Starting Apache...
start "" "C:\xampp\apache\bin\httpd.exe"
timeout /t 3

REM Start MySQL via XAMPP
echo Starting MySQL...
start "" "C:\xampp\mysql\bin\mysqld.exe" --defaults-file="C:\xampp\mysql\bin\my.ini"
timeout /t 3

REM Start PHP development server
echo Starting Laravel PHP Server...
start cmd /k "php -S 127.0.0.1:8000 -t public"
timeout /t 2

REM Start NPM development server
echo Starting NPM Dev Server...
start cmd /k "npm run dev"

echo.
echo ================================
echo All servers started successfully!
echo ================================
echo Laravel: http://127.0.0.1:8000
echo Apache (if configured): http://localhost
echo.
pause
