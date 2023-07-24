@echo off
SET "NodeExePath=C:\Program Files\nodejs\node.exe"
SET "AppPath=C:\Users\hidir\WebstormProjects\ondergrup-api\app.js"

REM Node.js uygulamasını başlat
start "" "%NodeExePath%" "%AppPath%"

exit