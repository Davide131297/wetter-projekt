import 'package:flutter/foundation.dart';

import '../models/weather_models.dart';
import '../services/open_meteo_service.dart';

enum WeatherStatus { initial, loading, loaded, error }

/// Controller für Wetterdaten-Management und State
class WeatherController extends ChangeNotifier {
  WeatherController(this._service);

  final OpenMeteoService _service;

  WeatherStatus status = WeatherStatus.initial;
  WeatherForecast? forecast;
  String? errorMessage;
  String _currentQuery = '';
  bool _isUsingLocation = false;

  String get currentQuery => _currentQuery;
  bool get isUsingLocation => _isUsingLocation;

  /// Lädt Wetterdaten basierend auf dem aktuellen Standort
  Future<void> loadByLocation() async {
    status = WeatherStatus.loading;
    errorMessage = null;
    _isUsingLocation = true;
    notifyListeners();

    try {
      final result = await _service.fetchWeatherByCurrentLocation();
      forecast = result;
      _currentQuery = result.label;
      status = WeatherStatus.loaded;
    } on WeatherException catch (e) {
      errorMessage = e.message;
      status = WeatherStatus.error;
      _isUsingLocation = false;
    } catch (e) {
      errorMessage = 'Standort konnte nicht ermittelt werden: ${e.toString()}';
      status = WeatherStatus.error;
      _isUsingLocation = false;
    }

    notifyListeners();
  }

  /// Lädt Wetterdaten für eine bestimmte Stadt
  Future<void> loadByCity(String city) async {
    final trimmed = city.trim();
    if (trimmed.isEmpty) {
      errorMessage = 'Bitte gib einen Ortsnamen ein.';
      status = WeatherStatus.error;
      notifyListeners();
      return;
    }

    status = WeatherStatus.loading;
    errorMessage = null;
    notifyListeners();

    try {
      final result = await _service.fetchWeather(trimmed);
      forecast = result;
      _currentQuery = trimmed;
      _isUsingLocation = false;
      status = WeatherStatus.loaded;
    } on WeatherException catch (e) {
      errorMessage = e.message;
      status = WeatherStatus.error;
    } catch (e) {
      errorMessage = 'Etwas ist schiefgelaufen: ${e.toString()}';
      status = WeatherStatus.error;
    }

    notifyListeners();
  }
}
