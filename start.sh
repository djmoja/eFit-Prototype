

# Startbefehl Terminal: python3 -m http.server 8000

if command -v python3 >/dev/null 2>&1; then
  echo "Starting server on http://localhost:8000"
  python3 -m http.server 8000
elif command -v python >/dev/null 2>&1; then
  echo "Starting server on http://localhost:8000"
  python -m http.server 8000
else
  echo "No python found — opening index.html"
  if command -v xdg-open >/dev/null 2>&1; then
    xdg-open index.html
  else
    open index.html 2>/dev/null || echo "Please open index.html manually."
  fi
fi
