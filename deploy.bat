@echo off
cd /d %~dp0

REM 设置提交信息，如果没传参数则用默认
if "%1"=="" (
  set msg=update blog
) else (
  set msg=%*
)

echo ==============================
echo    Hexo 一键部署脚本
echo ==============================

echo.
echo [1/4] 构建博客...
call hexo generate
if %errorlevel% neq 0 (
  echo 构建失败！请检查错误信息。
  pause
  exit /b 1
)

echo.
echo [2/4] 添加所有更改...
git add .

echo.
echo [3/4] 提交更改...
git commit -m "%msg%"

echo.
echo [4/4] 推送到 GitHub...
git push origin main

echo.
echo ==============================
echo    ✅ 上传完成！
echo    http://github.com/lyx919777/hexo
echo ==============================
pause
