import 'package:english_words/english_words.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:http/http.dart' as http; // neu: http-Import

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider(
      create: (context) => MyAppState(),
      child: MaterialApp(
        title: 'Namer App',
        theme: ThemeData(
          colorScheme: ColorScheme.fromSeed(seedColor: const Color(0xFF01A5FF)),
        ),
        home: const MyHomePage(),
      ),
    );
  }
}

class MyAppState extends ChangeNotifier {
  // store the current word pair and notify listeners on change
  WordPair current = WordPair.random();

  MyAppState() {
    _init();
  }

  Future<void> _init() async {
    try {
      final res = await fetchWeatherData();
      print('fetchWeatherData: ${res.body}');
    } catch (e) {
      print('fetchWeatherData error: $e');
    }
  }

  void generateNext() {
    current = WordPair.random();
    notifyListeners();
  }

  Future<http.Response> fetchWeatherData() {
    return http.get(
      Uri.parse(
        'https://api.open-meteo.com/v1/forecast?latitude=50.9333&longitude=6.95&hourly=temperature_2m&timezone=Europe%2FBerlin&forecast_days=1',
      ),
    );
  }
}

class MyHomePage extends StatelessWidget {
  const MyHomePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        minimum: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [Text('Start App Development with Flutter')],
        ),
      ),
    );
  }
}
