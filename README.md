# eFit – Fitnessstudio Mobile App (Frontend-only SPA)

Single-Page-Anwendung ohne Backend. Läuft vollständig im Browser als simulierte Mobile-App.

## Features
- **Mobile-App-Optik**: Wird in einem Phone-Rahmen (390x844px) mit Notch angezeigt
- **Login & Registrierung**: Lokale Authentifizierung (kein Backend)
- **Dashboard**: Statistiken mit dynamischen SVG-Diagrammen
  - Hydration Level (simuliert)
  - Auslastung Fitnesstudio (Balkendiagramm)
  - Trainingshistorie (7 Tage)
- **Sport**: Vorselektierte Trainingspläne zum Auswählen
- **Ernährung**: Vorgefertigte Essensplan-Optionen
- **Profil**: Benutzerinformationen & Abmelden
- **Community**: Feed mit Posting-Funktion
- **Einchecken**: Optionale Geolocation-Integration

## Dateien
- `index.html` — HTML-Struktur (Mobile Layout)
- `style.css` — Styling (Grün-Design, Phone-Rahmen)
- `app.js` — Navigation, Diagramme, Interaktionen (SVG-Charts)
- `start.ps1` / `start.sh` — Startskripte

## Benutzung

### Mit Python HTTP Server (empfohlen):

**PowerShell**
```powershell
./start.ps1
```

**Terminal/Shell**
```bash
./start.sh
```

Dann im Browser: http://localhost:8000

### Direkt öffnen:
- Doppelklick auf `index.html`

## Dateneingaben

- **Trainingspläne**: 5 vordefinierte Pläne (HIIT, Kraft, Yoga, Full Body, Ausdauer)
- **Essenspläne**: 4 Pläne (Muskelaufbau, Fettabbau, Ausgewogen, Vegan Power)
- **Diagramme**: Daten werden künstlich generiert und aktualisieren sich bei jedem Dashboard-Besuch

## Technologie
- HTML5 + CSS3 (Mobile-First)
- Vanilla JavaScript (keine Abhängigkeiten)
- localStorage für Benutzerdaten
- SVG für Diagramme

