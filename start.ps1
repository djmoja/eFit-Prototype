# Startskript für PowerShell
# Versucht, einen Python HTTP Server zu starten (Port 8000). Wenn Python nicht gefunden wird, öffnet es index.html.
$py = Get-Command python -ErrorAction SilentlyContinue
if (-not $py) { $py = Get-Command python3 -ErrorAction SilentlyContinue }
if ($py) {
  Write-Host "Starte lokalen Server auf http://localhost:8000 (mit Ctrl+C stoppen)"
  & $py.Path -m http.server 8000
} else {
  Write-Host "Python nicht gefunden. Öffne index.html im Standardbrowser."
  Start-Process index.html
}
