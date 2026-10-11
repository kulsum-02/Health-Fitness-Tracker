@echo off
echo Starting FitPulse Pro Backend Server (Port 5000)...
cd /d %~dp0
node src/server.js
pause
