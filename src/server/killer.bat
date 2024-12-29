@echo off
rem This batch file searches for and kills the "main.exe" process

rem Search for the process
tasklist /fi "imagename eq main.exe" 2>nul | find /i "main.exe" >nul

rem If process is found, kill it
if not errorlevel 1 (
    echo Killing process main.exe...
    taskkill /f /im main.exe
) else (
    echo Process main.exe not found.
)

pause
