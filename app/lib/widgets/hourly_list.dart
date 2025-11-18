import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

import '../models/weather_models.dart';
import '../utils/constants.dart';

/// Zeigt die stündliche Wettervorhersage horizontal scrollend an
class HourlyList extends StatelessWidget {
  const HourlyList({required this.hourly, super.key});

  final List<HourlyForecast> hourly;

  @override
  Widget build(BuildContext context) {
    if (hourly.isEmpty) {
      return const Center(child: Text('Keine Stundenwerte verfügbar.'));
    }

    final now = DateTime.now();
    final timeFormatter = DateFormat('HH:mm', 'de');

    // Filter: Zeige nur zukünftige Stunden, sonst die letzten 24
    final future = hourly.where((h) => !h.time.isBefore(now)).toList();
    final List<HourlyForecast> displayList;
    if (future.isNotEmpty) {
      displayList = future;
    } else {
      final start = hourly.length - AppConstants.maxHourlyItems;
      displayList = hourly.sublist(start < 0 ? 0 : start);
    }

    final itemCount = displayList.length > AppConstants.maxHourlyItems
        ? AppConstants.maxHourlyItems
        : displayList.length;

    return ListView.separated(
      scrollDirection: Axis.horizontal,
      itemBuilder: (context, index) {
        final item = displayList[index];
        final timeLabel = timeFormatter.format(item.time);
        final tempLabel = '${item.temperature.round()} °';

        return Container(
          width: AppConstants.hourlyCardWidth,
          padding: const EdgeInsets.all(AppConstants.spacingM),
          decoration: BoxDecoration(
            color: AppConstants.overlayLight.withAlpha(
              AppConstants.overlayAlphaMedium,
            ),
            borderRadius: BorderRadius.circular(AppConstants.radiusS),
          ),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text(timeLabel, style: Theme.of(context).textTheme.bodyMedium),
              const SizedBox(height: AppConstants.spacingM),
              Text(
                tempLabel,
                style: Theme.of(
                  context,
                ).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold),
              ),
            ],
          ),
        );
      },
      separatorBuilder: (_, __) => const SizedBox(width: AppConstants.spacingM),
      itemCount: itemCount,
    );
  }
}
