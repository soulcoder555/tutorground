@echo off
setlocal

set "ROOT=%~dp0"
set "URL=http://127.0.0.1:3000"

echo Starting TutorGround...

start "TutorGround Backend" /min cmd /k ""%ROOT%run-backend-dev.cmd""
start "TutorGround Frontend" /min cmd /k ""%ROOT%run-frontend-preview.cmd""

echo Waiting for services to boot...
ping 127.0.0.1 -n 11 >nul

echo Opening %URL%
start "" "%URL%"

echo.
echo TutorGround frontend: %URL%
echo TutorGround backend:  http://127.0.0.1:4000/health
echo.
echo If the page is still compiling, refresh after a few seconds.
