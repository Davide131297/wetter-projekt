import 'package:flutter/material.dart';
import 'package:intl/date_symbol_data_local.dart';
import 'package:provider/provider.dart';
import 'package:weather_animation/weather_animation.dart';

import 'controllers/weather_controller.dart';
import 'services/open_meteo_service.dart';
import 'utils/constants.dart';
import 'utils/weather_scene_mapper.dart';
import 'widgets/error_view.dart';
import 'widgets/forecast_view.dart';
import 'widgets/placeholder_message.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await initializeDateFormatting('de');
  runApp(const WeatherApp());
}

class WeatherApp extends StatelessWidget {
  const WeatherApp({super.key});

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider(
      create: (_) =>
          WeatherController(const OpenMeteoService())..loadByLocation(),
      child: MaterialApp(
        title: 'Wetter Animation',
        theme: ThemeData(
          colorScheme: ColorScheme.fromSeed(
            seedColor: AppConstants.primaryColor,
          ),
          useMaterial3: true,
        ),
        home: const WeatherHomePage(),
      ),
    );
  }
}

class WeatherHomePage extends StatefulWidget {
  const WeatherHomePage({super.key});

  @override
  State<WeatherHomePage> createState() => _WeatherHomePageState();
}

class _WeatherHomePageState extends State<WeatherHomePage> {
  late final TextEditingController _controller;

  @override
  void initState() {
    super.initState();
    final initialQuery = context.read<WeatherController>().currentQuery;
    _controller = TextEditingController(text: initialQuery);
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Consumer<WeatherController>(
      builder: (context, controller, _) {
        final scene = controller.forecast != null
            ? chooseSceneForWeatherCode(controller.forecast!.weatherCode)
            : WeatherScene.sunset;

        return Scaffold(
          extendBodyBehindAppBar: true,
          body: Stack(
            fit: StackFit.expand,
            children: [scene.sceneWidget, _buildContent(controller)],
          ),
        );
      },
    );
  }

  Widget _buildContent(WeatherController controller) {
    switch (controller.status) {
      case WeatherStatus.initial:
        return const SafeArea(
          child: Padding(
            padding: EdgeInsets.all(AppConstants.spacingL),
            child: PlaceholderMessage(
              'Tippe auf das Standort-Icon oder gib einen Ort ein.',
            ),
          ),
        );
      case WeatherStatus.loading:
        return const SafeArea(
          child: Center(child: CircularProgressIndicator(color: Colors.white)),
        );
      case WeatherStatus.error:
        return SafeArea(
          child: Padding(
            padding: const EdgeInsets.all(AppConstants.spacingL),
            child: ErrorView(
              message: controller.errorMessage ?? 'Unbekannter Fehler',
              onRetry: () => controller.isUsingLocation
                  ? controller.loadByLocation()
                  : controller.loadByCity(_controller.text),
            ),
          ),
        );
      case WeatherStatus.loaded:
        final forecast = controller.forecast;
        if (forecast == null) {
          return const SafeArea(
            child: Padding(
              padding: EdgeInsets.all(AppConstants.spacingL),
              child: PlaceholderMessage('Keine Daten verfügbar.'),
            ),
          );
        }
        return ForecastView(forecast: forecast);
    }
  }
}
