@ECHO OFF
timeout 30
taskkill /f /im explorer.exe
start %~dp0_VVVV\vvvv_50beta36_x64\vvvv.exe /o "..\..\Subpatches\_root_APP.v4p" /shutup