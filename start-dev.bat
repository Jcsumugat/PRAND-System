@echo off
echo Starting PRAND System...
start cmd /k "php -S 127.0.0.1:8000 -t public"
timeout /t 2
start cmd /k "npm run dev"
echo Servers started!
echo Laravel: http://127.0.0.1:8000
pause
