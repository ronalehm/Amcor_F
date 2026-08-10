@echo off
setlocal enabledelayedexpansion

echo 🖼️  Starting Image Loading Tests
echo ==================================
echo.
echo 📋 Test Suite: Image Loading Verification
echo 📦 Framework: Playwright + Node.js
echo.

REM Check if node_modules exists
if not exist "node_modules" (
  echo ⚠️  Installing dependencies...
  call npm install
  echo.
)

REM Run the image-specific tests
echo 🚀 Running tests...
echo.

call npm run test:images

echo.
echo ==================================
echo ✅ Test execution completed!
echo.
echo 📊 Reports:
echo    - HTML Report: ./playwright-report/index.html
echo    - JSON Report: ./test-results.json
echo.
echo 💡 To view results in UI mode, run:
echo    npm run test:images:ui
echo.
pause
