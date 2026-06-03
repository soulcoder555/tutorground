@echo off
setlocal
cd /d "%~dp0backend"
set "PATH=%~dp0node_modules\.bin;%~dp0backend\node_modules\.bin;C:\Program Files\nodejs;%SystemRoot%\System32;%SystemRoot%"
"C:\Program Files\nodejs\node.exe" "%~dp0backend\dist\server.js"
