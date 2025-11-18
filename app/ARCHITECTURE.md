# Flutter Wetter-App - Code-Struktur

## Projektstruktur

```
lib/
├── main.dart                    # App-Einstieg & Home-Page
├── controllers/
│   └── weather_controller.dart  # State-Management für Wetterdaten
├── models/
│   └── weather_models.dart      # Datenmodelle (WeatherForecast, etc.)
├── services/
│   └── open_meteo_service.dart  # API-Integration Open-Meteo
├── utils/
│   ├── constants.dart           # App-weite Konstanten (Farben, Spacing, etc.)
│   └── weather_scene_mapper.dart # Mapping: Wettercode → Animation/Icon
└── widgets/
    ├── daily_forecast_tile.dart      # Einzelne Tages-Kachel
    ├── error_view.dart                # Fehler-Ansicht mit Retry
    ├── forecast_view.dart             # Haupt-Wetteransicht
    ├── hourly_list.dart               # Stündliche Vorhersage (horizontal)
    ├── placeholder_message.dart       # Platzhalter für leere States
    └── sticky_header_delegate.dart    # Helper für Sticky Header
```

## Architektur-Prinzipien

### 1. **Separation of Concerns**

- **Controllers**: Business-Logik und State-Management
- **Services**: API-Calls und externe Datenquellen
- **Models**: Datenstrukturen
- **Widgets**: UI-Komponenten (wiederverwendbar)
- **Utils**: Helper-Funktionen und Konstanten

### 2. **Wiederverwendbarkeit**

Alle Widgets sind eigenständig und können in anderen Kontexten verwendet werden:

```dart
// Beispiel: ErrorView kann überall eingesetzt werden
ErrorView(
  message: 'Etwas ist schiefgelaufen',
  onRetry: () => _loadData(),
)
```

### 3. **Konstanten-Management**

Alle Wiederholten Numbers sind in `AppConstants` zentralisiert:

```dart
// Statt: padding: const EdgeInsets.all(16)
// Jetzt: padding: const EdgeInsets.all(AppConstants.spacingL)
```

### 4. **Type Safety**

- Alle Widgets haben explizite Typen
- `const` Konstruktoren wo möglich
- Null-Safety durchgängig

## Wichtige Komponenten

### WeatherController

Verwaltet den Zustand der App:

- `loadByLocation()` - Lädt Wetter basierend auf GPS
- `loadByCity(String)` - Lädt Wetter für eine Stadt
- `WeatherStatus` Enum für State-Tracking

### ForecastView

Haupt-Widget für Wetterdarstellung:

- Sticky Header mit aktuellem Wetter
- Horizontale stündliche Vorhersage
- Vertikale 7-Tage-Vorhersage

### AppConstants

Zentrale Konstanten für:

- Farben (`primaryColor`, `overlayLight`, etc.)
- Spacing (`spacingXS` bis `spacingXL`)
- Border Radius (`radiusS`, `radiusM`)
- Widget-Größen (`hourlyCardWidth`, etc.)
