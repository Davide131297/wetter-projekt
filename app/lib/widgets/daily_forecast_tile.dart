import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

import '../models/weather_models.dart';
import '../utils/constants.dart';
import '../utils/weather_scene_mapper.dart';

/// Zeigt eine einzelne Tagesvorhersage als Zeile an
class DailyForecastTile extends StatelessWidget {
  const DailyForecastTile({required this.day, super.key});

  final DailyForecast day;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final dayFormatter = DateFormat('EEE, dd.MM.', 'de');
    final dayLabel = dayFormatter.format(day.date);
    final maxTemp = '${day.temperatureMax.round()} °';
    final minTemp = '${day.temperatureMin.round()} °';
    final weather = describeWeather(day.weatherCode);

    return Padding(
      padding: const EdgeInsets.symmetric(vertical: AppConstants.spacingS),
      child: Row(
        children: [
          Expanded(
            flex: 3,
            child: Text(
              dayLabel,
              style: theme.textTheme.bodyLarge?.copyWith(
                fontWeight: FontWeight.w500,
              ),
            ),
          ),
          Expanded(flex: 4, child: weather.icon),
          Expanded(
            flex: 2,
            child: Row(
              mainAxisAlignment: MainAxisAlignment.end,
              children: [
                Text(
                  maxTemp,
                  style: theme.textTheme.bodyMedium?.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
                ),
                Text(
                  ' / ',
                  style: theme.textTheme.bodyMedium?.copyWith(
                    color: Colors.grey,
                  ),
                ),
                Text(
                  minTemp,
                  style: theme.textTheme.bodyMedium?.copyWith(
                    color: Colors.grey,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
