class HourlyForecast {
  const HourlyForecast({required this.time, required this.temperature});

  final DateTime time;
  final double temperature;
}

class DailyForecast {
  const DailyForecast({
    required this.date,
    required this.temperatureMax,
    required this.temperatureMin,
    required this.weatherCode,
  });

  final DateTime date;
  final double temperatureMax;
  final double temperatureMin;
  final int weatherCode;
}

class WeatherForecast {
  const WeatherForecast({
    required this.label,
    required this.latitude,
    required this.longitude,
    this.currentTemperature,
    this.weatherCode,
    this.currentTime,
    this.hourly = const <HourlyForecast>[],
    this.daily = const <DailyForecast>[],
  });

  final String label;
  final double latitude;
  final double longitude;
  final double? currentTemperature;
  final int? weatherCode;
  final DateTime? currentTime;
  final List<HourlyForecast> hourly;
  final List<DailyForecast> daily;
}

class WeatherException implements Exception {
  WeatherException(this.message);

  final String message;

  @override
  String toString() => message;
}
