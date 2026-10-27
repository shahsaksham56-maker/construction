# Zero-dependency local web server for Windows PowerShell
$port = 3000
$url = "http://localhost:$port/"
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add($url)

try {
    $listener.Start()
    Write-Host "==========================================================" -ForegroundColor Cyan
    Write-Host "  SHRI RADHA RANI CONSTRUCTION LOCAL WEB SERVER RUNNING" -ForegroundColor Green
    Write-Host "  URL: $url" -ForegroundColor Yellow
    Write-Host "  Opening in default browser..." -ForegroundColor Cyan
    Write-Host "  Press Ctrl+C in this terminal to stop the server." -ForegroundColor Gray
    Write-Host "==========================================================" -ForegroundColor Cyan

    Start-Process $url

    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $path = $request.Url.LocalPath.TrimStart('/')
        if ($path -eq "" -or $path -eq "/") { $path = "index.html" }
        $path = $path.Replace('/', '\')
        $filePath = Join-Path (Get-Location) $path

        # Resolve clean URLs
        if (-not (Test-Path $filePath -PathType Leaf)) {
            if (Test-Path "$filePath.html" -PathType Leaf) {
                $filePath = "$filePath.html"
            } elseif (Test-Path "$filePath\index.html" -PathType Leaf) {
                $filePath = "$filePath\index.html"
            }
        }

        if (Test-Path $filePath -PathType Leaf) {
            $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
            $contentType = switch ($ext) {
                ".html" { "text/html; charset=utf-8" }
                ".css"  { "text/css; charset=utf-8" }
                ".js"   { "application/javascript; charset=utf-8" }
                ".mjs"  { "application/javascript; charset=utf-8" }
                ".json" { "application/json; charset=utf-8" }
                ".jpg"  { "image/jpeg" }
                ".jpeg" { "image/jpeg" }
                ".png"  { "image/png" }
                ".webp" { "image/webp" }
                ".svg"  { "image/svg+xml" }
                ".woff2"{ "font/woff2" }
                Default { "application/octet-stream" }
            }

            $bytes = [System.IO.File]::ReadAllBytes($filePath)
            $response.ContentType = $contentType
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            $response.StatusCode = 404
            $notFoundPath = Join-Path (Get-Location) "404.html"
            if (Test-Path $notFoundPath) {
                $bytes = [System.IO.File]::ReadAllBytes($notFoundPath)
                $response.ContentType = "text/html; charset=utf-8"
                $response.ContentLength64 = $bytes.Length
                $response.OutputStream.Write($bytes, 0, $bytes.Length)
            } else {
                $errBytes = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
                $response.OutputStream.Write($errBytes, 0, $errBytes.Length)
            }
        }
        $response.Close()
    }
} finally {
    $listener.Stop()
}
