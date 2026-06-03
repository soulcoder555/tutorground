@echo off
setlocal
cd /d "%~dp0frontend"
set "PATH=%~dp0node_modules\.bin;%~dp0frontend\node_modules\.bin;C:\Program Files\nodejs;%SystemRoot%\System32;%SystemRoot%"
set "NEXT_TELEMETRY_DISABLED=1"
if not exist ".next-dev\BUILD_ID" (
  "C:\Program Files\nodejs\node.exe" "%~dp0node_modules\next\dist\bin\next" build
)
"C:\Program Files\nodejs\node.exe" "%~dp0node_modules\next\dist\bin\next" start --hostname 127.0.0.1 --port 3000
