@echo off
cd /d %~dp0

REM 设置提交信息，如果没传参数则用默认
if "%1"=="" (
  set msg=update blog
) else (
  set msg=%*
)

echo === 添加所有更改 ===
git add .

echo === 提交更改 ===
git commit -m "%msg%"

echo === 推送到 GitHub ===
git push origin main

echo === 完成！=== 
pause
