# Wait for Docker Desktop to be ready
Write-Host "`n⏳ Waiting for Docker Desktop to be ready..." -ForegroundColor Cyan

$maxAttempts = 30
$attempt = 0
$ready = $false

while ($attempt -lt $maxAttempts -and -not $ready) {
    $attempt++
    Write-Host "Attempt $attempt/$maxAttempts..." -ForegroundColor Gray
    
    try {
        $result = docker ps 2>&1
        if ($LASTEXITCODE -eq 0) {
            $ready = $true
            Write-Host "`n✅ Docker is ready!" -ForegroundColor Green
            docker ps
            break
        }
    } catch {
        # Continue waiting
    }
    
    if (-not $ready) {
        Start-Sleep -Seconds 2
    }
}

if (-not $ready) {
    Write-Host "`n⚠️  Docker Desktop is taking longer than expected" -ForegroundColor Yellow
    Write-Host "`nPlease check:" -ForegroundColor Yellow
    Write-Host "1. Docker Desktop window is open" -ForegroundColor White
    Write-Host "2. Look for whale icon 🐋 in system tray" -ForegroundColor White
    Write-Host "3. Wait for 'Docker Desktop is running' message" -ForegroundColor White
    Write-Host "`nThen run: docker ps" -ForegroundColor Cyan
} else {
    Write-Host "`n🎉 You can now run: npm run docker:build" -ForegroundColor Green
}

