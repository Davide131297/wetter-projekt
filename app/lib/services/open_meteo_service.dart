import 'dart:convert';
import 'dart:math' as math;

import 'package:geolocator/geolocator.dart';
import 'package:http/http.dart' as http;

import '../models/weather_models.dart';

class OpenMeteoService {
  const OpenMeteoService({http.Client? client}) : _client = client;

  final http.Client? _client;

  Future<WeatherForecast> fetchWeatherByCurrentLocation() async {
    final position = await _determinePosition();
    final label = await _getLocationLabel(
      position.latitude,
      position.longitude,
    );
    return _fetchForecast((position.latitude, position.longitude, label));
  }

  Future<WeatherForecast> fetchWeather(String query) async {
    final location = await _resolveLocation(query);
    return _fetchForecast(location);
  }

  Future<Position> _determinePosition() async {
    bool serviceEnabled;
    LocationPermission permission;

    serviceEnabled = await Geolocator.isLocationServiceEnabled();
    if (!serviceEnabled) {
      throw WeatherException('Standortdienste sind deaktiviert.');
    }

    permission = await Geolocator.checkPermission();
    if (permission == LocationPermission.denied) {
      permission = await Geolocator.requestPermission();
      if (permission == LocationPermission.denied) {
        throw WeatherException('Standortberechtigung wurde verweigert.');
      }
    }

    if (permission == LocationPermission.deniedForever) {
      throw WeatherException('Standortberechtigung ist dauerhaft verweigert.');
    }

    return await Geolocator.getCurrentPosition(
      locationSettings: const LocationSettings(accuracy: LocationAccuracy.high),
    );
  }

  Future<String> _getLocationLabel(double latitude, double longitude) async {
    try {
      final uri =
          Uri.https('api.bigdatacloud.net', '/data/reverse-geocode-client', {
            'latitude': latitude.toString(),
            'longitude': longitude.toString(),
            'localityLanguage': 'de',
          });

      final response = await _send(uri);
      if (response.statusCode != 200) {
        return '${latitude.toStringAsFixed(2)}°, ${longitude.toStringAsFixed(2)}°';
      }

      final data = jsonDecode(response.body) as Map<String, dynamic>;
      final city = (data['city'] as String?)?.trim();
      final locality = (data['locality'] as String?)?.trim();

      if (city != null && city.isNotEmpty) return city;
      if (locality != null && locality.isNotEmpty) return locality;

      return '${latitude.toStringAsFixed(2)}°, ${longitude.toStringAsFixed(2)}°';
    } catch (e) {
      return '${latitude.toStringAsFixed(2)}°, ${longitude.toStringAsFixed(2)}°';
    }
  }

  Future<(double latitude, double longitude, String label)> _resolveLocation(
    String query,
  ) async {
    final normalizedQuery = query.trim();
    if (normalizedQuery.isEmpty) {
      throw WeatherException('Bitte gib einen Ortsnamen ein.');
    }

    final uri = Uri.https('geocoding-api.open-meteo.com', '/v1/search', {
      'name': normalizedQuery,
      'count': '1',
      'language': 'de',
      'format': 'json',
    });

    final response = await _send(uri);
    if (response.statusCode != 200) {
      throw WeatherException(
        'Geocoding fehlgeschlagen (Status ${response.statusCode}).',
      );
    }

    final payload = jsonDecode(response.body) as Map<String, dynamic>;
    final results = payload['results'] as List<dynamic>?;
    if (results == null || results.isEmpty) {
      throw WeatherException('Für "$normalizedQuery" wurde kein Ort gefunden.');
    }

    final first = results.first as Map<String, dynamic>;
    final latitude = (first['latitude'] as num).toDouble();
    final longitude = (first['longitude'] as num).toDouble();
    final name = first['name'] as String? ?? normalizedQuery;

    final buffer = StringBuffer(name);

    return (latitude, longitude, buffer.toString());
  }

  Future<WeatherForecast> _fetchForecast(
    (double, double, String) location,
  ) async {
    final (latitude, longitude, label) = location;

    final uri = Uri.https('api.open-meteo.com', '/v1/forecast', {
      'latitude': latitude.toStringAsFixed(4),
      'longitude': longitude.toStringAsFixed(4),
      'hourly': 'temperature_2m',
      'daily': 'temperature_2m_max,temperature_2m_min,weather_code',
      'current': 'temperature_2m,weather_code',
      'forecast_days': '7',
      'timezone': 'auto',
    });

    final response = await _send(uri);
    if (response.statusCode != 200) {
      throw WeatherException(
        'Vorhersage nicht verfügbar (Status ${response.statusCode}).',
      );
    }

    final payload = jsonDecode(response.body) as Map<String, dynamic>;

    final current = payload['current'] as Map<String, dynamic>?;
    final currentTemp = (current?['temperature_2m'] as num?)?.toDouble();
    final currentWeatherCode = (current?['weather_code'] as num?)?.toInt();
    final currentTimeRaw = current?['time'] as String?;
    final currentTime = currentTimeRaw != null
        ? DateTime.parse(currentTimeRaw).toLocal()
        : null;

    final hourly = payload['hourly'] as Map<String, dynamic>?;
    final timesRaw = hourly?['time'] as List<dynamic>? ?? <dynamic>[];
    final tempsRaw = hourly?['temperature_2m'] as List<dynamic>? ?? <dynamic>[];

    final length = math.min(timesRaw.length, tempsRaw.length);
    final hourlyForecast = <HourlyForecast>[];
    for (var i = 0; i < length; i++) {
      final timeString = timesRaw[i] as String;
      final tempValue = tempsRaw[i] as num;
      hourlyForecast.add(
        HourlyForecast(
          time: DateTime.parse(timeString).toLocal(),
          temperature: tempValue.toDouble(),
        ),
      );
    }

    final daily = payload['daily'] as Map<String, dynamic>?;
    final dailyTimesRaw = daily?['time'] as List<dynamic>? ?? <dynamic>[];
    final dailyMaxTempsRaw =
        daily?['temperature_2m_max'] as List<dynamic>? ?? <dynamic>[];
    final dailyMinTempsRaw =
        daily?['temperature_2m_min'] as List<dynamic>? ?? <dynamic>[];
    final dailyWeatherCodesRaw =
        daily?['weather_code'] as List<dynamic>? ?? <dynamic>[];

    final dailyLength = math.min(
      dailyTimesRaw.length,
      math.min(
        dailyMaxTempsRaw.length,
        math.min(dailyMinTempsRaw.length, dailyWeatherCodesRaw.length),
      ),
    );
    final dailyForecast = <DailyForecast>[];
    for (var i = 0; i < dailyLength; i++) {
      final dateString = dailyTimesRaw[i] as String;
      final maxTemp = (dailyMaxTempsRaw[i] as num).toDouble();
      final minTemp = (dailyMinTempsRaw[i] as num).toDouble();
      final code = (dailyWeatherCodesRaw[i] as num).toInt();
      dailyForecast.add(
        DailyForecast(
          date: DateTime.parse(dateString),
          temperatureMax: maxTemp,
          temperatureMin: minTemp,
          weatherCode: code,
        ),
      );
    }

    return WeatherForecast(
      label: label,
      latitude: (payload['latitude'] as num?)?.toDouble() ?? latitude,
      longitude: (payload['longitude'] as num?)?.toDouble() ?? longitude,
      currentTemperature: currentTemp,
      weatherCode: currentWeatherCode,
      currentTime: currentTime,
      hourly: hourlyForecast,
      daily: dailyForecast,
    );
  }

  Future<http.Response> _send(Uri uri) {
    final client = _client;
    if (client != null) {
      return client.get(uri);
    }
    return http.get(uri);
  }
}
