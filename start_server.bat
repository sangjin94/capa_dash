@echo off
chcp 65001 > nul
cd /d "%~dp0"
title capa_dash server - close this window to stop
echo.
echo  ============================================
echo    capa_dash server
echo    URL : http://localhost:5180
echo    Close this window to stop the server.
echo  ============================================
echo.

rem 이미 5180 을 쓰고 있으면 알려주고 그대로 브라우저만 열도록 안내
netstat -ano | findstr /R /C:"LISTENING" | findstr ":5180 " > nul
if %errorlevel%==0 (
  echo  [!] Port 5180 is already in use - the server is probably running.
  echo      Open http://localhost:5180 in your browser.
  echo      If it is stuck, close the other server window and run this again.
  echo.
  pause
  exit /b
)

py server\serve.py
echo.
echo  Server stopped.
pause
