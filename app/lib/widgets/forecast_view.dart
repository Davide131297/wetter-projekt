import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

import '../models/weather_models.dart';
import '../utils/constants.dart';
import '../utils/weather_scene_mapper.dart';
import 'daily_forecast_tile.dart';
import 'hourly_list.dart';

/// Haupt-Ansicht für die Wettervorhersage mit aktuellem Wetter,
/// stündlicher und täglicher Prognose
class ForecastView extends StatelessWidget {
  const ForecastView({required this.forecast, super.key});

  final WeatherForecast forecast;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final currentTemp = forecast.currentTemperature != null
        ? '${forecast.currentTemperature!.round()} °C'
        : '–';
    final dateFormatter = DateFormat('EEE, dd.MM. HH:mm', 'de');
    final currentTimeLabel = forecast.currentTime != null
        ? dateFormatter.format(forecast.currentTime!)
        : 'Zeit unbekannt';

    final weather = describeWeather(forecast.weatherCode);

    return CustomScrollView(
      slivers: [
        // Top SafeArea Padding
        SliverPadding(
          padding: EdgeInsets.only(top: MediaQuery.of(context).padding.top),
        ),
        // Sticky Header mit aktuellem Wetter
        SliverPersistentHeader(
          pinned: true,
          delegate: _StickyWeatherHeader(
            forecast: forecast,
            currentTemp: currentTemp,
            currentTimeLabel: currentTimeLabel,
            weather: weather,
            theme: theme,
            maxHeight: AppConstants.stickyHeaderHeight,
            minHeight: 100.0,
          ),
        ),
        // Abstand nach Header
        const SliverToBoxAdapter(
          child: SizedBox(height: AppConstants.spacingXL),
        ),
        // Stündliche Vorhersage
        SliverToBoxAdapter(
          child: Padding(
            padding: const EdgeInsets.symmetric(
              horizontal: AppConstants.spacingL,
            ),
            child: _buildHourlySection(theme),
          ),
        ),
        // Abstand
        const SliverToBoxAdapter(
          child: SizedBox(height: AppConstants.spacingL),
        ),
        // 7-Tage Vorhersage - Header
        SliverToBoxAdapter(
          child: Padding(
            padding: const EdgeInsets.symmetric(
              horizontal: AppConstants.spacingL,
            ),
            child: Container(
              padding: const EdgeInsets.only(
                left: AppConstants.spacingL,
                right: AppConstants.spacingL,
                top: AppConstants.spacingL,
              ),
              decoration: BoxDecoration(
                color: AppConstants.overlayLight.withAlpha(
                  AppConstants.overlayAlphaLight,
                ),
                borderRadius: const BorderRadius.only(
                  topLeft: Radius.circular(AppConstants.radiusS),
                  topRight: Radius.circular(AppConstants.radiusS),
                ),
              ),
              child: Text(
                '7-Tage-Vorhersage',
                style: theme.textTheme.titleMedium,
              ),
            ),
          ),
        ),
        // 7-Tage Vorhersage - Liste (jeder Tag einzeln als Sliver)
        SliverPadding(
          padding: const EdgeInsets.symmetric(
            horizontal: AppConstants.spacingL,
          ),
          sliver: SliverList(
            delegate: SliverChildBuilderDelegate((context, index) {
              return Container(
                color: AppConstants.overlayLight.withAlpha(
                  AppConstants.overlayAlphaLight,
                ),
                padding: const EdgeInsets.symmetric(
                  horizontal: AppConstants.spacingL,
                ),
                child: DailyForecastTile(day: forecast.daily[index]),
              );
            }, childCount: forecast.daily.length),
          ),
        ),
        // 7-Tage Container - unterer Abschluss
        SliverToBoxAdapter(
          child: Padding(
            padding: const EdgeInsets.symmetric(
              horizontal: AppConstants.spacingL,
            ),
            child: Container(
              height: AppConstants.spacingL,
              decoration: BoxDecoration(
                color: AppConstants.overlayLight.withAlpha(
                  AppConstants.overlayAlphaLight,
                ),
                borderRadius: const BorderRadius.only(
                  bottomLeft: Radius.circular(AppConstants.radiusS),
                  bottomRight: Radius.circular(AppConstants.radiusS),
                ),
              ),
            ),
          ),
        ),
        // Extra Abstand am Ende - groß genug für SafeArea
        SliverPadding(
          padding: EdgeInsets.only(
            bottom:
                MediaQuery.of(context).padding.bottom +
                AppConstants.spacingXL * 3,
          ),
        ),
      ],
    );
  }

  Widget _buildHourlySection(ThemeData theme) {
    return Container(
      padding: const EdgeInsets.all(AppConstants.spacingL),
      decoration: BoxDecoration(
        color: AppConstants.overlayLight.withAlpha(
          AppConstants.overlayAlphaLight,
        ),
        borderRadius: BorderRadius.circular(AppConstants.radiusS),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Stündliche Vorschau', style: theme.textTheme.titleMedium),
          const SizedBox(height: AppConstants.spacingM),
          SizedBox(
            height: AppConstants.hourlyListHeight,
            child: HourlyList(hourly: forecast.hourly),
          ),
        ],
      ),
    );
  }
}

/// SliverPersistentHeaderDelegate für den Sticky Weather Header
class _StickyWeatherHeader extends SliverPersistentHeaderDelegate {
  _StickyWeatherHeader({
    required this.forecast,
    required this.currentTemp,
    required this.currentTimeLabel,
    required this.weather,
    required this.theme,
    required this.maxHeight,
    required this.minHeight,
  });

  final WeatherForecast forecast;
  final String currentTemp;
  final String currentTimeLabel;
  final ({Icon icon, String text}) weather;
  final ThemeData theme;
  final double maxHeight;
  final double minHeight;

  @override
  Widget build(
    BuildContext context,
    double shrinkOffset,
    bool overlapsContent,
  ) {
    // Berechne Fortschritt: 0.0 (voll ausgefahren) bis 1.0 (minimiert)
    final progress = (shrinkOffset / (maxHeight - minHeight)).clamp(0.0, 1.0);
    final isCompact = progress > 0.5;

    return Container(
      margin: const EdgeInsets.symmetric(horizontal: AppConstants.spacingL),
      padding: const EdgeInsets.all(AppConstants.spacingXL),
      decoration: BoxDecoration(
        color: Colors.transparent,
        borderRadius: BorderRadius.circular(AppConstants.radiusM),
      ),
      alignment: Alignment.center,
      child: Column(
        mainAxisSize: MainAxisSize.min,
        mainAxisAlignment: MainAxisAlignment.center,
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          // Standort - immer sichtbar
          Text(
            forecast.label,
            style: theme.textTheme.headlineSmall?.copyWith(
              color: Colors.white,
              fontWeight: FontWeight.bold,
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: AppConstants.spacingS),
          // Temperatur - immer sichtbar
          Text(
            currentTemp,
            style: theme.textTheme.displayLarge?.copyWith(
              color: Colors.white,
              fontWeight: FontWeight.w600,
            ),
            textAlign: TextAlign.center,
          ),
          // Wettercode und Zeit - nur wenn nicht kompakt
          if (!isCompact) ...[
            const SizedBox(height: AppConstants.spacingXS),
            Opacity(
              opacity: 1.0 - (progress * 2),
              child: Text(
                weather.text,
                style: const TextStyle(color: Colors.white),
                textAlign: TextAlign.center,
              ),
            ),
            const SizedBox(height: AppConstants.spacingXS),
            Opacity(
              opacity: 1.0 - (progress * 2),
              child: Text(
                'Stand: $currentTimeLabel',
                style: theme.textTheme.bodyMedium?.copyWith(
                  color: Colors.white,
                ),
                textAlign: TextAlign.center,
              ),
            ),
          ],
        ],
      ),
    );
  }

  @override
  double get maxExtent => maxHeight;

  @override
  double get minExtent => minHeight;

  @override
  bool shouldRebuild(covariant _StickyWeatherHeader oldDelegate) {
    return maxHeight != oldDelegate.maxHeight ||
        minHeight != oldDelegate.minHeight ||
        forecast != oldDelegate.forecast ||
        currentTemp != oldDelegate.currentTemp;
  }
}
