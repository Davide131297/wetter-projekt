# Wetter-App

Eine moderne Wetter-Applikation gebaut mit Next.js, TypeScript, Tailwind CSS und shadcn/ui.

## Features

- 🌤️ Aktuelle Wettervorhersage
- 📅 7-Tage-Vorhersage
- ⏱️ Stündliche Vorhersage (24 Stunden)
- 🔍 Standortsuche mit Autocomplete und Flaggen
- 🌍 Unterstützung für weltweite Standorte
- 📱 Responsive Design

## Technologie-Stack

- **Framework**: Next.js 16 (App Router)
- **Sprache**: TypeScript
- **Styling**: Tailwind CSS
- **UI-Komponenten**: shadcn/ui
- **Wetter-API**: Open-Meteo (openmeteo npm package)
- **Icons**: Lucide React

## Projekt-Struktur

Dies ist ein Monorepo mit folgender Struktur:

```
wetter-projekt/
├── webseite/          # Next.js Applikation
│   ├── app/           # Next.js App Router
│   ├── components/    # React Komponenten
│   └── lib/           # Utility-Funktionen
└── package.json       # Root package.json für Workspace
```

## Installation & Start

### Voraussetzungen

- Node.js 18+
- npm oder yarn

### Entwicklungsserver starten

```bash
# Im Root-Verzeichnis
npm run dev

# Oder direkt im webseite Ordner
cd webseite
npm run dev
```

Die Applikation ist dann unter [http://localhost:3000](http://localhost:3000) verfügbar.

### Build für Production

```bash
npm run build
npm run start
```

## Verwendung

1. **Startseite**: Willkommensseite mit Anleitung
2. **Standortsuche**: Nutze die Suchleiste in der Navbar, um einen Standort zu suchen
3. **Wettervorhersage**: Nach Auswahl eines Standorts wird die Wettervorhersage angezeigt
4. **Historisch**: Platzhalter-Seite für zukünftige Features

## API

Die App nutzt die Open-Meteo API:

- **Geocoding**: `https://geocoding-api.open-meteo.com/v1/search`
- **Wettervorhersage**: `https://api.open-meteo.com/v1/forecast`

Keine API-Keys erforderlich! Open-Meteo ist eine kostenlose, offene Wetter-API.

