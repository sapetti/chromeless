@echo off
echo Setup :: Starting
echo   Run chrome in headless mode
for /f "tokens=2 delims==; " %%a in (' wmic process call create "c:\Program Files (x86)\Google\Chrome\Application\chrome.exe --remote-debugging-port=9222 --disable-gpu --headless" ^| find "ProcessId" ') do set pid=%%a
echo   Storing pid %pid% to ./processes/chrome.pid
echo %pid% > ".\processes\chrome.pid"
echo Setup :: Completed